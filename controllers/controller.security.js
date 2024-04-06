// -- Welcome page
const { Op } = require('sequelize');
const { create } = require('./controller.user')
const { schematics } = require('../services/service.sequelize');
const { User } = schematics;
const { generateHash, sign, verify } = require('../services/service.crypto');

let connectedUsers = []

exports.signIn = (req, res) => {
  const {identifier, password} = req.body

  User.findOne({
    where: {
      [Op.or]: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() }
      ]
    }
  })
  .then(u => {
    if(u && generateHash(password, u.salt) == u.hash) {
      const {id, username, email, createdAt, updatedAt} = u;

      const access = sign({
        user: { id, username, email, createdAt, updatedAt },
        exp: config.credentials.jwt.token.access.expiration
      }, 
      config.credentials.jwt.token.access.secret)

      const refresh = sign({
        user: { id, username, email, createdAt, updatedAt },
        exp: config.credentials.jwt.token.refresh.expiration
      }, 
      config.credentials.jwt.token.refresh.secret)

      if(!connectedUsers.includes(id))
        connectedUsers.push(id);

      return res
      .status(201)
      .cookie('refreshToken', refresh, { httpOnly: true, sameSite: 'strict' })
      .header('Authorization', `Bearer ${access}`)
      .send({
        user: { id, username, email, createdAt, updatedAt }
      })
    } else 
      return res.status(401).send({
        message: 'Incorrect login/email combination.'
      })
  })
  .catch(e => {
    return res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.signUp = create({from: 'security'})

exports.signOut = (req, res) => {    
  const { authorization } = req.headers;

  if (!authorization) 
    return res.status(400).send({message: 'No access token provided.'});

  let message = 'Sign out successfully completed.';
  let code = 200;
  
  try {
    const access = authorization.split(' ')[1];

    const jwtVerified = verify(access, config.credentials.jwt.token.access.secret);

    if(!jwtVerified.valid)
      return res.status(200).send({message: 'The user is not logged.'});
  
    const userUUIDIndex = connectedUsers.findIndex((uuid) => uuid == jwtVerified.payload.user.id);
  
    if(userUUIDIndex != -1)
      connectedUsers.splice(userUUIDIndex, 1);
    else
      message = 'The user is not logged.'
  } catch(e) {
    console.log(e)
    message = 'Internal Server Error';
    code = 500;
  } finally {
    return res.status(code).send({ 
      message
    })
  }
}

exports.refresh = (req, res) => {
  const cookies = req.headers.cookie;
  let refresh;
  
  try{
    refresh = cookies
    .split(';')
    .map(cookie => cookie.trim().split('='))
    .find(cookie => cookie[0] === 'refreshToken')[1];

    if (!refresh) 
      throw new Error()

  } catch {
    return res.status(400).send({message: 'No refresh token provided.'});
  }

  try {
    const jwtVerified = verify(refresh, config.credentials.jwt.token.refresh.secret);

    if(!connectedUsers.includes(jwtVerified.payload.user.id))
      return res.status(401).send({message: 'Not authorized to refresh token.'});
    
    if(!jwtVerified.valid)
      throw new Error()

    const access = sign({
      user: jwtVerified.payload.user,
      exp: config.credentials.jwt.token.access.expiration
    }, 
    config.credentials.jwt.token.access.secret)

    return res
    .status(200)
    .header('Authorization', `Bearer ${access}`)
    .send({ user: jwtVerified.payload.user });

  } catch (error) {
    return res.status(400).send({message: 'Invalid refresh token.'});
  }

}
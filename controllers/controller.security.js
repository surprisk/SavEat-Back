// -- Welcome page
const { Op } = require('sequelize');
const { create } = require('./controller.user')
const { schematics } = require('../services/service.sequelize');
const { User } = schematics;
const { generateHash, sign, verify, generateUUID } = require('../services/service.crypto');

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
        id: id,
        exp: config.credentials.jwt.token.access.expiration
      }, 
      config.credentials.jwt.token.access.secret)

      const refresh = sign({
        exp: config.credentials.jwt.token.refresh.expiration
      }, 
      config.credentials.jwt.token.refresh.secret)

      if(!connectedUsers.includes(id))
        connectedUsers.push(id);

      return res.status(201).send({
        user: { id, username, email, createdAt, updatedAt },
        tokens: {
          access,
          refresh
        }
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
  const { access } = req.body?.tokens;

  let message = 'Sign out successfully completed.';
  let code = 200;
  
  try {
    const jwtVerified = verify(access, config.credentials.jwt.token.access.secret);
  
    const userUUIDIndex = connectedUsers.findIndex((uuid) => uuid == jwtVerified.payload.id);
  
    if(userUUIDIndex != -1)
      connectedUsers.splice(userUUIDIndex, 1);
    else
      message =  'The user was already logged out.'

  } catch {
    message = 'Internal Server Error';
    code = 500;
  } finally {
    return res.status(code).send({ 
      message
    })
  }
}

exports.refresh = (req, res) => {
  
}
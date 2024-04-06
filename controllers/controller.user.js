// -- Welcome page
const { schematics } = require('../services/service.sequelize');
const { User } = schematics;
const allowedFields = ['username', 'email', 'password', 'salt', 'hash']

exports.all = (req, res) => {
  User.findAll({attributes: {exclude: ['hash', 'salt']}})
  .then(u => {
    return res.status(201).send({
      Users: u
    })
  })
  .catch(e => {
    return res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.create = (options) => (req, res) => {
  console.log(options)
  User.create(
    {...req.body}, 
    { fields: allowedFields })
    .then(u => {
      const { id, username, email, createdAt, updatedAt } = u

      return res.status(201).send({
        user: { id, username, email, createdAt, updatedAt}
      })
    })
    .catch(e => {
      let message;

      switch(e.name) {
        case "SequelizeUniqueConstraintError": 
          message = 'The username or e-mail address is already in use.';
          break;
        case "SequelizeValidationError": 
          message = "The username or e-mail doesn't match authorized patterns.";
          break;
        default: message = 'Internal Server Error.';

      }

      return res.status(500).send({
        message
      })
    });
}

exports.read = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id
    },
    attributes: { 
      exclude: ['hash', 'salt']
    }
  })
  .then(u => {
    return res.status(u ? 201 : 404).send(u ? 
      {
        user: u
      } : 
      {
        message: "Resource not found"
      })
  })
  .catch(e => {
    return res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.update = (req, res) => {
  User.update({ ...req.body }, {
    fields: allowedFields,
    where: {
      id: req.params.id
    },
    individualHooks: true
  })
  .then(u => {

    return u[0] > 0 ?
      User.findOne({
        where: {
          id: req.params.id
        },
        attributes: { 
          exclude: ['hash', 'salt'] 
        }
      }) :
      false

  })
  .then(updated => {
    return res.status(updated ? 201 : 404).send(updated ? 
    {
      user: updated
    } :
    {
      message: "Resource not found"
    })
  })
  .catch(e => {
    let message;

      switch(e.name) {
        case "SequelizeUniqueConstraintError": 
          message = 'The username or e-mail address is already in use.';
          break;
        case "SequelizeValidationError": 
          message = "The username or e-mail doesn't match authorized patterns.";
          break;
        default: message = 'Internal Server Error.';

      }

      return res.status(500).send({
        message
      })
  });
}

exports.delete = (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(u => {
    const deleted = u > 0;

    return res.status(deleted ? 201 : 404).send(deleted ?
      {
        user: { id: req.params.id }
      } :
      {
        message: "Resource not found"
      })
  })
  .catch(e => {
    return res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}
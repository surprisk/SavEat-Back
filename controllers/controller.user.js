// -- Welcome page
const { schematics } = require('../services/service.sequelize');
const { User } = schematics;
const allowedFields = ['username', 'email', 'password', 'salt', 'hash']

exports.all = (req, res) => {
  User.findAll()
  .then(u => {
    res.status(201).send({
      Users: u
    })
  })
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.create = (req, res) => {
  User.create(
    {...req.body}, 
    { fields: allowedFields })
    .then(u => {
      res.status(201).send({
        user: u.dataValues
      })
    })
    .catch(e => {
      console.log(e)
      res.status(500).send({
        message: 'Internal Server Error'
      })
    });
}

exports.read = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(u => {
    res.status(u ? 201 : 404).send(u ? 
      {
        user: u,
        message: "Read succeful"
      }: 
      {
        message: "Resource not found"
      })
  })
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.update = (req, res) => {
  User.update({ ...req.body }, {
    fields: allowedFields,
    where: {
      id: req.params.id
    }
  })
  .then(u => {

    return u[0] > 0 ?
      User.findOne({
        where: {
          id: req.params.id
        }
      }) :
      false

  })
  .then(updated => {
    return res.status(updated ? 201 : 404).send({
      message: updated || "Resource not found"
    })
  })
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
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

    return res.status(deleted ? 201 : 404).send({
      message: deleted ? "Delete succeful" : "Resource not found"
    })
  })
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}
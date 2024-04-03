// -- Welcome page
const { schematics } = require('../services/service.sequelize');
const { Unit } = schematics;
const allowedFields = ['name', 'label']

exports.all = (req, res) => {
  Unit.findAll()
  .then(u => {
    res.status(201).send({
      Units: u
    })
  })
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.create = (req, res) => {
  Unit.create(
    {...req.body}, 
    { fields: allowedFields })
    .then(u => {
      res.status(201).send({
        unit: u.dataValues
      })
    })
    .catch(e => {
      res.status(500).send({
        message: 'Internal Server Error'
      })
    });
}

exports.read = (req, res) => {
  Unit.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(u => {
    res.status(u ? 201 : 404).send(u ? 
      {
        unit: u,
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
  Unit.update({ ...req.body }, {
    fields: allowedFields,
    where: {
      id: req.params.id
    }
  })
  .then(u => {

    return u[0] > 0 ?
      Unit.findOne({
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
  Unit.destroy({
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
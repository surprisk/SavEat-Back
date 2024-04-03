// -- Welcome page
const { schematics } = require('../services/service.sequelize');
const { Category } = schematics;
const allowedFields = ['name', 'description', 'type']

exports.all = (req, res) => {
  Category.findAll()
  .then(c => {
    res.status(201).send({
      categories: c
    })
  })
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.create = (req, res) => {
  Category.create(
    {...req.body}, 
    { fields: allowedFields })
    .then(c => {
      res.status(201).send({
        category: c.dataValues
      })
    })
    .catch(e => {
      res.status(500).send({
        message: 'Internal Server Error'
      })
    });
}

exports.read = (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(c => {
    res.status(c ? 201 : 404).send(c ? 
      {
        category: c,
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
  Category.update({ ...req.body }, {
    fields: allowedFields,
    where: {
      id: req.params.id
    }
  })
  .then(c => {

    return c[0] > 0 ?
      Category.findOne({
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
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(c => {
    const deleted = c > 0;

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
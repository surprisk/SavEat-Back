// -- Welcome page
const { schematics } = require('../services/service.sequelize');
const { Ingredient } = schematics;
const allowedFields = ['name', 'description', 'image']

exports.all = (req, res) => {
  Ingredient.findAll()
  .then(i => {
    res.status(201).send({
      ingredients: i
    })
  })
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.create = (req, res) => {
  Ingredient.create(
    {...req.body}, 
    { fields: allowedFields })
    .then(i => {
      res.status(201).send({
        ingredient: i.dataValues
      })
    })
    .catch(e => {
      res.status(500).send({
        message: 'Internal Server Error'
      })
    });
}

exports.read = (req, res) => {
  Ingredient.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(i => {
    res.status(i ? 201 : 404).send(i ? 
      {
        ingredient: i,
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
  Ingredient.update({ ...req.body }, {
    fields: allowedFields,
    where: {
      id: req.params.id
    }
  })
  .then(i => {

    return i[0] > 0 ?
      Ingredient.findOne({
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
  Ingredient.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(i => {
    const deleted = i > 0;

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
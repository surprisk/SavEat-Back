// -- Welcome page
const { schematics } = require('../services/service.sequelize');
const { Recipe } = schematics;
const allowedFields = ['name', 'description']

exports.all = (req, res) => {
  Recipe.findAll()
  .then(r => {
    res.status(201).send({
      Recipes: r
    })
  })
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}

exports.create = (req, res) => {
  Recipe.create(
    {...req.body}, 
    { fields: allowedFields })
    .then(r => {
      res.status(201).send({
        recipe: r.dataValues
      })
    })
    .catch(e => {
      res.status(500).send({
        message: 'Internal Server Error'
      })
    });
}

exports.read = (req, res) => {
  Recipe.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(r => {
    res.status(r ? 201 : 404).send(r ? 
      {
        recipe: r,
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
  Recipe.update({ ...req.body }, {
    fields: allowedFields,
    where: {
      id: req.params.id
    }
  })
  .then(r => {

    return r[0] > 0 ?
      Recipe.findOne({
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
  Recipe.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(r => {
    const deleted = r > 0;

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
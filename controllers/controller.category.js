// -- Welcome page
const { schematics } = require('../services/service.sequelize');
const { Category } = schematics;

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
    { fields: ['name', 'description'] })
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
  Category.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(c => {
    res.status(201).send({
      category: c
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
    fields: ['name', 'description'],
    where: {
      id: req.params.id
    }
  })
  .then(c => {
    res.status(201).send({
      category: c
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
  .catch(e => {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  });
}
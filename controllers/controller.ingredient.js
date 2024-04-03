// -- Welcome page
const { schematics } = require('../services/service.sequelize');

exports.all = (req, res) => {
  schematics.Ingredient.findAll()
  .then(ingredients => {
    console.log(ingredients)
  })
}

exports.create = (req, res) => {
  schematics.Ingredient.create(
    {...req.body}, 
    { fields: ['name', 'description', 'image'] })
}

exports.read = (req, res) => {

}

exports.update = (req, res) => {

}

exports.delete = (req, res) => {

}
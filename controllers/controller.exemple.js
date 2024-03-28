// -- Welcome page
const { User } = require('../services/service.schematics');

exports.welcome = async(req, res) => {
    const jane = await Schematics.User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20),
      });
}

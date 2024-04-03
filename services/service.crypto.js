const crypto = require('crypto');

exports.generateSalt = () => crypto.randomBytes(16).toString('hex');

exports.generateHash = (password, salt) => crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
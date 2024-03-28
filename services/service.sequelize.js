const { Sequelize, DataTypes } = require('sequelize');

exports.db = db = new Sequelize(config.global.SEQUELIZE);

exports.schematics = {
    User: db.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }),
    Ingredient: db.define('Ingredient', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        image: DataTypes.BLOB
    })
}

exports.initialize = function () {
    db.authenticate()
    .then(() => {
        console.log('\x1b[32m✅ Connection has been established successfully.', '\x1b[0m\n');
        
        db.sync()
        .then(() => {
            console.log('\x1b[32m✅ Schematics synchronization successfully completed.', '\x1b[0m')
        })
        .catch((error) => {
            console.error('\x1b[31m', '❌ Unable to synchronize schematics:', error, '\x1b[0m')
        })
    })
    .catch((error) => {
        console.error('\x1b[31m', '❌ Unable to connect to the database:', error, '\x1b[0m\n');
    })
}
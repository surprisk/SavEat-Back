const { Sequelize, DataTypes } = require('sequelize');

exports.db = new Sequelize(config.credentials.sequelize.connection);

// Schematics
exports.schematics = {
    Setting: this.db.define('Setting', { 
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        value: DataTypes.JSON
    }),
    User: this.db.define('User', {
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
    Ingredient: this.db.define('Ingredient', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.BLOB
        }
    }),
    Recipe: this.db.define('Recipe', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
    }),
    Quantity: this.db.define('Quantity', {
        value: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
    }),
    Unit: this.db.define('Unit', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }),
    Category: this.db.define('Category', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING
        }
    })
}

const {User, Recipe, Ingredient, Category, Quantity, Unit } = this.schematics

// Associations
User.Recipe = User.hasMany(Recipe);

Recipe.User = Recipe.belongsTo(User);
Recipe.Ingredient = Recipe.belongsToMany(Ingredient, { through: Quantity });

Ingredient.Recipe = Ingredient.belongsToMany(Recipe, { through: Quantity });
Ingredient.Category = Ingredient.hasMany(Category);

Category.Ingredient = Category.hasMany(Ingredient);

Unit.Quantity = Unit.hasMany(Quantity);

Quantity.Unit = Quantity.hasOne(Unit, {foreignKey: 'QuantityId'});


exports.initialize = function (options) {
    return this.db.authenticate()
    .then(() => {
        console.log('\x1b[32m✅ Connection has been established successfully.', '\x1b[0m\n');
        
        return options.sync ? this.db.sync(options.options)
        .then(() => {
            console.log('\x1b[32m✅ Schematics synchronization successfully completed.', '\x1b[0m');
            return true;
        })
        .catch((error) => {
            console.error('\x1b[31m', '❌ Unable to synchronize schematics:', error, '\x1b[0m');
            return false;
        })
        : true
    })
    .then(isSync => isSync)
    .catch((error) => {
        console.error('\x1b[31m', '❌ Unable to connect to the database:', error, '\x1b[0m\n');
        return false;
    })
}
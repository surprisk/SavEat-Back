const { Sequelize, DataTypes } = require('sequelize');

exports.db = new Sequelize(config.global.SEQUELIZE);

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
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        image: DataTypes.BLOB
    }),
    Recipe: this.db.define('Recipe', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

    }),
    Quantity: this.db.define('Quantity', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        ingredientUUID: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: "QuantityJoin"
        },
        recipeUUID: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: "QuantityJoin"
        }
    }),
    Unit: this.db.define('Unit', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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

const {User, Recipe, Ingredient, Category, Quantity } = this.schematics

// Associations
User.Recipe = User.hasMany(Recipe);
Recipe.belongsTo(User);

Recipe.belongsToMany(Ingredient, { through: Quantity});
Ingredient.belongsToMany(Recipe, { through: Quantity});

Category.hasMany(Ingredient);
Ingredient.hasMany(Category);


exports.initialize = function () {
    this.db.authenticate()
    .then(() => {
        console.log('\x1b[32m✅ Connection has been established successfully.', '\x1b[0m\n');
        
        this.db.sync()
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
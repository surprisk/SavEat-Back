const { Sequelize, DataTypes } = require('sequelize');
const { generateSalt, generateHash } = require('./service.crypto');

const userControl = (user) => {
    user.username = user.username.toLowerCase();
    user.email = user.email.toLowerCase();
    user.salt = generateSalt()
    user.hash = generateHash(user.password, user.salt);
}

exports.db = new Sequelize(config.credentials.sequelize.connection);

// Schematics
exports.schematics = {
    User: this.db.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^[a-zA-Z0-9]*$/i
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false
        },
        hash: {
            type: DataTypes.STRING,
        },
        salt: {
            type: DataTypes.STRING,
        }
    }, {
        hooks: {
            beforeSave: userControl
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
        },
        type: {
            type: DataTypes.ENUM,
            values: ["Recipe", "Ingredient"],
            allowNull: false
        }
    })
}

const {User, Recipe, Ingredient, Category, Quantity, Unit } = this.schematics

// Associations
Recipe.Author = Recipe.belongsTo(User, {as: 'Author'});
Recipe.Ingredient = Recipe.belongsToMany(Ingredient, { through: Quantity });

Ingredient.Recipe = Ingredient.belongsToMany(Recipe, { through: Quantity });
Ingredient.Category = Ingredient.belongsToMany(Category, { through: 'Category_Ingredient' });

Category.Ingredient = Category.belongsToMany(Ingredient, { through: 'Category_Ingredient' });

Unit.Quantity = Unit.hasMany(Quantity);


exports.initialize = function (options) {
    return this.db.authenticate()
    .then(() => {
        console.log('\x1b[32m✅ Connection has been established successfully.', '\x1b[0m\n');

        return options.drop ? 
            this.db.drop()
            .then(() => {
                console.log('\x1b[32m✅ Database deletion successfully completed.', '\x1b[0m');

                return true;
            })
            .catch((error) => {
                console.error('\x1b[31m', '❌ Unable to delete database:', error, '\x1b[0m');

                return false;
            }) : 
            true;
        })
    .then((success) => {
        return options.sync ? 
            this.db.sync(options.options)
            .then(() => {
                console.log('\x1b[32m✅ Schematics synchronization successfully completed.', '\x1b[0m');

                return true;
            })
            .catch((error) => {
                console.error('\x1b[31m', '❌ Unable to synchronize schematics:', error, '\x1b[0m');

                return false;
            }) :
            success
    })
    .catch((error) => {
        console.error('\x1b[31m', '❌ Unable to connect to the database:', error, '\x1b[0m\n');
        
        return false;
    })
}
'use strict';

const { Model } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            unique_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                unique: true
            },
            first_name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            location: {
                type: DataTypes.JSON,
                allowNull: false
            },
            timezone_diff: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            birth_date: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            birthday_greet_year: {
                type: DataTypes.JSON,
                defaultValue: []
            },
            status: {
                type: DataTypes.ENUM('active', 'removed'),
                defaultValue: 'active'
            },
            created_at: {
                type: DataTypes.INTEGER
            },
            updated_at: {
                type: DataTypes.INTEGER
            }
        },
        {
            sequelize,
            modelName: 'user',
            underscored: true,
            timestamps: false,
            hooks: {
                beforeCreate(user, options) {
                    user.created_at = moment().unix();
                    user.updated_at = moment().unix();
                },
                beforeUpdate(user, options) {
                    user.updated_at = moment().unix();
                }
            }
        }
    );

    return User;
};
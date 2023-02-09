'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.tags, {as: 'tags', foreignKey: 'createdBy'})
    }
  }
  members.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.STRING,
    exp: DataTypes.INTEGER,
    age: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'members',
    paranoid: true,
  });
  return members;
};
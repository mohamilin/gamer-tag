'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tokens.init({
    token: DataTypes.STRING,
    memberId: DataTypes.INTEGER,
    type: DataTypes.ENUM("access", "refresh", "resetPassword", "verifyEmail"),
    expires: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'tokens',
    paranoid: true,
  });
  return tokens;
};
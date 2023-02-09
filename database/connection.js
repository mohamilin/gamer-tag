const database = require('./models');
const logger = require('../config/logger');

module.exports = class Connection {
  async connect() {
    try {
      await database.sequelize.authenticate();
      console.log({listModels: database.sequelize.models});
      logger.info('Connection has been established successfully.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
    }
  }
};

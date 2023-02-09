/* eslint-disable const/no-anonymous-default-export */
require("dotenv").config();

module.exports = {
  development: {
    database: process.env.DB_NAME_DEV,
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    port: process.env.DB_PORT,
    logging: console.log,
    host: process.env.DB_HOSTNAME_DEV,
    dialect: "postgres",
    pool: {
      max: 50,
      min: 10,
      acquire: 60000,
      idle: 10000,
    },
  },
  test: {
    storage: ":memory",
    dialect: "mysql",
  },
  staging: {
    database: process.env.DB_NAME_STG,
    username: process.env.DB_USERNAME_STG,
    password: process.env.DB_PASSWORD_STG,
    host: process.env.DB_HOSTNAME_STG,
    port: process.env.DB_PORT,
    logging: console.log,
    dialect: "postgres",
  },
  production: {
    database: process.env.DB_NAME_PROD,
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    port: process.env.DB_PORT || 3306,
    logging: console.log,
    host: process.env.DB_HOSTNAME_PROD,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    dialect: "postgres",
    // dialectModule: "",   
    pool: {
      max: 50,
      min: 10,
      acquire: 60000,
      idle: 10000,
    },
  },
};

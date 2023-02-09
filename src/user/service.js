const ModelDatabase = require("../../database/models");
const Model = ModelDatabase.sequelize.models;

const getUserByUsername = async (payload) => {
  return Model.members.findOne({
    where: {
      username: payload?.username,
    },
  });
};

const getUserById = async (user) => {
  return Model.members.findOne({
    where: {
      id: user.memberId,
    },
  });
};

const getAll = async () => {
  return Model.members.findAll();
};
module.exports = {
  getUserById,
  getAll,
  getUserByUsername,
};

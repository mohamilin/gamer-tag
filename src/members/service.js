const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Sequelize } = require("sequelize");
const ModelDatabase = require("../../database/models");
const Model = ModelDatabase.sequelize.models;
const httpStatus = require("http-status");
const ApiError = require("../../utils/api-error");

const UserService = require("../user/service");
const TokenService = require("../token/service");

const createUser = async (payload) => {
  const { firstName, lastName, password, age } = payload;
  const userByUsername = await Model.members.findOne({
    where: {
      username: `${firstName}${lastName}`,
    },
    attributes: ["id", "username"],
  });

  if (userByUsername)
    throw new ApiError(httpStatus.BAD_REQUEST, "Username sudah digunakan");

  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  return Model.members.create({
    firstName,
    lastName,
    username: `${firstName}${lastName}`,
    password: hashPassword,
    age,
  });
};

const login = async (payload) => {
  const { password } = payload;
  const user = await UserService.getUserByUsername(payload);
  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Periksa kembali email atau password anda !"
    );
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Periksa kembali email atau password anda !"
    );
  }
  return user;
};

const refreshToken = async (token) => {
  try {
    const tokens = await TokenService.verifyToken(
      token,
      process.env.TOKEN_TYPE_REFRESH
    );
    const user = await UserService.getUserById(tokens);

    if (!user) {
      throw new Error();
    }

    await TokenService.deleteToken(token, process.env.TOKEN_TYPE_REFRESH);
    return TokenService.generateAuthTokens(user);
  } catch (error) {
    console.log(error, "Failed refreshToken");
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate !");
  }
};

const logout = async (payload) => {
  const refresh_token = payload.refresh_token;
  const refreshTokenDoc = await Model.tokens.findOne({
    where: { token: refresh_token },
  });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.destroy();
};

const getAllMember = async () => {
  return Model.members.findAll({
    attributes: [
      "id",
      "firstName",
      "lastName",
      "username",
      "type",
      "exp",
      "age",
    ],
  });
};

const getMemberById = async (id) => {
  return Model.members.findByPk(id, {
    include: [
      {
        model: Model.tags,
        as: "tags",
        where: {
          deletedAt: null,
        },
      },
    ],

    attributes: [
      "id",
      "firstName",
      "lastName",
      "username",
      "type",
      "exp",
      "age",
    ],
  });
};

const memberPatch = async (id) => {
  const member = await Model.members.findByPk(id, {
    attributes: [
      "id",
      "firstName",
      "lastName",
      "username",
      "type",
      "exp",
      "age",
    ],
  });
  const expPlus = member?.exp + 250;

  if (expPlus < 3000) {
    await member.update({ exp: member?.exp + 250 });

    return { message: "exp plus 250", member };
  }

  return { message: "Point Exp sudah maksimal" };
};

const memberTag = async (id, name) => {
  const member = await Model.members.findByPk(id, {
    include: ["tags"],
    attributes: [
      "id",
      "firstName",
      "lastName",
      "username",
      "type",
      "exp",
      "age",
    ],
  });

  const status = member?.type;
  const slug = _.kebabCase(name);
  if (status === "free" && member?.tags.length === 3) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Harap upgrade status");
  }

  if (status === "paid" && member?.tags.length === 20) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Maksimal 20 tag");
  }

  await Model.tags.create({
    name,
    slug,
    createdBy: id,
  });

  return { message: "exp plus 250", member };
};

const memberUpgrade = async (id) => {
  const member = await Model.members.findByPk(id, {
    attributes: [
      "id",
      "firstName",
      "lastName",
      "username",
      "type",
      "exp",
      "age",
    ],
  });
  const status = member?.type;
  const point = member?.exp;

  if (status === "free" && point >= 1000) {
    await member.update({ type: "gold" });

    return { message: "Status anda terupgrade ke gold", member };
  }

  return { message: "Status anda tidak dapat diupgrade" };
};

const memberDelete = async (id) => {
  const member = await Model.members.findByPk(id, {
    attributes: [
      "id",
      "firstName",
      "lastName",
      "username",
      "type",
      "exp",
      "age",
    ],
  });

  await Model.tags.destroy({ where: { createdBy: id } });
  await member.destroy();

  return true
};

module.exports = {
  createUser,
  login,
  refreshToken,
  logout,
  getAllMember,
  getMemberById,
  memberPatch,
  memberTag,
  memberUpgrade,
  memberDelete,
};

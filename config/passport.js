const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const ModelDatabase = require("../database/models");

const Model = ModelDatabase.sequelize.models;

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== process.env.TOKEN_TYPE_ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await Model.members.findByPk(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};

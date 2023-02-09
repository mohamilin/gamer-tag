const httpStatus = require("http-status");
const CatchAsync = require("../../utils/catch-error");
const MemberService = require("./service");
const TokenService = require("../token/service");

const catchAsync = require("../../utils/catch-error");
const ApiError = require("../../utils/api-error");

const register = CatchAsync(async (req, res) => {
  const user = await MemberService.createUser(req.body);
  const token = await TokenService.generateAuthTokens(user);

  return res.status(httpStatus.CREATED).json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

const login = CatchAsync(async (req, res) => {
  const user = await MemberService.login(req.body);
  const token = await TokenService.generateAuthTokens(user);

  res.json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { token } = req.query;
  const tokens = await MemberService.refreshToken(token);
  res.send({ token: { ...tokens } });
});

const logout = CatchAsync(async (req, res) => {
  await MemberService.logout(req.body);
  res.status(httpStatus.OK).send({ message: "Logout Success" });
});

const getAllMember = catchAsync(async (req, res) => {
  const members = await MemberService.getAllMember();
  let mapperMembers = [];

  for (const item of members) {
    let result = {};

    result.id = item?.id;
    result.firstName = item?.firstName;
    result.lastName = item?.lastName;
    result.username = item?.username;
    result.type = item?.type;
    result.exp = item?.exp;
    result.age = item?.age;

    let x = parseInt(item?.exp);

    if (x > 1000) {
      result.level = "Level 2";
    } else if (x > 1500) {
      result.level = "Level 3";
    } else if (x > 2000) {
      result.level = "Level 2";
    } else if (x > 3000) {
      result.level = "Level 5";
    } else {
      result.level = "Level 1";
    }

    mapperMembers.push(result);
  }
  res.status(httpStatus.OK).send({ message: "Success", data: mapperMembers });

});

const getMemberById = catchAsync(async (req, res) => {
  const member = await MemberService.getMemberById(req.params.memberId);
  if(!member) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data tidak ditemukan')
  }
  res.status(httpStatus.OK).send({ message: "Success", data: member });
});

const memberPatch = catchAsync(async (req, res) => {
  const {id} = req.user
  const member = await MemberService.memberPatch(id);
  res.status(httpStatus.OK).send({ success:true, message: member.message, data: member });
});

const memberTag = catchAsync(async (req, res) => {
  const {id} = req.user
  const {name} = req.body;
  const member = await MemberService.memberTag(id, name);
  res.status(httpStatus.OK).send({ success: true, message: member.message, data: member });
});

const memberUpgrade = catchAsync(async (req, res) => {
  const {id} = req.user
  const member = await MemberService.memberUpgrade(id);
  res.status(httpStatus.OK).send({ success: true, message: member.message, data: member });
});

const memberDelete = catchAsync(async (req, res) => {
  const {id} = req.user
  const member = await MemberService.memberDelete(id);
  res.status(httpStatus.OK).send({ success: true, message: 'Data member dan tag berhasil dihapus' });
});
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getAllMember,
  getMemberById,
  memberPatch,
  memberTag,
  memberUpgrade,
  memberDelete
};

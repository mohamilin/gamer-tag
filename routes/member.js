const express = require("express");
const MemberControllers = require("../src/members/controller");
const validate = require("../validation/validate");
const Validation = require("../validation");
const Auth = require("../middlewares/authentication");
const router = express.Router();


router.post(
  "/register",
  validate(Validation.AuthValidation.register),
  MemberControllers.register
);
router.post("/login", MemberControllers.login);
router.get("/refresh-token", MemberControllers.refreshToken);
router.get("/", MemberControllers.getAllMember);
router.patch("/exp", Auth(), MemberControllers.memberPatch);
router.post("/tags", Auth(),  validate(Validation.MemberValidation.createTag), MemberControllers.memberTag);
router.patch("/upgrade", Auth(), MemberControllers.memberUpgrade);
router.delete("/delete", Auth(), MemberControllers.memberDelete);

router.get("/:memberId", MemberControllers.getMemberById);

router.post("/logout", MemberControllers.logout);

module.exports = router;

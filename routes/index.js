const express = require("express");

const MemberRoutes = require("./member");
const UserRoutes = require("./users");

const router = express.Router();
router.get('/', (req, res) => {
    res.status(200).json({title: "Welcome Gamer Tag", message: "By Amilin"})
})
router.use("/members", MemberRoutes);
router.use("/users", UserRoutes);

module.exports = router;

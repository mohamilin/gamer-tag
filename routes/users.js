const express = require("express");

const UserController = require('../src/user/controller');
const Auth = require("../middlewares/authentication");
 
const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.json({message:"respond with a resource"});
});


router.get('/all', Auth('manageUsers'), UserController.getAll )
module.exports = router;

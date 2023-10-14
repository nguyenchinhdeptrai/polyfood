const express = require("express");
const router = express.Router();
const controller_api_user = require("../controller/api.controller/api.controller.login");

router.post("/register", controller_api_user.register);
router.post("/login", controller_api_user.loginUser);

module.exports = router;

const express = require("express");
const {handleUserRegistrationController, handleUserLoginController } = require("../controllers/userController");

const router = express.Router();

// user-signup
router.post("/register", handleUserRegistrationController);

// user-login
router.post("/login", handleUserLoginController);

module.exports = router;

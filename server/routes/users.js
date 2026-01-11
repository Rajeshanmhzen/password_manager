const express = require("express");
const router = express.Router();
const usersRouter = require("../controllers/users");
const auth = require("../middlewares/auth");
const hasLoggedIn = require("../middlewares/hasLoggedIn");

// Login and register

router.post("/login", usersRouter.login);

router.post("/register", usersRouter.register);

// OTP verification

router.post("/verify-otp", hasLoggedIn, usersRouter.verifyOTP);

// Change password

router.put("/change-password", auth, usersRouter.changePassword);

module.exports = router;

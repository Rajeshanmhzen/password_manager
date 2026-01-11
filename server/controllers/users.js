const Users = require("../models/users");
const { hashPassword, comparePassword, generateToken } = require("../utils/authUtil");
const randomize = require("randomatic");
const { sendOTP } = require("../services/mailService");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const emailExists = await Users.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email already registered" });

    const usernameExists = await Users.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: "Username already taken" });

    const masterPasswordHash = await hashPassword(password);
    const salt = crypto.randomBytes(16).toString("hex");

    const user = await Users.create({
      username,
      email,
      masterPasswordHash,
      salt,
    });

    const token = generateToken({ id: user._id });

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN - STEP 1
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await comparePassword(password, user.masterPasswordHash);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate OTP
    const otp = randomize("0", 6);
    user.otp = otp;
    user.otpExpiresIn = Date.now() + 60000; 
    await user.save();

    sendOTP(email, otp);

    const token = generateToken({ id: user._id, stage: "OTP" }, "1m");

    res.status(200).json({
      message: "OTP sent to email",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// LOGIN - STEP 2 (OTP Verification)
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP required" });

    // Get user ID from JWT token
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await Users.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "User not found" });
    
    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpiresIn < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpiresIn = null;
    await user.save();

    const newToken = generateToken({ id: user._id });

    res.status(200).json({
      message: "Login successful",
      token: newToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Current and new passwords are required" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "New password must be at least 8 characters" });

    // Verify current password
    const valid = await comparePassword(currentPassword, user.masterPasswordHash);
    if (!valid)
      return res.status(400).json({ message: "Current password is incorrect" });

    // Hash new password and generate new salt
    const newPasswordHash = await hashPassword(newPassword);
    const newSalt = crypto.randomBytes(16).toString("hex");

    // Update user
    user.masterPasswordHash = newPasswordHash;
    user.salt = newSalt;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to change password" });
  }
};

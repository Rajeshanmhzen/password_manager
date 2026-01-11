const mongoose = require("mongoose");
const validator = require("../utils/validators");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 64,
      unique: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validator.validateEmail, "Invalid email"],
    },

    masterPasswordHash: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
      required: true,
    },

    otp: String,
    otpExpiresIn: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

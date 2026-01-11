const mongoose = require("mongoose");
const validator = require("../utils/validators");

const passwordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    url: {
      type: String,
      required: true,
      validate: [validator.validateUrl, "Invalid URL"],
    },

    username: {
      type: String,
      required: true,
    },

    encryptedPassword: {
      type: String,
      required: true,
    },

    iv: {
      type: String,
      required: true,
    },

    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Password", passwordSchema);

const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["VIEW_PASSWORD", "COPY_PASSWORD", "ADD_PASSWORD", "EDIT_PASSWORD", "DELETE_PASSWORD"],
    },
    passwordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Password",
    },
    url: String,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
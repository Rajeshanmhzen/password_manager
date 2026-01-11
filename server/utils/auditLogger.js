const AuditLog = require("../models/auditLog");

const logAction = async (userId, action, passwordId = null, url = null, req = null) => {
  try {
    await AuditLog.create({
      userId,
      action,
      passwordId,
      url,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get("User-Agent"),
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
};

module.exports = { logAction };
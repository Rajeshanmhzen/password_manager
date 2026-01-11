const Password = require("../models/passwords");
const { encryptPassword, decryptPassword } = require("../utils/cryptoUtil");
const { logAction } = require("../utils/auditLogger");

// ADD PASSWORD
exports.addPassword = async (req, res) => {
  try {
    const { url, username, password, note, masterPassword } = req.body;
    const user = req.user;

    if (!url || !username || !password || !masterPassword)
      return res.status(400).json({ message: "Invalid input" });

    const { encryptedPassword, iv } = encryptPassword(
      password,
      masterPassword,
      user.salt
    );

    await Password.create({
      userId: user._id,
      url,
      username,
      encryptedPassword,
      iv,
      note,
    });

    await logAction(user._id, "ADD_PASSWORD", null, url, req);
    res.status(200).json({ message: "Password saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save password" });
  }
};

// GET PASSWORDS (metadata only, no decryption)
exports.getPasswords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Password.countDocuments({ userId: req.user._id });
    const passwords = await Password.find({ userId: req.user._id })
      .select("-encryptedPassword -iv")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      passwords,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch passwords" });
  }
};

// VIEW PASSWORD (decrypted)
exports.viewPassword = async (req, res) => {
  try {
    const { masterPassword } = req.body;
    const passwordEntry = await Password.findById(req.params.id);

    if (!passwordEntry)
      return res.status(404).json({ message: "Password not found" });

    const decrypted = decryptPassword(
      passwordEntry.encryptedPassword,
      passwordEntry.iv,
      masterPassword,
      req.user.salt
    );

    await logAction(req.user._id, "VIEW_PASSWORD", req.params.id, passwordEntry.url, req);
    res.status(200).json({ password: decrypted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Decryption failed" });
  }
};

// DELETE PASSWORD
exports.deletePassword = async (req, res) => {
  try {
    await Password.deleteOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    await logAction(req.user._id, "DELETE_PASSWORD", req.params.id, null, req);
    res.status(200).json({ message: "Password deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete password" });
  }
};

// GET AUDIT LOGS
exports.getAuditLogs = async (req, res) => {
  try {
    const AuditLog = require("../models/auditLog");
    const logs = await AuditLog.find({ userId: req.user._id })
      .populate("passwordId", "url")
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

// EDIT PASSWORD
exports.editPassword = async (req, res) => {
  try {
    const { url, username, password, note, masterPassword } = req.body;
    const user = req.user;

    if (!masterPassword)
      return res.status(400).json({ message: "Master password required" });

    const passwordEntry = await Password.findOne({
      _id: req.params.id,
      userId: user._id,
    });

    if (!passwordEntry)
      return res.status(404).json({ message: "Password not found" });

    // Verify master password by trying to decrypt existing password
    try {
      decryptPassword(
        passwordEntry.encryptedPassword,
        passwordEntry.iv,
        masterPassword,
        user.salt
      );
    } catch (err) {
      return res.status(400).json({ message: "Invalid master password" });
    }

    // Encrypt new password if provided
    let updateData = { url, username, note };
    if (password) {
      const { encryptedPassword, iv } = encryptPassword(
        password,
        masterPassword,
        user.salt
      );
      updateData.encryptedPassword = encryptedPassword;
      updateData.iv = iv;
    }

    await Password.findByIdAndUpdate(req.params.id, updateData);
    await logAction(user._id, "EDIT_PASSWORD", req.params.id, url, req);
    
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
};

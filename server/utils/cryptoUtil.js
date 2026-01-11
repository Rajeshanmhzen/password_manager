const crypto = require("crypto");

exports.encryptPassword = (plainText, masterPassword, salt) => {
  const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, "sha256");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  return { encryptedPassword: encrypted.toString("hex"), iv: iv.toString("hex") };
};

exports.decryptPassword = (encryptedHex, ivHex, masterPassword, salt) => {
  const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, "sha256");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
};

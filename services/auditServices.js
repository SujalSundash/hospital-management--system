const AuditLog = require("../models/AuditLog.js");

 const logAudit = async ({
  user,
  action,
  module,
  ipAddress
}) => {
  await AuditLog.create({
    user,
    action,
    module,
    ipAddress
  });
};

module.exports = logAudit;

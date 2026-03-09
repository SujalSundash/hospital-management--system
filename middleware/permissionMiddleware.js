const can = (permissionName) => {
  return (req, res, next) => {
    try {
      if (!req.user.role || !req.user.role.permissions) {
        return res.status(403).json({
          success: false,
          message: "No role or permissions assigned"
        });
      }

      const userPermissions = req.user.role.permissions.map((perm) => perm.name);

      if (!userPermissions.includes(permissionName)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action"
        });
      }

      next();
    } catch (error) {
      console.error("PERMISSION CHECK ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Permission check failed"
      });
    }
  };
};

module.exports = can;

// // const roleMiddleware = (...roles) => {
// //   return (req, res, next) => {
// //     if (!roles.includes(req.user.role.name)) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Access denied"
// //       });
// //     }
// //     next();
// //   };
// // };

// // module.exports = roleMiddleware;



// // const roleMiddleware = (...roles) => {
// //   return (req, res, next) => {
// //     if (!req.user || !req.user.role) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Unauthorized"
// //       });
// //     }

// //     // If role is populated (recommended)
// //     const roleName = req.user.role.name || req.user.role;

// //     if (!roles.includes(roleName)) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Access denied"
// //       });
// //     }

// //     next();
// //   };
// // };

// // module.exports = roleMiddleware;


// const roleMiddleware = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user || !req.user.role) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const roleName =
//       typeof req.user.role === "object"
//         ? req.user.role.name
//         : req.user.role;

//     if (!allowedRoles.map(r => r.toLowerCase()).includes(roleName.toLowerCase())) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     }

//     next();
//   };
// };

// module.exports = roleMiddleware;


const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const roleName =
      typeof req.user.role === "object"
        ? req.user.role.name
        : req.user.role;

    if (!allowedRoles.map(r => r.toLowerCase()).includes(roleName.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;

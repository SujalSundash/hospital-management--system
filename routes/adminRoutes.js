const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const adminPatientController = require("../controllers/adminController");

/**
 * =========================
 * ONE-TIME BOOTSTRAP
 * (REMOVE AFTER FIRST ADMIN)
 * =========================
 */
router.post("/bootstrap", adminController.bootstrapAdmin);

/**
 * =========================
 * ADMIN PROTECTED ROUTES
 * =========================
 */
router.use(authMiddleware);
router.use(roleMiddleware("admin")); // ✅ FIXED (no array)

/**
 * Admin management
 */
router.post(
  "/create",
  rbacMiddleware("create_admin"), // ✅ must exist in Permission collection
  adminController.createAdmin
);

router.get("/get", adminController.getAllAdmins);

router.put(
  "/:id/permissions",
  rbacMiddleware("update_roles"),
  adminController.updateAdminPermissions
);

router.delete(
  "/:id",
  rbacMiddleware("delete_user"),
  adminController.removeAdmin
);


// Admin only
router.get(
  "/patients",
  authMiddleware,
  roleMiddleware("admin"),
  adminPatientController.getAllPatients
);

router.put(
  "/patients/approve/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminPatientController.approvePatient
);

router.put(
  "/patients/block/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminPatientController.toggleBlockPatient
);

router.get(
  "/total-users",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getTotalUsers
);

router.get(
  "/dashboard-counts",
  authMiddleware,
  adminController.getDashboardCounts
);

module.exports = router;

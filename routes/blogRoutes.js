const express = require("express");
const router = express.Router();

const {
  createNews,
  getAllNews,
  getNewsBySlug,
  updateNews,
  deleteNews,
  likeNews,
} = require("../controllers/BlogController");

const  authorize  = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware")
// Public routes
router.get("/", getAllNews);
router.get("/:slug", getNewsBySlug);
router.patch("/like/:id", likeNews);

// Admin routes
router.post(
  "/create",
  
  authorize,
  roleMiddleware("Admin"),
  createNews
);

router.put(
  "/:id",
  authorize,
  roleMiddleware("Admin"),
  updateNews
);

// SuperAdmin only
router.delete(
  "/:id",
  authorize,
  roleMiddleware("admin"),
  deleteNews
);

module.exports = router;

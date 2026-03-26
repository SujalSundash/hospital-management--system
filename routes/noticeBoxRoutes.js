const express = require("express");
const router = express.Router();
const { getAllNotices, createNotice } = require("../controllers/noticeBoxController");
const  roleMiddleware  = require("../middleware/roleMiddleware");
const  authMiddleware  = require("../middleware/authMiddleware");


router.get("/", getAllNotices);          // anyone can fetch
router.post("/",authMiddleware, roleMiddleware("admin"), createNotice); // only admin can create

module.exports = router;
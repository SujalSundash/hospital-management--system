const express = require('express')
const router = express.Router();

const createNotice = require("../controllers/noticeBoxController")
router.post('/',createNotice)

module.exports = router;
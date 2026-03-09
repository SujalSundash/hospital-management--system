// uploadMiddleware.js
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload; // export multer instance directlyclear
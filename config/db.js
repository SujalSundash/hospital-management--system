// const mongoose = require("mongoose");

// async function connectDb() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("DB Connected Successfully ");
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// }

// module.exports = connectDb;


// config/db.js
const mongoose = require("mongoose");
const path = require("path");

const connectDb = async () => {
  try {
    // ensure .env from parent folder is loaded
    require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ✅ : ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error ❌", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
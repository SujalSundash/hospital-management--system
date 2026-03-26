const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const path = require("path");

// ROUTES
const contactRoutes = require("./routes/contactRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const noticeRoutes = require("./routes/noticeBoxRoutes");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes")
const doctorRoutes = require("./routes/doctorRoutes")
const patientProfileRoutes = require("./routes/patientProfileRoutes")
const adminRoutes = require("./routes/adminRoutes")
const blogRoutes = require("./routes/blogRoutes")
const scheduleRoutes = require("./routes/scheduleRoutes")
const newsletterRourtes = require("./routes/newsletterRoutes")
dotenv.config();

const app = express();

// DB connection

// Middleware
app.use(express.json());

// CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }

      return callback(null, true);
    },
    credentials: true,
  })
);


// Test route
app.get("/", (req, res) => {
  res.send("Server running successfully...");
});

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patient",patientProfileRoutes)
app.use("/api/admin", adminRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/blog", blogRoutes)
app.use("/api/newsletter", newsletterRourtes)
app.use("/api/schedule", scheduleRoutes);
// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
connectDb();

});

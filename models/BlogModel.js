const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },

    image: {
      type: String, // image URL
      required: true,
    },

    category: {
      type: String,
      enum: ["Advice", "Health Tips", "News", "Events", "Emergency"],
      default: "News",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin / Doctor
      required: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    likes: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("News", newsSchema);

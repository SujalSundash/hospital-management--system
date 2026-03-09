const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
     priority: {
    type: String,
    enum: ['high', 'medium', 'low'], // Only allow these values
    default: 'medium', // Default value if not provided
  },

  },
  { timestamps: true }
);

module.exports = mongoose.model('NoticeBox', noticeSchema);

const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true,
        },
        post:
        {
            type: String,
            default: "Customer",
        },
        review:
        {
            type: String,
            required: true,
            maxlength: 500,

        },
        photo:
        {
            type : String,
            required: true
        },
          isApproved: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    },
      { timestamps: true } // adds createdAt and updatedAt

)
module.exports = mongoose.model('testimonial', testimonialSchema);

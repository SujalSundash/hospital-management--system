const News = require("../models/BlogModel");
const slugify = require("slugify");

/**
 * @desc    Create News
 * @route   POST /api/news
 * @access  Admin / SuperAdmin
 */
exports.createNews = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      image,
      category,
      status,
      isFeatured,
    } = req.body;

    if (!title || !content || !excerpt || !image) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const slug = slugify(title, { lower: true });

    const news = await News.create({
      title,
      slug,
      content,
      excerpt,
      image,
      category,
      status,
      isFeatured,
      author: req.user._id,
      publishedAt: status === "Published" ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get All Published News
 * @route   GET /api/news
 * @access  Public
 */
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find({ status: "Published" })
      .populate("author", "name")
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get Single News by Slug
 * @route   GET /api/news/:slug
 * @access  Public
 */
exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug,
      status: "Published",
    }).populate("author", "name");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // Increase views
    news.views += 1;
    await news.save();

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update News
 * @route   PUT /api/news/:id
 * @access  Admin / SuperAdmin
 */
exports.updateNews = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true });
    }

    if (updates.status === "Published") {
      updates.publishedAt = new Date();
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      data: news,
      message: "News updated successfully",

    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete News
 * @route   DELETE /api/news/:id
 * @access  SuperAdmin
 */
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Like News
 * @route   PATCH /api/news/like/:id
 * @access  Public
 */
exports.likeNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    news.likes += 1;
    await news.save();

    res.status(200).json({
      success: true,
      likes: news.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

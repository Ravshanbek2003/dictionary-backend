const { NewsModel } = require("../../models/news/news.model.js");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception.js");
const { SaveFileModel } = require("../../models/save-file/save-file.model.js");

class NewsController {
  static getAll = async (req, res) => {
    const { search, page, limit } = req.query;

    let searchQuery = {};
    if (search && search.length > 0) {
      searchQuery = {
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { desc: { $regex: search.trim(), $options: "i" } },
        ],
      };
    }

    const news = await NewsModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await NewsModel.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: news,
      pagination: {
        currentPage: Number(page),
        totalItems: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNextPage: (page - 1) * limit + news.length < total,
        hasPrevPage: page > 1,
      },
    });
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    const news = await NewsModel.findById(id);
    if (!news) {
      throw new HttpException(StatusCodes.NOT_FOUND, "News not found!");
    }
    res.status(200).json({ success: true, data: news });
  };

  static add = async (req, res) => {
    const { title, desc, image } = req.body;

    const existingNews = await NewsModel.findOne({ title });
    if (existingNews) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "News with this title already exists!"
      );
    }

    const save_file = await SaveFileModel.findOne({ file_path: image });
    if (!save_file) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Image file not found!");
    }

    if (save_file.is_use) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Image file is in use: " + save_file.where_used
      );
    }

    await NewsModel.create({
      title,
      desc,
      image,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "News created!" });

    await save_file.updateOne({ is_use: true, where_used: "news" });
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { title, desc, image } = req.body;

    const news = await NewsModel.findById(id);
    if (!news) {
      throw new HttpException(StatusCodes.NOT_FOUND, "News not found!");
    }

    const updatedNews = {};

    if (image && image !== news.image) {
      const save_file = await SaveFileModel.findOne({ file_path: image });
      if (!save_file) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Image file not found!"
        );
      }
      if (save_file.is_use) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Image file is in use: " + save_file.where_used
        );
      }
      updatedNews.image = image;
    }

    if (title && title !== news.title) {
      const existingNews = await NewsModel.findOne({ title });
      if (existingNews) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "News with this title already exists!"
        );
      }
      updatedNews.title = title;
    }

    if (desc && desc !== news.desc) {
      updatedNews.desc = desc;
    }

    await NewsModel.findByIdAndUpdate(id, updatedNews);
    if (image && image !== news.image) {
      await SaveFileModel.updateOne(
        { file_path: news.image },
        { is_use: false, where_used: "" }
      );
      await SaveFileModel.updateOne(
        { file_path: image },
        { is_use: true, where_used: "news" }
      );
    }

    res.status(200).json({ success: true, msg: "News updated!" });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const news = await NewsModel.findById(id);
    if (!news) {
      throw new HttpException(StatusCodes.NOT_FOUND, "News not found!");
    }

    // await NewsModel.findByIdAndDelete(id); // 1-st way
    await news.deleteOne(); // 2-nd way
    await SaveFileModel.updateOne(
      { file_path: news.image },
      { is_use: false, where_used: "" }
    );

    res.status(200).json({ success: true, msg: "News deleted!" });
  };
}

module.exports = { NewsController };

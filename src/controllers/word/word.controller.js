const { WordModel } = require("../../models/word/word.model.js");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception.js");


class WordController {
  static getAll = async (req, res) => {
    const { search, page, limit, dictionary, department, category } = req.query;


    let searchQuery = {};
    if (search && search.length > 0) {
      searchQuery = {
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { description: { $regex: search.trim(), $options: "i" } },
        ],
      };
    }

    if (dictionary) {
      searchQuery.dictionary = dictionary;
    }
    if (department) {
      searchQuery.department = department;
    }
    if (category) {
      searchQuery.category = category;
    }

    const words = await WordModel.find(searchQuery)
      .populate("dictionary")
      .populate("department")
      .populate("category")
      .lean();

    res.status(200).json(words);
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    const word = await WordModel.findById(id)
      .populate("dictionary")
      .populate("department")
      .populate("category")
      .lean();
    if (!word) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Word not found!");
    }
    res.status(200).json(word);
  };

  static add = async (req, res) => {
    const { title, description, dictionary, department, category } = req.body;

    const existingWord = await WordModel.findOne({ title });
    if (existingWord) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "Word with this title already exists!"
      );
    }

    await WordModel.create({
      title,
      description,
      dictionary,
      department,
      category,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "Word created successfully!" });
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { title, description, dictionary, department, category } = req.body;

    const word = await WordModel.findById(id);
    if (!word) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Word not found!");
    }

    const updatedWord = {};

    if (title && title !== word.title) {
      const existingWord = await WordModel.findOne({ title });
      if (existingWord) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "Word with this title already exists!"
        );
      }
      updatedWord.title = title;
    }

    if (description && description !== word.description) {
      updatedWord.description = description;
    }

    if (dictionary && dictionary !== word.dictionary.toString()) {
      updatedWord.dictionary = dictionary;
    }

    if (department && department !== word.department.toString()) {
      updatedWord.department = department;
    }

    if (category && category !== word.category.toString()) {
      updatedWord.category = category;
    }

    if (Object.keys(updatedWord).length === 0) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "No valid fields provided for update."
      );
    }

    await WordModel.findByIdAndUpdate(id, updatedWord, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, msg: "Word updated successfully!" });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const word = await WordModel.findById(id);
    if (!word) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Word not found!");
    }

    await word.deleteOne();

    res.status(200).json({ success: true, msg: "Word deleted successfully!" });
  };
}

module.exports = { WordController };

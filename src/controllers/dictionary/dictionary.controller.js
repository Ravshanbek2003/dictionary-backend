const {
  DictionaryModel,
} = require("../../models/dictionary/dictionary.model.js");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception.js");


class DictionaryController {
  static getAll = async (req, res) => {
    const { search, page, limit } = req.query;
    console.log(search, "search");

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;

    let searchQuery = {};
    if (search && search.length > 0) {
      searchQuery = {
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { description: { $regex: search.trim(), $options: "i" } },
        ],
      };
    }

    const dictionaries = await DictionaryModel.find(searchQuery)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean();  


    res.status(200).json(dictionaries);
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    const dictionary = await DictionaryModel.findById(id).lean();
    if (!dictionary) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Dictionary not found!");
    }
    res.status(200).json(dictionary);
  };

  static add = async (req, res) => {
    const { title, type, description } = req.body;

    const existingDictionary = await DictionaryModel.findOne({ title });
    if (existingDictionary) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "Dictionary with this title already exists!"
      );
    }

    await DictionaryModel.create({
      title,
      type,
      description,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "Dictionary created successfully!" });
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { title, type, description } = req.body;

    const dictionary = await DictionaryModel.findById(id);
    if (!dictionary) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Dictionary not found!");
    }

    const updatedDictionary = {};

    if (title && title !== dictionary.title) {
      const existingDictionary = await DictionaryModel.findOne({ title });
      if (existingDictionary) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "Dictionary with this title already exists!"
        );
      }
      updatedDictionary.title = title;
    }

    if (type && type !== dictionary.type) {
      updatedDictionary.type = type;
    }

    if (description && description !== dictionary.description) {
      updatedDictionary.description = description;
    }

    if (Object.keys(updatedDictionary).length === 0) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "No valid fields provided for update."
      );
    }

    await DictionaryModel.findByIdAndUpdate(id, updatedDictionary, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ success: true, msg: "Dictionary updated successfully!" });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const dictionary = await DictionaryModel.findById(id);
    if (!dictionary) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Dictionary not found!");
    }

    await dictionary.deleteOne();

    res
      .status(200)
      .json({ success: true, msg: "Dictionary deleted successfully!" });
  };
}

module.exports = { DictionaryController };

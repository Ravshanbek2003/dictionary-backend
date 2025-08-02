const { CategoryModel } = require("../../models/category/category.model.js");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception.js");
// const { SaveFileModel } = require("../../models/save-file/save-file.model.js"); // image ga oid bo'lgani uchun vaqtinchalik o'chirildi

class CategoryController {
  static getAll = async (req, res) => {
    const { search, page, limit } = req.query;

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;

    let searchQuery = {};
    if (search && search.length > 0) {
      searchQuery = {
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
        ],
      };
    }

    const categories = await CategoryModel.find(searchQuery)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .populate('dictionary') // dictionary modelini ma'lumotlarini qo'shish
      .populate('department') // department modelini ma'lumotlarini qo'shish
      .lean();

    const total = await CategoryModel.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        currentPage: parsedPage,
        totalItems: total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
        hasNextPage: (parsedPage - 1) * parsedLimit + categories.length < total,
        hasPrevPage: parsedPage > 1,
      },
    });
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id).populate('dictionary').populate('department').lean();
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Category not found!");
    }
    res.status(200).json({ success: true, data: category });
  };

  static add = async (req, res) => {
    const { title, dictionary, department } = req.body;

    const existingCategory = await CategoryModel.findOne({ title });
    if (existingCategory) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "Category with this title already exists!"
      );
    }

    await CategoryModel.create({
      title,
      dictionary,
      department,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "Category created successfully!" });
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { title, dictionary, department } = req.body;

    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Category not found!");
    }

    const updatedCategory = {};

    if (title && title !== category.title) {
      const existingCategory = await CategoryModel.findOne({ title });
      if (existingCategory) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "Category with this title already exists!"
        );
      }
      updatedCategory.title = title;
    }

    if (dictionary && dictionary !== category.dictionary.toString()) {
      updatedCategory.dictionary = dictionary;
    }

    if (department && department !== category.department.toString()) {
      updatedCategory.department = department;
    }
    
    // Agar hech qanday o'zgarish bo'lmasa, xato qaytarish
    if (Object.keys(updatedCategory).length === 0) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "No valid fields provided for update.");
    }

    await CategoryModel.findByIdAndUpdate(id, updatedCategory, { new: true, runValidators: true });
    
    res.status(200).json({ success: true, msg: "Category updated successfully!" });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Category not found!");
    }
    
    await category.deleteOne();

    res.status(200).json({ success: true, msg: "Category deleted successfully!" });
  };
}

module.exports = { CategoryController };
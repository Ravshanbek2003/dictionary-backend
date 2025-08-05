const { CategoryModel } = require("../../models/category/category.model.js");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception.js");


class CategoryController {
  static getAll = async (req, res) => {
    const { search, department } = req.query;
    console.log(req.query, "req.query");

    let searchQuery = {};
    if (search && search.length > 0) {
      searchQuery = {
        $or: [{ title: { $regex: search.trim(), $options: "i" } }],
      };
    }

    if (department) {
      searchQuery.department = department;
    }
    const categories = await CategoryModel.find(searchQuery)
      .populate("dictionary")  
      .populate("department")  
      .lean();

    res.status(200).json(categories);
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id)
      .populate("dictionary")
      .populate("department")
      .lean();
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Category not found!");
    }
    res.status(200).json(category);
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

    if (Object.keys(updatedCategory).length === 0) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "No valid fields provided for update."
      );
    }

    await CategoryModel.findByIdAndUpdate(id, updatedCategory, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ success: true, msg: "Category updated successfully!" });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Category not found!");
    }

    await category.deleteOne();

    res
      .status(200)
      .json({ success: true, msg: "Category deleted successfully!" });
  };
}

module.exports = { CategoryController };

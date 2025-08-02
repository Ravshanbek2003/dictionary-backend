const {
  DepartmentModel,
} = require("../../models/department/department.model.js");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception.js");
// const { SaveFileModel } = require("../../models/save-file/save-file.model.js"); // image ga oid bo'lgani uchun vaqtinchalik o'chirildi

class DepartmentController {
  static getAll = async (req, res) => {
    const { search, page, limit } = req.query;

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

    const departments = await DepartmentModel.find(searchQuery)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .populate("dictionary") // dictionary modelini ma'lumotlarini qo'shish
      .lean();

    const total = await DepartmentModel.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: departments,
      pagination: {
        currentPage: parsedPage,
        totalItems: total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
        hasNextPage:
          (parsedPage - 1) * parsedLimit + departments.length < total,
        hasPrevPage: parsedPage > 1,
      },
    });
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    const department = await DepartmentModel.findById(id)
      .populate("dictionary")
      .lean();
    if (!department) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Department not found!");
    }
    res.status(200).json({ success: true, data: department });
  };

  static add = async (req, res) => {
    const { title, description, dictionary } = req.body;

    const existingDepartment = await DepartmentModel.findOne({ title });
    if (existingDepartment) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "Department with this title already exists!"
      );
    }

    await DepartmentModel.create({
      title,
      description,
      dictionary,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "Department created successfully!" });
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { title, description, dictionary } = req.body;

    const department = await DepartmentModel.findById(id);
    if (!department) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Department not found!");
    }

    const updatedDepartment = {};

    if (title && title !== department.title) {
      const existingDepartment = await DepartmentModel.findOne({ title });
      if (existingDepartment) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "Department with this title already exists!"
        );
      }
      updatedDepartment.title = title;
    }

    if (description && description !== department.description) {
      updatedDepartment.description = description;
    }

    if (dictionary && dictionary !== department.dictionary.toString()) {
      updatedDepartment.dictionary = dictionary;
    }

    // Agar hech qanday o'zgarish bo'lmasa, xato qaytarish
    if (Object.keys(updatedDepartment).length === 0) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "No valid fields provided for update."
      );
    }

    await DepartmentModel.findByIdAndUpdate(id, updatedDepartment, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ success: true, msg: "Department updated successfully!" });
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const department = await DepartmentModel.findById(id);
    if (!department) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Department not found!");
    }

    await department.deleteOne();

    res
      .status(200)
      .json({ success: true, msg: "Department deleted successfully!" });
  };
}

module.exports = { DepartmentController };

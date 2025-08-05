const {
  DepartmentModel,
} = require("../../models/department/department.model.js");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception.js");


class DepartmentController {
  static getAll = async (req, res) => {
    const { search, dictype } = req.query;

    let searchQuery = {};
    if (search && search.length > 0) {
      searchQuery = {
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { description: { $regex: search.trim(), $options: "i" } },
        ],
      };
    }
    if (dictype) {
      searchQuery.dictionary = dictype;
    }

    const departments = await DepartmentModel.find(searchQuery)
      .populate("dictionary")  
      .lean();

    res.status(200).json(departments);
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    const department = await DepartmentModel.findById(id)
      .populate("dictionary")
      .lean();
    if (!department) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Department not found!");
    }
    res.status(200).json(department);
  };

  static add = async (req, res) => {
    const { title, dictionary } = req.body;

    const existingDepartment = await DepartmentModel.findOne({
      title,
      dictionary,
    });
    if (existingDepartment) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "Department with this title already exists!"
      );
    }

    await DepartmentModel.create({
      title,
      dictionary,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "Department created successfully!" });
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { title,  dictionary } = req.body;

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

    if (dictionary && dictionary !== department.dictionary.toString()) {
      updatedDepartment.dictionary = dictionary;
    }

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

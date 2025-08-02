const { Router } = require("express");
const { DepartmentController } = require("../../controllers/department/department.controller.js");

const departmentRouter = Router();

const { expressValidate } = require("../../validators/index.js");
const { DepartmentValidator } = require("../../validators/department/department.validator.js");

departmentRouter.get("/get-all", DepartmentController.getAll);

departmentRouter.get(
  "/get/:id",
  DepartmentValidator.getById(),
  expressValidate,
  DepartmentController.getById
);

departmentRouter.post(
  "/add",
  DepartmentValidator.add(),
  expressValidate,
  DepartmentController.add
);

departmentRouter.put(
  "/update/:id",
  DepartmentValidator.update(),
  expressValidate,
  DepartmentController.update
);

departmentRouter.delete(
  "/delete/:id",
  DepartmentValidator.getById(),
  expressValidate,
  DepartmentController.delete
);

module.exports = { departmentRouter };

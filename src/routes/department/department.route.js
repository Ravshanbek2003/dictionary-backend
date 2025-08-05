const { Router } = require("express");
const { DepartmentController } = require("../../controllers/department/department.controller.js");

const departmentRouter = Router();

const { expressValidate } = require("../../validators/index.js");
const { DepartmentValidator } = require("../../validators/department/department.validator.js");
const { authMiddleware } = require("../../middlewares/auth.middleware.js");

departmentRouter.get("/get-all", DepartmentController.getAll);

departmentRouter.get(
  "/get/:id",
  authMiddleware,
  DepartmentValidator.getById(),
  expressValidate,
  DepartmentController.getById
);

departmentRouter.post(
  "/add",
  authMiddleware,
  DepartmentValidator.add(),
  expressValidate,
  DepartmentController.add
);

departmentRouter.put(
  "/update/:id",
  authMiddleware,
  DepartmentValidator.update(),
  expressValidate,
  DepartmentController.update
);

departmentRouter.delete(
  "/delete/:id",
  authMiddleware,
  DepartmentValidator.getById(),
  expressValidate,
  DepartmentController.delete
);

module.exports = { departmentRouter };

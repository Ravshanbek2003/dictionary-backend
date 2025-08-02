const { Router } = require("express");
const { CategoryController } = require("../../controllers/category/category.controller.js");

const categoryRouter = Router();

const { expressValidate } = require("../../validators/index.js");
const { CategoryValidator } = require("../../validators/category/category.validator.js");

categoryRouter.get("/get-all", CategoryController.getAll);

categoryRouter.get(
  "/get/:id",
  CategoryValidator.getById(),
  expressValidate,
  CategoryController.getById
);

categoryRouter.post(
  "/add",
  CategoryValidator.add(),
  expressValidate,
  CategoryController.add
);

categoryRouter.put(
  "/update/:id",
  CategoryValidator.update(),
  expressValidate,
  CategoryController.update
);

categoryRouter.delete(
  "/delete/:id",
  CategoryValidator.getById(),
  expressValidate,
  CategoryController.delete
);

module.exports = { categoryRouter };

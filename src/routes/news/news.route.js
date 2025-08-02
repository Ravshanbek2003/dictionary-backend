const { Router } = require("express");
const { NewsController } = require("../../controllers/news/news.controller.js");

const newsRouter = Router();

const { expressValidate } = require("../../validators/index.js");
const { NewsValidator } = require("../../validators/news/news.validator.js");

newsRouter.get("/get-all", NewsController.getAll);

newsRouter.get(
  "/get/:id",
  NewsValidator.getById(),
  expressValidate,
  NewsController.getById
);

newsRouter.post(
  "/add",
  NewsValidator.add(),
  expressValidate,
  NewsController.add
);

newsRouter.put(
  "/update/:id",
  NewsValidator.update(),
  expressValidate,
  NewsController.update
);

newsRouter.delete(
  "/delete/:id",
  NewsValidator.getById(),
  expressValidate,
  NewsController.delete
);

module.exports = { newsRouter };

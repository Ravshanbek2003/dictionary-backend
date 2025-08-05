const { Router } = require("express");
const {
  DictionaryController,
} = require("../../controllers/dictionary/dictionary.controller.js");

const dictionaryRouter = Router();

const { expressValidate } = require("../../validators/index.js");
const {
  DictionaryValidator,
} = require("../../validators/dictionary/dictionary.validator.js");
const { authMiddleware } = require("../../middlewares/auth.middleware.js");

dictionaryRouter.get("/get-all", DictionaryController.getAll);

dictionaryRouter.get(
  "/get/:id",
  authMiddleware,
  DictionaryValidator.getById(),
  expressValidate,
  DictionaryController.getById
);

dictionaryRouter.post(
  "/add",
  authMiddleware,
  DictionaryValidator.add(),
  expressValidate,
  DictionaryController.add
);

dictionaryRouter.put(
  "/update/:id",
  authMiddleware,
  DictionaryValidator.update(),
  expressValidate,
  DictionaryController.update
);

dictionaryRouter.delete(
  "/delete/:id",
  authMiddleware,
  DictionaryValidator.getById(),
  expressValidate,
  DictionaryController.delete
);

module.exports = { dictionaryRouter };

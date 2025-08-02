const { Router } = require("express");
const { WordController } = require("../../controllers/word/word.controller.js");

const wordRouter = Router();

const { expressValidate } = require("../../validators/index.js");
const { WordValidator } = require("../../validators/word/word.validator.js");

wordRouter.get("/get-all", WordController.getAll);

wordRouter.get(
  "/get/:id",
  WordValidator.getById(),
  expressValidate,
  WordController.getById
);

wordRouter.post(
  "/add",
  WordValidator.add(),
  expressValidate,
  WordController.add
);

wordRouter.put(
  "/update/:id",
  WordValidator.update(),
  expressValidate,
  WordController.update
);

wordRouter.delete(
  "/delete/:id",
  WordValidator.getById(),
  expressValidate,
  WordController.delete
);

module.exports = { wordRouter };

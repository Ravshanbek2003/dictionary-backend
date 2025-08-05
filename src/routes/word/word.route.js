const { Router } = require("express");
const { WordController } = require("../../controllers/word/word.controller.js");

const wordRouter = Router();

const { expressValidate } = require("../../validators/index.js");
const { WordValidator } = require("../../validators/word/word.validator.js");
const { authMiddleware } = require("../../middlewares/auth.middleware.js");

wordRouter.get("/get-all", WordController.getAll);

wordRouter.get(
  "/get/:id",
  authMiddleware,
  WordValidator.getById(),
  expressValidate,
  WordController.getById
);

wordRouter.post(
  "/add",
  authMiddleware,
  WordValidator.add(),
  expressValidate,
  WordController.add
);

wordRouter.put(
  "/update/:id",
  authMiddleware,
  WordValidator.update(),
  expressValidate,
  WordController.update
);

wordRouter.delete(
  "/delete/:id",
  authMiddleware,
  WordValidator.getById(),
  expressValidate,
  WordController.delete
);

module.exports = { wordRouter };

const { Router } = require("express");
const { AuthController } = require("../../controllers/auth/auth.controller.js");

const authRouter = Router();

const { expressValidate } = require("../../validators/index.js");
const { AuthValidator } = require("../../validators/auth/auth.validator.js");

authRouter.post(
  "/register-admin",
  AuthValidator.registerAdmin(),
  expressValidate,
  AuthController.registerAdmin
);
authRouter.post(
  "/login",
  AuthValidator.login(),
  expressValidate,
  AuthController.login
);

module.exports = { authRouter };

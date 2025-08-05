const { body, param } = require("express-validator");

class AuthValidator {
  static login = () => [
    body("phone", "Title must be a string.").isString(),
    body("password", "Password is required.").exists().isString(),
  ];
  static registerAdmin = () => [
    body("fullName", "Title must be a string.").isString(),
    body("phone", "Title must be a string.").isString(),
    body("password", "Password is required.").exists().isString(),
    body("reg_key", "reg_key must be a string.").isString(),
  ];
}

module.exports = { AuthValidator };

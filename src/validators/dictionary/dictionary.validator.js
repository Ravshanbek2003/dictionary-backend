const { body, param } = require("express-validator");

class DictionaryValidator {
  static add = () => [
    body("title", "Title is required.").notEmpty(),
    body("title", "Title must be a string.").isString(),
    body("type", "Type is required.").notEmpty(),
    body("type", "Type must be either HISTORICAL or MODERN.").isIn([
      "HISTORICAL",
      "MODERN",
    ]),
    body("description", "Description must be a string.").optional().isString(),
  ];

  static getById = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
  ];

  static update = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
    body("title", "Title must be a string.").optional().isString(),
    body("type", "Type must be either HISTORICAL or MODERN.")
      .optional()
      .isIn(["HISTORICAL", "MODERN"]),
    body("description", "Description must be a string.").optional().isString(),
  ];
}

module.exports = { DictionaryValidator };

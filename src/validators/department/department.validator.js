const { body, param } = require("express-validator");

class DepartmentValidator {
   
  static add = () => [
    body("title", "Title is required.").notEmpty(),
    body("title", "Title must be a string.").isString(),
    body("title", "Title must be at least 1 character long.").isLength({ min: 1 }),

    body("description", "Description must be a string.").optional().isString(),

    body("dictionary", "Dictionary ID is required.").notEmpty(),
    body("dictionary", "Dictionary ID must be a valid MongoDB ObjectId.").isMongoId(),
  ];
 
  static getById = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
  ];
 
  static update = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
  
    body("title", "Title must be a string.").optional().isString(),

    body("description", "Description must be a string.").optional().isString(),

    body("dictionary", "Dictionary ID must be a valid MongoDB ObjectId.").optional().isMongoId(),
  ];
}

module.exports = { DepartmentValidator };
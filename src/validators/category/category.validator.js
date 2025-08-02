const { body, param } = require("express-validator");

class CategoryValidator {
  
  static add = () => [
    body("title", "Title is required.").notEmpty(),
    body("title", "Title must be a string.").isString(),
    body("title", "Title must be at least 1 character long.").isLength({ min: 1 }), 
    body("dictionary", "Dictionary ID is required.").notEmpty(),
    body("dictionary", "Dictionary ID must be a valid MongoDB ObjectId.").isMongoId(), 
    body("department", "Department ID is required.").notEmpty(),
    body("department", "Department ID must be a valid MongoDB ObjectId.").isMongoId(),
  ];

 
  static getById = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
  ];
 
  static update = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(), 
    body("title", "Title must be a string.").optional().isString(), 
    body("dictionary", "Dictionary ID must be a valid MongoDB ObjectId.").optional().isMongoId(), 
    body("department", "Department ID must be a valid MongoDB ObjectId.").optional().isMongoId(),
  ];
}

module.exports = { CategoryValidator };
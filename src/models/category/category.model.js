const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    title: { type: String, trim: true, minlength: 1, required: true },
    dictionary: { type: String, ref: "dictionary", required: true },
    department:{ type: String, ref: "department", required: true },
  },
  { timestamps: true, versionKey: false }
);

const CategoryModel = model("category", categorySchema, "category");

module.exports = { CategoryModel };

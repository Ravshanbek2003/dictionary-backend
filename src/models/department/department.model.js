const { Schema, model } = require("mongoose");

const departmentSchema = new Schema(
  {
    title: { type: String, trim: true, minlength: 1, required: true },
    description: { type: String },
    dictionary: { type: String, ref: "dictionary", required: true },
    // image: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const DepartmentModel = model("department", departmentSchema, "department");

module.exports = { DepartmentModel };

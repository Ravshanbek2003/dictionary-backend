const { Schema, model } = require("mongoose");

const wordSchema = new Schema(
  {
    title: { type: String, trim: true, minlength: 1, required: true },
    description: { type: String },
    dictionary: { type: String, ref: "dictionary", required: true },
    department: { type: String, ref: "department", required: true },
    category: { type: String, ref: "category", required: true },
    // image: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const WordModel = model("word", wordSchema, "word");

module.exports = { WordModel };

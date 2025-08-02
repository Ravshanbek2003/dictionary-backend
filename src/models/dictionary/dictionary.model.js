const { Schema, model } = require("mongoose");

const dictionarySchema = new Schema(
  {
    title: { type: String, trim: true, minlength: 1, required: true },
    type: { type: String, enum: ["HISTORICAL", "MODERN"], required: true },
    description: { type: String },
    // image: { type: String },
  },
  { timestamps: true, versionKey: false }
);

const DictionaryModel = model("dictionary", dictionarySchema, "dictionary");

module.exports = { DictionaryModel };

const { Schema, model } = require("mongoose");

const documentSchema = new Schema(
  {
    file_path: { type: String, required: true },
    is_use: { type: Boolean, required: true, default: false },
    where_used: {
      type: String,
      enum: ["news"],
    },
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const SaveFileModel = model("save_file", documentSchema, "save_file");

module.exports = { SaveFileModel };

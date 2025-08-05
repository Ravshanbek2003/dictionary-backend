const { Schema, model } = require("mongoose");

const authSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const AuthModel = model("auth", authSchema, "auth");

module.exports = { AuthModel };

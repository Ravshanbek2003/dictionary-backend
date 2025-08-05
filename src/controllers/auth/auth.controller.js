const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../utils/http-exception.js");
const { REG_KEY, JWT_SECRET } = require("../../utils/secret.js");
const { compare, hash, genSalt } = require("bcryptjs");
const { AuthModel } = require("../../models/auth/auth.model.js");
const { sign } = require("jsonwebtoken");

class AuthController {
  static registerAdmin = async (req, res, next) => {
    const { fullName, phone, password, reg_key } = req.body;

    const user = await AuthModel.findOne({ phone });
    if (user) {
      throw new HttpException(StatusCodes.CONFLICT, "Admin already exists");
    }

    if (REG_KEY !== reg_key) {
      throw new HttpException(StatusCodes.FORBIDDEN, "Invalid reg_key");
    }
    const salt = await genSalt(10);

    const hashedPassword = await hash(password, salt);

    await AuthModel.create({ fullName, phone, password: hashedPassword });
    res.status(StatusCodes.OK).json({ success: true, msg: "Admin created" });
  };

  static login = async (req, res, next) => {

    const { phone, password } = req.body;

    const user = await AuthModel.findOne({ phone });
    if (!user) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, "Admin topilmadi");
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Parol xato yoki telefon nomer noto'g'ri"
      );
    }
    const token = sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(StatusCodes.OK).json({ success: true, token: token });
  };
}

module.exports = { AuthController };

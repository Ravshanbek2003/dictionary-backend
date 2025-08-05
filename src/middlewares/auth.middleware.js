const { verify } = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/secret");
const { asyncHandler } = require("../utils/async-handler");
const authMiddleware = asyncHandler((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, msg: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, msg: "Unauthorized" });
  }
  const decoded = verify(token, JWT_SECRET);
  req.user = decoded;

  next();
});

module.exports = { authMiddleware };

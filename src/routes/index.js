const { uploadRouter } = require("./upload/upload.route");
const { dictionaryRouter } = require("./dictionary/dictionary.route");
const { departmentRouter } = require("./department/department.route");
const { categoryRouter } = require("./category/category.route");
const { wordRouter } = require("./word/word.route");
const { authRouter } = require("./auth/auth.route");

const main_router = [
  { path: "/auth", router: authRouter },
  { path: "/dictionary", router: dictionaryRouter },
  { path: "/department", router: departmentRouter },
  { path: "/category", router: categoryRouter },
  { path: "/word", router: wordRouter },
  { path: "/upload", router: uploadRouter },
];

module.exports = { main_router };

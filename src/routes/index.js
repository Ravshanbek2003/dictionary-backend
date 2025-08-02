const { newsRouter } = require("./news/news.route");
const { uploadRouter } = require("./upload/upload.route");
const { dictionaryRouter } = require("./dictionary/dictionary.route");
const { departmentRouter } = require("./department/department.route");
const { categoryRouter } = require("./category/category.route");
const { wordRouter } = require("./word/word.route");

const main_router = [
  { path: "/news", router: newsRouter },
  { path: "/dictionary", router: dictionaryRouter },
  { path: "/department", router: departmentRouter },
  { path: "/category", router: categoryRouter },
  { path: "/word", router: wordRouter },
  { path: "/upload", router: uploadRouter },
];

module.exports = { main_router };

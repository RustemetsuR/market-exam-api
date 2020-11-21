const path = require("path");

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, "public/uploads"),
  db: {
    name: 'market',
    url: 'mongodb://localhost',
  }
};
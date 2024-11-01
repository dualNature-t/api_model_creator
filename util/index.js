var fs = require("fs");
var { apiCreator, modelCreator, typeCreator } = require("./creator");

function deleteFolder(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file) {
      let dirPath = path + "/" + file;
      if (fs.statSync(dirPath).isDirectory()) {
        deleteFolder(dirPath);
      } else {
        fs.unlinkSync(dirPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function createDistFolder() {
  fs.mkdir("dist", (err) => {
    if (err) {
      return console.error(err);
    }
    fs.writeFile("./dist/api.ts", apiCreator(), (err) => {
      if (err) {
        return console.error(err);
      }
    });
    fs.writeFile("./dist/model.ts", modelCreator(), (err) => {
      if (err) {
        return console.error(err);
      }
    });
    fs.writeFile("./dist/typings.d.ts", typeCreator(), (err) => {
      if (err) {
        return console.error(err);
      }
    });
  });
}

module.exports = {
  deleteFolder,
  createDistFolder,
};

const fs = require("fs");
const path = require("path");

const rootPath = path.join(__dirname, "docs");

const searchDirectory = (dir, storeCallback) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    let fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchDirectory(fullPath, storeCallback);
    } else if (entry.isFile()) {
      storeCallback(entry, fullPath);
    } else {
      console.error(`unexpected type: ${fullPath}`);
    }
  });
};

exports.searchDirectory = searchDirectory;
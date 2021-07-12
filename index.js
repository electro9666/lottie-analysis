const fs = require("fs");
const path = require("path");
const searchDirectory = require('./fileUtil').searchDirectory;

// 1. schema 폴더 검색
// const storeList = [];
const schemaObj = {};
const startPath = path.join(__dirname, 'schema');
console.log('startPath', startPath);
searchDirectory(startPath, (entry, fullPath) => {
  console.log('entry.name', entry.name);
  console.log('fullPath', fullPath);
  if (entry.name.endsWith('.json')) {
    const contents = fs.readFileSync(fullPath, 'utf-8');

    const key = '#' + fullPath.replace(startPath, '').replace('.json', '');
    schemaObj[key] = {
      fullPath: fullPath.replace(startPath, ''),
      contents: JSON.parse(contents),
    }
    // storeList.push({
    //   fullPath: fullPath.replace(startPath, ''),
    //   contents: JSON.parse(contents),
    // });
  }
});

console.log(schemaObj);


fs.writeFileSync('./schemaObj.txt', JSON.stringify(schemaObj, null, 2));
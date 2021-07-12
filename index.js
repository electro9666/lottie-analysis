const fs = require("fs");
const path = require("path");
const searchDirectory = require('./fileUtil').searchDirectory;

/**
 * 1. schema 폴더 검색 및 object로 자료구조 만들기
 */
// const storeList = [];
const schemaObj = {};
const startPath = path.join(__dirname, 'schema');
console.log('startPath', startPath);
searchDirectory(startPath, (entry, fullPath) => {
  // console.log('entry.name', entry.name);
  // console.log('fullPath', fullPath);
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
// console.log(schemaObj);
fs.writeFileSync('./schemaObj.txt', JSON.stringify(schemaObj, null, 2));

/**
 * 2. source/*.json 파일 분석
 */
const jsonFilePath = path.join(__dirname, 'source/67998-my-little-plane.json');
const jsonObj = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
// console.log('jsonObj', jsonObj);

const findSchema = (parent, jsonData) => {
  if (typeof jsonData !== 'object') return;
  if (jsonData instanceof Array) {
    jsonData.forEach(j => {
      findSchema(parent, j);
    })
  }

  let jsonKeyArr = Object.keys(jsonData);
  Object.keys(schemaObj).forEach((schemaKey) => {
    let propertiesKeyArr = Object.keys(schemaObj[schemaKey].contents.properties || {});
    jsonKeyArr = jsonKeyArr.filter((p) => p !== 'meta' && p !== 'markers');

    if (jsonKeyArr.length === jsonKeyArr.filter((j) => propertiesKeyArr.indexOf(j) !== -1).length) {
      console.log('schemaKey-match', parent, schemaKey);

      jsonKeyArr.forEach((j) => {
        findSchema(j, jsonData[j]);
      });
    } else {
      if (jsonKeyArr.filter((j) => propertiesKeyArr.indexOf(j) !== -1).length > 2) {
        console.log('schemaKey not match', schemaKey, jsonKeyArr.length, jsonKeyArr.filter((j) => propertiesKeyArr.indexOf(j) !== -1).length);
      }
    }
  });
}
const analyzeFn = (jsonData) => {
  const schema = findSchema('root', jsonData);
}

analyzeFn(jsonObj);
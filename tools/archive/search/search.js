const { traverseMarkdowns } = require("../../common/traverse-markdowns");
const { getRelativePath } = require("../../common/file-utis");
const pathModule = require("path");

/**
 * @param {string} path - Path to search
 * @param {string[]} propertyValues - Property values to search
 */
function search(path, propertyValues) {
  const criteria = getSearchCriteria(propertyValues);
  const absPath = pathModule.resolve(process.cwd(), path);

  const results = [];

  traverseMarkdowns(absPath, (markdown, filePath) => {
    const found = testCriteria(markdown, criteria);
    if (found) {
      results.push(getRelativePath(filePath));
    }
  });

  console.log(`Found ${results.length} results.`);
  results.forEach((result) => console.log(result));
}

function testCriteria(markdown, criteria) {
  const mergedData = { ...markdown.frontMatter };
  mergedData.content = markdown.content;

  for (const field in criteria) {
    if (!mergedData[field]) {
      return false;
    }

    const query = String(criteria[field]).toLowerCase().trim();
    const fieldValue = String(mergedData[field]).toLowerCase().trim();

    if (query === "") {
      return fieldValue === "";
    } else {
      fieldValue.includes(query);
    }
  }

  return true;
}

function getSearchCriteria(propertyValues) {
  const criteria = {};
  propertyValues.forEach((propertyValue) => {
    const [key, value] = propertyValue.split("=");
    criteria[key] = value;
  });

  return criteria;
}

module.exports = {
  search,
};

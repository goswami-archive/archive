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
    const fieldValue = stringifyValue(mergedData[field]).toLowerCase().trim();

    if (query === "") {
      return fieldValue === "";
    } else {
      return fieldValue.includes(query);
    }
  }

  return true;
}

function stringifyValue(value) {
  if (typeof value === "string") {
    return value;
  } else if (typeof value === "number") {
    return String(value);
  } else if (typeof value === "boolean") {
    return value ? "true" : "false";
  } else if (Array.isArray(value)) {
    return value.join(",");
  } else {
    return "";
  }
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
import nodePath from "node:path";
import { getRelativePath } from "#common/file-utils.js";
import { traverseFiles } from '#common/traverse-files.js';

/**
 * @param {string} path - Path to search
 * @param {string[]} propertyValues - Property values to search
 */
function search(path, propertyValues) {
  const criteria = getSearchCriteria(propertyValues);
  const absPath = nodePath.resolve(process.cwd(), path);

  const results = [];

  traverseFiles(absPath, (filePath) => {
    const markdown = getMarkdownContent(filePath);
    const found = testCriteria(markdown, criteria);
    if (found) {
      results.push(getRelativePath(filePath));
    }
  }, ".md");

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

export { search };

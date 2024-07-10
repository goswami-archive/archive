const FILE_NAME_REGEX =
  /^(?:([a-z]{2})_)?(?:(\d{4}-\d{2}-\d{2})_)?(?:p(\d+)_)?([a-zA-z0-9_]+)$/;

const DIR_NAME_REGEX = /^(\d{4}-\d{2}-\d{2})(?:_p(\d+))?_(.+)/;

/**
 * @param {string} fileName
 * @returns
 */
function parseFileName(fileName) {
  const match = fileName.match(FILE_NAME_REGEX);

  return {
    lang: match[1],
    date: match[2],
    part: match[3],
    title: match[4],
  };
}

/**
 * @param {string} fileName
 * @returns
 */
function parseDirName(fileName) {
  const match = fileName.match(DIR_NAME_REGEX);

  return {
    date: match[1],
    part: match[2],
    title: match[3],
  };
}

export { FILE_NAME_REGEX, DIR_NAME_REGEX, parseDirName, parseFileName };

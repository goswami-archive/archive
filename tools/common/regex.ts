export const FILE_NAME_REGEX =
  /^(?:([a-z]{2})_)?(?:(\d{4}-\d{2}-\d{2})_)?(?:p(\d+)_)?([a-zA-z0-9_]+)$/;

export const DIR_NAME_REGEX = /^(\d{4}-\d{2}-\d{2})(?:_p(\d+))?_(.+)/;

type ParsedFileName = {
  lang: string;
  date: string;
  part: string;
  title: string;
};

export function parseFileName(fileName: string): ParsedFileName | null {
  const match = fileName.match(FILE_NAME_REGEX);

  if (!match) {
    return null;
  }

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
export function parseDirName(fileName: string) {
  const match = fileName.match(DIR_NAME_REGEX);

  if (!match) {
    return {
      date: null,
      part: null,
      title: null,
    };
  }

  return {
    date: match[1],
    part: match[2],
    title: match[3],
  };
}

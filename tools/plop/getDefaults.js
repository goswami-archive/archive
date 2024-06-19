function getDefaults(dirName) {
  const defaults = {
    type: "post",
    lang: "en",
    title: "New Post",
    authors: {
      en: "Bhakti Sudhir Goswami",
      ru: "Бхакти Судхир Госвами",
    },
    date: new Date().toISOString().split("T")[0],
    draft: true,
  };

  if (dirName) {
    const info = getInfoFromPath(dirName);
    if (info) {
      defaults.date = info.date;
      defaults.part = info.part;
      defaults.title = info.title;
    }
  }

  return defaults;
}

function getInfoFromPath(path) {
  const directory = getDirectoryName(path);
  return parseDirectoryPath(directory);
}

function getDirectoryName(path) {
  const normalizedPath = path.replace(/\\/g, "/");
  const parts = normalizedPath.split("/");
  return parts.pop();
}

function parseDirectoryPath(path) {
  const regex = /(\d{4}-\d{2}-\d{2})(?:_p(\d+))?_(.+)$/;
  const match = path.match(regex);
  if (!match) {
    return null;
  }

  return {
    date: match[1],
    part: match[2],
    title: match[3].replace(/_/g, " "),
  };
}

module.exports = {
  getDefaults,
};

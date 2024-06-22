const fs = require("fs");

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
  return parseDirectoryName(fs.dirName(path));
}

function parseDirectoryName(dirName) {
  const regex = /^(\d{4}-\d{2}-\d{2})(?:_p(\d+))?_(.+)/;
  const match = dirName.match(regex);
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

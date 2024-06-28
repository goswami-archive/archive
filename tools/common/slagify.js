const kebabCase = require("lodash.kebabcase");

module.exports = {
  slugify(text) {
    let kebabed = kebabCase(text);
    // do not treat part number digit as separate word
    kebabed = kebabed.replace(/-p-(\d+)-/, "-p$1-");
    return kebabed;
  },
};

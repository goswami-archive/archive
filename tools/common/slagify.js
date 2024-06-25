const kebabCase = require("lodash.kebabcase");

module.exports = {
  slugify(text) {
    return kebabCase(text);
  },
};

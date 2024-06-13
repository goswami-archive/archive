const toKebabCase = require("lodash.kebabcase");

module.exports = function (plop) {
  const outDir = `./../../${process.argv[5] ?? 'generated'}`;

  const defaults = {
    type: "post",
    lang: "en",
    authors: "Bhakti Sudhir Goswami",
    date: new Date().toISOString().split("T")[0],
    draft: true,
  };

  const whenPost = (answers) => answers.type === "post";

  const commaSeparatedListFilter = (input) => {
    if (input === "") return [];
    return input.split(",").map((item) => item.trim());
  };

  plop.setGenerator("Markdown", {
    prompts: [
      {
        name: "type",
        type: "list",
        message: "Select type:",
        default: defaults.type,
        choices: ["post", "category"],
        filter: (v) => v.toLowerCase(),
      },
      {
        name: "lang",
        type: "input",
        message: "Language:",
        default: "en",
      },
      {
        name: "date",
        type: "input",
        message: "Date (YYYY-MM-DD):",
        default: defaults.date,
        when: whenPost,
      },
      {
        name: "title",
        type: "input",
        message: "Title:",
        default: (input) =>
          input.type === "post" ? "New Post" : "New Category",
      },
      {
        name: "part",
        type: "input",
        message: "Part number:",
        when: whenPost,
      },
      {
        name: "authors",
        type: "input",
        message: "Authors (comma separated):",
        filter: commaSeparatedListFilter,
        default: defaults.authors,
        when: whenPost,
      },
      {
        name: "location",
        type: "input",
        message: "Location:",
        when: whenPost,
      },
      {
        name: "description",
        type: "input",
        message: "SEO-freindly description (max. 200 characters):",
      },
      {
        name: "audio",
        type: "input",
        message: "Audio URL or local path:",
        default: (input) => getFileName(input) + ".mp3",
        when: whenPost,
      },
      {
        name: "draft",
        type: "confirm",
        message: "Draft?",
        default: defaults.draft,
        when: whenPost,
      },
      {
        name: "translators",
        type: "input",
        message: "Translators (comma separated):",
        filter: commaSeparatedListFilter,
        when: whenPost,
      },
      {
        name: "transcribers",
        type: "input",
        message: "Transcribers (comma separated):",
        filter: commaSeparatedListFilter,
        when: whenPost,
      },
      {
        name: "editors",
        type: "input",
        message: "Editors (comma separated):",
        filter: commaSeparatedListFilter,
        when: whenPost,
      },
      {
        name: "tags",
        type: "input",
        message: "Tags (comma separated):",
        filter: commaSeparatedListFilter,
        when: whenPost,
      },
      {
        name: "slug",
        type: "input",
        message: "Slug:",
        default: getSlug,
      },
      {
        name: "image.desktop",
        type: "input",
        message: "Image:",
      },
    ],
    actions: (answers) => {
      const filename = getFileName(answers) + ".md";
      console.log(answers);

      const action = {
        type: "add",
        path: `${outDir}/${filename}`,
        templateFile: `template/${answers.type}.md`,
      };

      return [action];
    },
  });
};

function getFileName(answers) {
  const partNumber = answers.part ? `_p${answers.part}` : "";
  const title = answers.title.replace(/\s+/g, "_");
  const date = answers.date ? `_${answers.date}` : "";
  return `${answers.lang}${date}${partNumber}_${title}`;
}

function getSlug(answers) {
  const partNumber = answers.part ? `-p${answers.part}` : "";
  const date = answers.date ? `-${answers.date}` : "";

  return `${answers.lang}${date}${partNumber}-${toKebabCase(answers.title)}`;
}

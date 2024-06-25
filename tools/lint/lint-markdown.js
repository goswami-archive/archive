const { program, Option } = require("commander");
const { globSync } = require("glob");
const { lintHtml } = require("./lint-html.js");
const { lintFrontMatter } = require("./lint-front-matter.js");

program
  .version("0.1.0")
  .option("-f, --file [files...]", "space separated list of files to validate")
  .addOption(
    new Option("-p, --path <path>", "directory path to validate").conflicts("file")
  );

program.parse(process.argv);

const { file, path } = program.opts();
const files =
  file ||
  globSync(path, {
    absolute: true,
  });

let hasErrors = false;

files.forEach((file) => {
  let messages = lintFrontMatter(file);
  if (messages) {
    hasErrors = true;
    printMessages(file, messages);
  }

  messages = lintHtml(file);
  if (messages) {
    hasErrors = true;
    printMessages(file, messages);
  }
});

if (hasErrors) {
  process.exit(1);
}

function printMessages(file, messages) {
  messages.forEach((message) => {
    console.error(`${file} \t ${message}`);
  });
}

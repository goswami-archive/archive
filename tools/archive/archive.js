#!/usr/bin/env node
const { program, Option } = require("commander");
const { lint } = require("./lint/lint");
const { fetch } = require("./fetch/fetch");
const { search } = require("./search/search");

program
  .name("archive")
  .description("CLI tool for archive management")
  .version("0.1.0");

program
  .command("lint")
  .description("Lint markdown files")
  .option("-f, --files [files...]", "space separated list of files to validate")
  .addOption(
    new Option("-p, --path <path>", "directory path to validate").conflicts(
      "file"
    )
  )
  .action((options) => {
    lint(options);
  });

program
  .command("fetch")
  .description("Download media referenced in markdown files")
  .option("-p, --path <path>", "Path to scan for markdown files")
  .option(
    "-f, --force <force>",
    "Rewrite local files that are newer than remote"
  )
  .action((options, command) => {
    fetch(options);
  });

program
  .command("search")
  .description("Search throught markdown content")
  .arguments("<path> <property=value...>")
  .action((path, propertyValues) => {
    search(path, propertyValues);
  });

program
  .command("stats")
  .description("Get statistics")
  .action((options) => {
    // TODO: Implement
  });

program.parse();

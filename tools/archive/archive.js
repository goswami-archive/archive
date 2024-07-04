#!/usr/bin/env node
const { program } = require("commander");
const { fetch } = require("./fetch/fetch");
const { search } = require("./search/search");

program
  .name("archive")
  .description("CLI tool for archive management")
  .version("0.1.0");

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
  .command("stats")
  .description("Get statistics")
  .option("-f, --file <file>", "Specify the file to get stats from")
  .option("-v, --verbose", "Output detailed stats")
  .action((options) => {
    console.log(`Getting stats from ${options.file}...`);
    if (options.verbose) {
      console.log("Verbose mode enabled.");
    }
  });

program
  .command("search")
  .description("Search throught markdown content")
  .arguments("<path> <property=value...>")
  // .argument("<path>", "Path to search in")
  // .argument("<query>", "Query to search")
  // .option("[-field], --field <field>", "Field to search")
  .action((path, propertyValues) => {
    search(path, propertyValues);
  });

program.parse();

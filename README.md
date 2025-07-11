<div align="center">
  <img alt="Goswami Maharaj speaking" src=".github/assets/archive-banner.jpg" style="width: 100%; height: auto;">
</div>

## His Divine Grace Srila Bhakti Sudhir Goswami Talks

This is an archive of lectures of Bhakti Sudhir Goswami.  
Website: [GOSWAMI.app](https://goswami.app)

- [Contribution](#contribution)
- [Tools](#tools)
  - [Predefined scripts](#predefined-scripts)
  - [`archive` script](#archive-script)
  - [`lint`](#archive-lint)
  - [`fetch`](#archive-fetch)
  - [`search`](#archive-search)
  - [`genmd`](#archive-genmd)
  - [`genmeta`](#archive-genmeta)

## Contribution

1. Fork this repository.
1. Make a contribution. Add transcription or translation. Visit [documentation](https://goswami-archive.gitbook.io/docs/) site for the details.
1. Create pull request and wait for it to be merged.

## Tools

### Predefined scripts

`package.json` contains some predefined scripts:
| Script | Description |
| --- | --- |
| `npm run lint` | Lints all markdown files in `content` directory.
| `npm run drafts` | Lists markdowns with `draft` property set to `true`.
| `npm run notext` | Lists markdowns without transcription.
| `npm run genmeta` | Generates `.meta.yaml` files with media information.

### <a id="archive-script"></a>`archive` script

Use `archive` script to perform various tasks on archive. It has folowing options:

| Option          | Description                   |
| --------------- | ----------------------------- |
| `-h, --help`    | Displays help.                |
| `-V, --version` | Displays version information. |

```sh
# Display help
npm run archive -- --help

```

Next commands are available:

| Command                     | Description                                   |
| --------------------------- | --------------------------------------------- |
| [lint](#archive-lint)       | Lints markdown files.                         |
| [fetch](#archive-fetch)     | Downloads media referenced in markdown files. |
| [search](#archive-search)   | Searches throught markdown content.           |
| [genmd](#archive-genmd)     | Generates markdown files from media files.    |
| [genmeta](#archive-genmeta) | Generates or updates media meta-information.  |

```sh
npm run archive -- <command> [options]

# or
node tools/archive/archive.js <command> [options]

# Display help for specific command
npm run archive -- <command> --help
```

### <a id="archive-lint"></a>`lint`

| Option                   | Description                                |
| ------------------------ | ------------------------------------------ |
| `-f, --files [files...]` | Space separated list of files to validate. |
| `-p, --path <path>`      | Directory path to validate.                |

```sh
# Validate all markdown files in specific directory
npm run archive -- lint -p content/audios/2011/

# Validate specific markdown file
npm run archive -- lint -f content/audios/2011/2011-11-23_Positive_Self_Denial/ru_2011-11-23_Positive_Self_Denial.md

# Predefined: validate all markdown files in content directory
npm run lint
```

### <a id="archive-fetch"></a>`fetch`

```sh
# Fetch all files referenced in markdowns in specified directory
npm run archive -- fetch -p content/audios/2011/2011-11-23_Positive_Self_Denial

```

### <a id="archive-search"></a>`search`

Search throught markdown content by given criteria.

| Argument              | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `<path>`              | Path to search for markdown files.                           |
| `<property=value...>` | Space separated list of properties and values to search for. |

```sh
# Search for markdown files with content containing substring "some text"
npm run archive -- search content/ content="some text"

# Search by 'date' front-matter field
npm run archive -- search content/ date=2011-11-23

# Search by multiple fields
npm run archive -- search content/ type=post draft=true

```

### genmd

Use `genmd` script to generate markdown files from media files. Generation could be done in automatic mode or interactive mode. Markdown files will be created in the same directory as media file.

| Option                   | Description                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `-l, --langs [langs...]` | Space separated list of languages, used if language code is not present in file name (default: en). |
| `-a, --auto`             | When specifying media file, create markdowns without prompts.                                       |

Generate markdown files for every mp3-file in `content/audios/` directory.

```sh
npm run archive -- genmd content/audios/
```

You may specify a media file as a source of data. It's name will be parsed and used as source for front matter (language, date, title etc.). Audio's ID3v2 `lyrics` tag will be used as markdown's content. By default interactive mode is used.

```sh
npm run archive -- genmd content/audios/2011/2011-11-23_Positive_Self_Denial/ru_2011-11-23_Positive_Self_Denial.mp3
```

Specify `-a` flag to generate markdown without prompts.

```sh
npm run archive -- genmd content/audios/2011/2011-11-23_Positive_Self_Denial/ru_2011-11-23_Positive_Self_Denial.mp3 -a
```

If specified media file doesn't contain language code in filename, an English will be used as default. You may also specify a list of languages to generate multiple markdown files. This is only applied to automatic mode.

```sh
npm run archive -- genmd content/audios/Bhajans_and_Kirtans/Bhoga_Arati/Bhoga_Arati.mp3 -a -l en ru
```

### <a id="archive-genmeta"></a>`genmeta`

Generates or updates media meta-information stored in `.meta.yaml` files.
| Argument | Description |
| --- | --- |
| `<path>` | Path to directory with media files.

```sh
npm run archive -- genmeta content/
```

---

Licensed under [CC BY-NC-SA 4.0](LICENSE).

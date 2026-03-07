---
name: archive-management
description: Name new files and directories, rename/move existing files. Modify Markdown files with YAML front matter and transcription. Validate and lint Markdown files. Use when adding new or modifying existing lectures, articles, and playlists.
---

# Archive Management

## Introduction

See [Archive Structure](https://raw.githubusercontent.com/goswami-archive/docs/refs/heads/main/en/get-started/archive-structure.md) for an overview of the archive structure.

See [Naming Conventions](https://raw.githubusercontent.com/goswami-archive/docs/refs/heads/main/en/get-started/naming.md) for an overview of the naming conventions.

See [Document Structure](https://raw.githubusercontent.com/goswami-archive/docs/refs/heads/main/en/working-with-documents/document-structure.md) section for an overview of the document structure.

## Workflows

### 1. Adding a new lecture

1. Parse the file name to determine the lecture's metadata (date, title, part number).

- date could be in the format `YYYY-MM-DD` or `YYYY_MM_DD`.
- part number could be in the format `00_04`, where `00` is the current lecture number and `04` is the total number of parts.

2. Translate title into English if required.
3. Create a new directory in `content/audios/processed`. Follow directory naming convention from guidelines.
4. Copy the lecture's audio file into the directory.
5. Rename the lecture's audio file to follow naming convention from guidelines.
6. Run script to generate the lecture's markdown file.

```sh
npm run archive -- genmd -a <path-to-audio-file>
```

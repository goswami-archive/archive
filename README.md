<div align="center">
  <img alt="Goswami Maharaj speaking" src=".github/assets/archive-banner.jpg" style="width: 100%; height: auto;">
</div>

## His Divine Grace Srila Bhakti Sudhir Goswami Talks
This is an archive of lectures of Bhakti Sudhir Goswami.

## Web Site
[GOSWAMI.app](https://goswami.app)

## Contribution
1. Fork this repository.
1. Make a contribution. Add transcription or translation. Visit [documentation](https://goswami-archive.gitbook.io/docs/) site for the details.
1. Create pull request and wait for it to be merged.

## Tools
Use `genmd` script to generate markdown files from prompts. 
```sh
npm run genmd <directory|audio_file|markdown_file>
```
It requires single parameter:
- `directory` - directory to output markdown file.
- `audio_file` - mp3 that will be used as source of data (title, lyrics, etc).
- `markdown_file` - new markdown file name.

```sh
# Generated markdown will be put in scpecified directory
npm run genmd content/audios/2011/2011-11-23_Positive_Self_Denial

# Specify audio that will be used as source of data.
# Markdown will be created in same directory
npm run genmd content/audios/2011/2011-11-23_Positive_Self_Denial/ru_2011-11-23_Positive_Self_Denial.mp3

# Specify markdown file name
npm run genmd content/audios/2011/2011-11-23_Positive_Self_Denial/ru_2011-11-23_Positive_Self_Denial.md

```

---
Licensed under [CC BY-NC-SA 4.0](LICENSE).



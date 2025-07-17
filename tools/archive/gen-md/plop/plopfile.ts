import nodePath from 'node:path';
import { getDefaults } from '../getDefaults.ts';
import {
  type PathInfo,
  getPathInfo as pathInfoUtils,
} from '#common/file-utils.ts';
import { FILE_NAME_REGEX, DIR_NAME_REGEX } from '#common/regex.ts';
import { slugify } from '#common/slugify.ts';
import { writePost, writeCategory } from '#common/markdown/markdown.ts';
import { type NodePlopAPI } from 'node-plop';

export default async function (plop: NodePlopAPI) {
  const filePath = getPathArgument(process.argv);
  const pathInfo = getPathInfo(filePath);

  if (!filePath || !validateFileName(pathInfo)) {
    console.log(
      'Please specify a valid file or directory path (see details: https://goswami-archive.gitbook.io/docs/archive-structure/naming)'
    );
    process.exit(1);
  }

  const defaults = await getDefaults(pathInfo);

  const whenPost = (answers) => answers.type === 'post';

  const commaSeparatedListFilter = (input) => {
    if (input === '') return [];
    return input.split(',').map((item) => item.trim());
  };

  plop.setActionType('nunjucksRender', plopActionNunjucksRender);

  plop.setGenerator('markdown', {
    prompts: [
      {
        name: 'type',
        type: 'list',
        message: 'Select type:',
        default: 'post',
        choices: ['post', 'category'],
        filter: (v) => v.toLowerCase(),
      },
      {
        name: 'lang',
        type: 'input',
        message: 'Language:',
        default: defaults.lang,
      },
      {
        name: 'date',
        type: 'input',
        message: 'Date (YYYY-MM-DD):',
        default: defaults.date,
        when: whenPost,
      },
      {
        name: 'title',
        type: 'input',
        message: 'Title:',
        default: (input) =>
          input.type === 'post' ? defaults.title : 'New Category',
      },
      // {
      //   name: "part",
      //   type: "input",
      //   message: "Part number:",
      //   default: defaults.part,
      //   when: whenPost,
      // },
      {
        name: 'authors',
        type: 'input',
        message: 'Authors (comma separated):',
        filter: commaSeparatedListFilter,
        default: (input) => defaults.authors[input.lang],
        when: whenPost,
      },
      {
        name: 'location',
        type: 'input',
        message: 'Location:',
        when: whenPost,
      },
      {
        name: 'description',
        type: 'input',
        message: 'SEO-freindly description (max. 200 characters):',
      },
      {
        name: 'audio',
        type: 'input',
        message: 'Audio URL or local path:',
        default: (input) => getAudioPath(input.lang, pathInfo),
        when: whenPost,
      },
      {
        name: 'draft',
        type: 'confirm',
        message: 'Draft?',
        default: defaults.draft,
        when: whenPost,
      },
      {
        name: 'translators',
        type: 'input',
        message: 'Translators (comma separated):',
        filter: commaSeparatedListFilter,
        when: whenPost,
      },
      {
        name: 'transcribers',
        type: 'input',
        message: 'Transcribers (comma separated):',
        filter: commaSeparatedListFilter,
        when: whenPost,
      },
      {
        name: 'editors',
        type: 'input',
        message: 'Editors (comma separated):',
        filter: commaSeparatedListFilter,
        when: whenPost,
      },
      {
        name: 'tags',
        type: 'input',
        message: 'Tags (comma separated):',
        filter: commaSeparatedListFilter,
        when: whenPost,
      },
      {
        name: 'slug',
        type: 'input',
        message: 'Slug:',
        default: defaults.slug ?? getSlug,
      },
      {
        name: 'image.desktop',
        type: 'input',
        message: 'Image:',
      },
      {
        name: 'license',
        type: 'input',
        message: 'License:',
        default: defaults.license ?? '',
      },
    ],
    actions: (answers) => {
      const action = {
        type: 'nunjucksRender',
        path: getOutputPath(pathInfo, answers),
      };

      return [action];
    },
  });
}

function plopActionNunjucksRender(answers, config, plop) {
  return new Promise((resolve, reject) => {
    try {
      if (answers.type === 'post') {
        writePost(config.path, { frontMatter: answers, content: null });
      } else {
        writeCategory(config.path, { frontMatter: answers, content: null });
      }
      resolve();
    } catch (error) {
      return reject(error);
    }
  });
}

function getAudioPath(lang: string, pathInfo: PathInfo): string {
  const { isDir, fileName } = pathInfo;
  if (isDir) {
    return `${lang}_${fileName}.mp3`;
  }

  return `${fileName}.mp3`;
}

function getSlug(answers) {
  const partNumber = answers.part ? `-p${answers.part}` : '';
  const date = answers.date ? `-${answers.date}` : '';

  return slugify(`${answers.lang}${date}${partNumber}-${answers.title}`);
}

function getOutputPath(pathInfo, answers) {
  const { isDir, fileName, path } = pathInfo;
  if (isDir) {
    return `${path}/${answers.lang}_${fileName}.md`;
  }

  return path.replace('.mp3', '.md');
}

function validateFileName(pathInfo) {
  if (pathInfo.isDir) {
    return DIR_NAME_REGEX.test(pathInfo.fileName);
  } else {
    return FILE_NAME_REGEX.test(pathInfo.fileName);
  }
}

function getPathInfo(relativePath) {
  const filePath = nodePath.resolve(process.cwd(), relativePath);

  // if (relativePath.endsWith(".md")) {
  //   createMarkdownFile(relativePath);
  // }

  const info = pathInfoUtils(filePath);

  // if (relativePath.endsWith(".md")) {
  //   fs.unlinkSync(filePath);
  // }

  return info;
}

function getPathArgument(args) {
  const index = args.findIndex((arg) => arg === 'genmd');
  return args[index + 1];
}

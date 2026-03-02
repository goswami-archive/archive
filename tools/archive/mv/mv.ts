import fs from 'node:fs';
import nodePath from 'node:path';
import { slugify } from '#common/slugify.ts';
import {
  type PostMatter,
  getMarkdownContent,
  writePost,
} from '#common/markdown/markdown.ts';

type MvOptions = {
  force: boolean;
  date?: string;
  title?: string;
};

export function mv(
  source: string,
  destination: string | undefined,
  options: MvOptions
) {
  const srcPath = nodePath.resolve(process.cwd(), source);

  if (!fs.existsSync(srcPath) || !fs.statSync(srcPath).isDirectory()) {
    console.error(`Source "${srcPath}" does not exist or is not a directory.`);
    process.exit(1);
  }

  const oldBase = nodePath.basename(srcPath);

  // determine destination directory and base name
  let destDir: string;
  let destBase: string;
  if (destination) {
    const destAbs = nodePath.resolve(process.cwd(), destination);

    if (fs.existsSync(destAbs) && fs.statSync(destAbs).isDirectory()) {
      // destination is an existing directory; keep original base name
      destDir = destAbs;
      destBase = oldBase;
    } else {
      // treat destination as full path (may not exist yet)
      destDir = nodePath.dirname(destAbs);
      destBase = nodePath.basename(destAbs);
    }
  } else {
    // no explicit destination – stay in same parent
    destDir = nodePath.dirname(srcPath);
    destBase = oldBase;
  }

  // apply optional date/title changes to the base name
  if (options.date || options.title) {
    const parts = parseLectureName(destBase);
    if (options.date) {
      parts.date = options.date;
    }
    if (options.title) {
      parts.title = sanitizeTitle(options.title);
    }
    destBase = buildLectureName(parts);
  }

  const newDirPath = nodePath.join(destDir, destBase);

  if (!options.force && fs.existsSync(newDirPath) && newDirPath !== srcPath) {
    console.error(
      `Destination "${newDirPath}" already exists (use -f to overwrite).`
    );
    process.exit(1);
  }

  // ensure destination parent exists
  fs.mkdirSync(nodePath.dirname(newDirPath), { recursive: true });

  // move/rename directory if required
  let workingDir = srcPath;
  if (newDirPath !== srcPath) {
    // remove existing if force
    if (options.force && fs.existsSync(newDirPath)) {
      fs.rmSync(newDirPath, { recursive: true, force: true });
    }
    fs.renameSync(srcPath, newDirPath);
    workingDir = newDirPath;
    console.log(`renamed directory: ${srcPath} → ${newDirPath}`);
  }

  // update files inside the directory
  updateInnerFiles(workingDir, oldBase, destBase, options);
}

interface LectureParts {
  date?: string;
  part?: string;
  title?: string;
}

function parseLectureName(name: string): LectureParts {
  const parts = name.split('_').filter((p) => p.length > 0);
  const result: LectureParts = {};

  if (parts.length && /^\d{4}-\d{2}-\d{2}$/.test(parts[0])) {
    result.date = parts.shift();
  }

  if (parts.length && /^p\d+$/.test(parts[0])) {
    result.part = parts.shift();
  }

  if (parts.length) {
    result.title = parts.join('_');
  }

  return result;
}

function buildLectureName(parts: LectureParts): string {
  const segs: string[] = [];
  if (parts.date) segs.push(parts.date);
  if (parts.part) segs.push(parts.part);
  if (parts.title) segs.push(parts.title);
  return segs.join('_') || 'Untitled';
}

function sanitizeTitle(raw: string): string {
  return raw
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('_');
}

function updateInnerFiles(
  dir: string,
  oldBase: string,
  newBase: string,
  options: any
) {
  const entries = fs.readdirSync(dir);
  entries.forEach((entry) => {
    const entryPath = nodePath.join(dir, entry);
    let targetName = entry;
    if (entry.includes(oldBase)) {
      targetName = entry.replace(oldBase, newBase);
      const targetPath = nodePath.join(dir, targetName);
      fs.renameSync(entryPath, targetPath);
    }

    const finalPath = nodePath.join(dir, targetName);
    if (finalPath.endsWith('.md')) {
      try {
        updateMarkdownFile(finalPath, oldBase, newBase, options);
      } catch (e) {
        console.error(`failed to update markdown ${finalPath}:`, e);
      }
    }
  });
}

function updateMarkdownFile(
  mdPath: string,
  oldBase: string,
  newBase: string,
  options: any
) {
  const markdown = getMarkdownContent<PostMatter>(mdPath);
  const fm = markdown.frontMatter;
  let changed = false;

  if (options.date && fm.date !== options.date) {
    fm.date = options.date;
    changed = true;
  }

  const expectedSlug = slugify(`${fm.lang}_${newBase}`);
  if (fm.slug !== expectedSlug) {
    fm.slug = expectedSlug;
    changed = true;
  }

  if (fm.audio && typeof fm.audio === 'object' && fm.audio.file) {
    const newFile = fm.audio.file.replace(oldBase, newBase);
    if (fm.audio.file !== newFile) {
      fm.audio.file = newFile;
      changed = true;
    }
  }

  if (changed) {
    writePost(mdPath, { frontMatter: fm, content: markdown.content });
  }
}

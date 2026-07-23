import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const DEFAULT_EXCLUDED_PUBLIC_FILES = new Set(['robots.txt', 'sitemap.xml', 'site.webmanifest']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm']);

async function walkFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkFiles(absolutePath));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

export async function collectMediaBudget(rootUrl = new URL('../client/public/', import.meta.url)) {
  const rootDir = fileURLToPath(rootUrl);
  const files = await walkFiles(rootDir);
  const included = [];

  for (const file of files) {
    const relativePath = path.relative(rootDir, file).split(path.sep).join('/');
    if (DEFAULT_EXCLUDED_PUBLIC_FILES.has(relativePath)) continue;

    const { size } = await stat(file);
    const extension = path.extname(file).slice(1).toLowerCase() || '(none)';
    included.push({ path: relativePath, bytes: size, extension });
  }

  included.sort((a, b) => a.path.localeCompare(b.path));

  const formats = {};
  let totalBytes = 0;
  let videoBytes = 0;

  for (const file of included) {
    totalBytes += file.bytes;
    formats[file.extension] = (formats[file.extension] ?? 0) + 1;
    if (VIDEO_EXTENSIONS.has(file.extension)) videoBytes += file.bytes;
  }

  const largestFiles = [...included]
    .sort((a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path))
    .map(({ path: filePath, bytes }) => ({ path: filePath, bytes }));

  return {
    count: included.length,
    totalBytes,
    videoBytes,
    formats: Object.fromEntries(Object.entries(formats).sort(([a], [b]) => a.localeCompare(b))),
    largestFiles,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const budget = await collectMediaBudget(process.argv[2] ? pathToFileURL(path.resolve(process.argv[2])) : undefined);
  console.log(JSON.stringify(budget, null, 2));
}

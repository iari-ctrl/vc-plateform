#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { checkGeneratedContent } from './generated-content.mjs';

const rootUrl = process.argv[2]
  ? pathToFileURL(path.resolve(process.argv[2]))
  : new URL('../', import.meta.url);
const report = checkGeneratedContent(rootUrl);

if (report.errors.length) {
  console.error(`Generated content check failed with ${report.errors.length} error(s):`);
  for (const error of report.errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Generated content check: OK (${report.counts.lessons} lessons, ${report.counts.publishedLessonBodies} published bodies, ${report.counts.glossaryTerms} glossary terms).`,
);

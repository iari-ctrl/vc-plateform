import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const root = new URL('../', import.meta.url);
export const memoOutputs = [
  'client/public/tools/simulateur-memo.html',
  'nouveau simu/embed/simulateur-memo.html',
  'nouveau simu/Simulateur Note Investissement (local).html',
];

function replaceOnce(source, marker, value) {
  if (source.split(marker).length !== 2) throw new Error(`Expected exactly one ${marker}`);
  return source.replace(marker, () => value);
}

export async function renderMemoArtifact() {
  const read = (name) => readFile(new URL(`nouveau simu/src/${name}`, root), 'utf8');
  const [shell, template, component, model] = await Promise.all([
    read('bundle-shell.html'), read('template.html'), read('component.js'), read('model.mjs'),
  ]);
  // The importable, dependency-free model is embedded in the existing DC script.
  // Only its explicit export declarations are removed; no transpiler is needed.
  const logic = `${model.replace(/^export (?=function |const )/gm, '')}\n${component}`;
  const page = replaceOnce(template, '__MEMO_LOGIC__', logic);
  return replaceOnce(shell, '__MEMO_TEMPLATE_JSON__', JSON.stringify(page).replace(/</g, '\\u003C'));
}

export async function buildMemo({ check = false } = {}) {
  const expected = await renderMemoArtifact();
  for (const output of memoOutputs) {
    const url = new URL(output, root);
    if (check) {
      if (await readFile(url, 'utf8') !== expected) throw new Error(`${output} is stale. Run npm run build:memo.`);
    } else {
      await writeFile(url, expected);
    }
  }
  console.log(`Investment memo: ${memoOutputs.length} artifacts ${check ? 'verified' : 'generated'}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await buildMemo({ check: process.argv.includes('--check') });
}

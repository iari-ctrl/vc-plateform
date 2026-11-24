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
  const [shell, template, component, model, layout, tokens] = await Promise.all([
    read('bundle-shell.html'), read('template.html'), read('component.js'), read('model.mjs'),
    read('parcours.css'), readFile(new URL('client/src/styles/tokens.css', root), 'utf8'),
  ]);
  const fonts = await Promise.all([400, 500, 600].map(async weight => {
    const font = await readFile(new URL(`node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-${weight}-normal.woff2`, root));
    return `@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2')}`;
  }));
  // The importable, dependency-free model is embedded in the existing DC script.
  // Only its explicit export declarations are removed; no transpiler is needed.
  const logic = `${model.replace(/^export (?=function |const )/gm, '')}\n${component}`;
  // Translate the legacy template/runtime palette once, at assembly, rather
  // than maintaining separate light/dark copies of every dynamic inline style.
  // The paper preview resets these variables to the original print palette.
  const palette = {
    '#16150F': 'ink', '#4A4539': 'muted', '#695F50': 'muted', '#6B6558': 'muted',
    '#F7F5F0': 'paper', '#FBFAF6': 'white', '#F2EFE9': 'panel',
    '#EDEAE2': 'paper', '#E4E0D6': 'soft', '#EAE6DC': 'soft', '#F5F2EC': 'soft',
    '#DCD6C8': 'line', '#E4DFD3': 'line', '#DFD9CB': 'line', '#CFC8B8': 'line',
    '#F0EDE5': 'inverse', '#8A8375': 'inverse-muted', '#C9A79F': 'muted',
    '#8A2B22': 'danger', '#2F5A3E': 'success', '#7A550F': 'warning',
  };
  const themed = replaceOnce(template, '__MEMO_LOGIC__', logic).replace(/#[\dA-F]{6}\b/g, color => palette[color] ? `var(--memo-${palette[color]})` : color);
  const page = replaceOnce(themed, '__MEMO_STYLES__', `${tokens}\n${fonts.join('\n')}\n${layout}`);
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

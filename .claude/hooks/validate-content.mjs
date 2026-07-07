// Hook PostToolUse (Edit|Write) : après édition d'une source de contenu
// (data/**/*.json hors generated/), régénère les splits si nécessaire puis
// lance validate-content.mjs. Un échec (exit 2) renvoie la sortie de
// validation à Claude pour correction immédiate — sans annuler l'édition.
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let fp = '';
  try {
    fp = JSON.parse(raw)?.tool_input?.file_path ?? '';
  } catch {
    // stdin illisible : rien à valider
  }
  const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

  // Uniquement les sources de contenu JSON, hors fichiers générés.
  if (!/(^|\/)data\/.*\.json$/.test(fp) || /(^|\/)data\/generated\//.test(fp)) process.exit(0);

  const isSplitSource =
    /(^|\/)data\/(lessons|glossary)\.json$/.test(fp) ||
    /(^|\/)data\/parcours\/.*\.lessons\.json$/.test(fp);

  // process.execPath : le binaire Node exécutant ce hook, indépendant du PATH.
  const run = (script) =>
    execFileSync(process.execPath, [join(root, 'scripts', script)], { cwd: root, stdio: 'pipe' });

  try {
    if (isSplitSource) {
      run('split-glossary.mjs');
      run('split-lessons.mjs');
    }
    run('validate-content.mjs');
    process.exit(0);
  } catch (e) {
    const out = (e.stdout?.toString() || '') + (e.stderr?.toString() || '');
    process.stderr.write(`Validation du contenu échouée après édition de ${fp} :\n${out}\n`);
    process.exit(2);
  }
});

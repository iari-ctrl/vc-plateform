// Hook PreToolUse (Edit|Write) : refuse toute écriture sous data/generated/,
// dont les fichiers sont régénérés par scripts/split-*.mjs — une édition
// manuelle serait écrasée silencieusement au prochain split:content.
import process from 'node:process';

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let fp = '';
  try {
    fp = JSON.parse(raw)?.tool_input?.file_path ?? '';
  } catch {
    // stdin illisible : fail-open, un garde-fou ne doit pas bloquer toutes les éditions
  }
  if (/(^|\/)data\/generated\//.test(fp)) {
    process.stderr.write(
      `Édition refusée : ${fp} est un fichier généré.\n` +
        'Édite la source (data/lessons.json, data/glossary.json ou data/parcours/*.lessons.json), ' +
        'puis lance `npm run split:content`.\n'
    );
    process.exit(2);
  }
  process.exit(0);
});

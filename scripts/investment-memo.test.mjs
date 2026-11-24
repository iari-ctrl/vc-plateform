import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import { memoOutputs, renderMemoArtifact } from './build-investment-memo.mjs';
import { calculateMemo, parseMemoNumber } from '../nouveau simu/src/model.mjs';

// Execute the exact logic embedded in the served file. Only the host bridge is
// replaced: no calculator, validation, checklist or synthesis is mocked.
const html = readFileSync(new URL('../client/public/tools/simulateur-memo.html', import.meta.url), 'utf8');
const template = JSON.parse(html.match(/<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/)[1]);
const logic = template.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
function memo(data = {}, globals = {}) {
  class Host {
    props = {};
    setState(patch, callback) { Object.assign(this.state, patch); callback?.(); }
  }
  const Component = vm.runInNewContext(`${logic}\nComponent;`, {
    DCLogic: Host,
    React: { createRef: () => ({ current: null }) },
    localStorage: { getItem: () => null, setItem: () => {} },
    ...globals,
  });
  const instance = new Component();
  Object.assign(instance.state.d, data);
  return instance;
}
const reference = { preMoney: '20', amount: '5', ticket: '2', dilution: '30', exitValue: '500', fundSize: '100' };

const completed = {
  ...reference, company: 'Exemple pédagogique', author: 'Analyste', date: '2026-09-24', round: 'Série A',
  reco: 'diligence', recoWhy: 'Vérifier la rétention', activity: 'Logiciel de gestion',
  thesisIf: 'condition', thesisThen: 'mécanisme', thesisOutcome: 'issue', falsifiedIf: 'réfutation',
  facts: Array.from({ length: 3 }, () => ({ text: 'fait', source: 'source', date: '2026-09-24', status: 'declared' })),
  whyTeam: 'expérience', whyNow: 'demande',
  unknowns: Array.from({ length: 2 }, () => ({ q: 'question', how: 'vérification' })),
  risks: Array.from({ length: 2 }, () => ({ text: 'risque', mitigation: 'mesure' })),
  bearCase: 'cas défavorable', nextQuestion: 'rétention', nextAction: 'entretien', nextOwner: 'Analyste', nextDue: '2026-10-01',
};

test('S2 progression et repères partagent le contrat de complétude dans les deux formats', () => {
  for (const mode of ['full', 'screen']) {
    for (const data of [{ date: '' }, { company: 'Partielle', amount: 'texte' }, completed]) {
      const m = memo(data);
      m.state.mode = mode;
      const view = m.renderVals();
      let done = 0, total = 0;
      m.order().forEach((id, index) => {
        const fields = m.requirements(id);
        assert.deepEqual(Array.from(m.req(id)), Array.from(fields, field => field.ok));
        const valid = fields.filter(field => field.ok).length;
        const status = valid === fields.length ? 'Renseigné' : valid ? 'En cours' : 'À renseigner';
        assert.equal(view.rail[index].status, status);
        assert.equal(view.rail[index].progress, `${status} · ${valid}/${fields.length}`);
        for (const field of fields) assert.equal(view.expected[field.key], 'Attendu');
        done += valid; total += fields.length;
      });
      assert.equal(view.score, Math.round(done / total * 100));
      assert.equal(view.expected.author, mode === 'full' ? 'Attendu' : '');
      assert.equal(view.expected.nextAction, mode === 'full' ? 'Attendu' : '');
      assert.equal(view.expected.version, '');
      assert.match(view.t.expectedHelp, /brouillon.*incomplet/i);
      if (data === completed) assert.equal(view.score, 100);
    }
  }
  const m = memo();
  m.renderVals().addFact();
  assert.equal(m.renderVals().facts[2].textExpected, 'Attendu');
  assert.equal(m.renderVals().facts[3].textExpected, '');
  m.state.d.facts = [];
  assert.equal(m.req('facts').length, 9, 'les lignes supprimées restent attendues');
  m.state.editingOverrides.ovMultiple = true;
  assert.equal(m.renderVals().calcRows[2].expected, 'Attendu');
  assert.equal(m.req('arith').length, 4);
  assert.match(template, /\{\{ b.progress \}\}/);
  assert.match(template, /\{\{ activeProgress \}\}/);
  assert.match(template, /\{\{ t.expectedHelp \}\}/);
  for (const binding of ['expected.reco', 'expected.author', 'expected.nextAction', 'f.textExpected', 'f.sourceExpected', 'f.dateExpected', 'u.questionExpected', 'u.verificationExpected', 'r.riskExpected', 'r.mitigationExpected', 'p.expected', 'f.expected', 'c.expected']) {
    assert.ok(template.includes(`{{ ${binding} }}`), binding);
  }
});

test('Parcours ouvre le sommaire horizontal et garde la relecture à la demande sans toucher la note', () => {
  const saved = { lang: 'en', mode: 'full', step: 4, leftOpen: false, rightOpen: true, d: { ...reference, company: 'Note conservée', facts: [{ text: 'Fait conservé', source: 'Source', date: '2026-09-23', status: 'verified' }] } };
  let written;
  const m = memo({}, { localStorage: { getItem: () => JSON.stringify(saved), setItem: (key, value) => { written = { key, value: JSON.parse(value) }; } } });
  assert.equal(m.state.leftOpen, true);
  assert.equal(m.state.rightOpen, false);
  assert.equal(m.state.step, saved.step);
  assert.equal(m.state.lang, saved.lang);
  m.save();
  assert.equal(written.key, 'vcmemo.onepager.v1');
  for (const [key, value] of Object.entries(saved.d)) assert.deepEqual(JSON.parse(JSON.stringify(written.value.d[key])), value);
  assert.match(template, /id="memo-platform-actions"/);
  assert.match(template, /\.memo-rail-body\s*\{[^}]*display:\s*flex/s);
  assert.match(template, /class="memo-completeness">\{\{ t.completeness \}\} : \{\{ score \}\} %/);
});

test('les commandes nomment le sommaire et la relecture sans leur attribuer le taux de complétude', () => {
  const m = memo();
  assert.equal(m.renderVals().leftToggleLabel, 'Masquer le sommaire');
  assert.equal(m.renderVals().rightToggleLabel, 'Afficher l’aide à la relecture');
  assert.equal(m.renderVals().stepTotal, '10');
  m.togglePane('left')();
  m.togglePane('right')();
  assert.equal(m.renderVals().leftToggleLabel, 'Afficher le sommaire');
  assert.equal(m.renderVals().rightToggleLabel, 'Masquer l’aide à la relecture');
  m.renderVals().setModeScreen();
  assert.equal(m.renderVals().stepTotal, '05');
  const reviewButton = template.match(/<button[^>]*data-pane-toggle="right"[\s\S]*?<\/button>/)[0];
  assert.match(reviewButton, /aria-label="\{\{ rightToggleLabel \}\}"/);
  assert.doesNotMatch(reviewButton, /score/);
  assert.match(template, /\{\{ t.summary \}\} · \{\{ stepNum \}\} \/ \{\{ stepTotal \}\}/);
});

test('le retour au grand écran après impression rétablit le bandeau horizontal', () => {
  let change;
  const m = memo({ company: 'Note conservée' }, {
    window: { matchMedia: () => ({ matches: false, addEventListener: (_event, listener) => { change = listener; } }) },
  });
  m.componentDidMount();
  change({ matches: true });
  assert.equal(m.state.leftOpen, false);
  assert.equal(m.state.rightOpen, false);
  change({ matches: false });
  assert.equal(m.state.leftOpen, true);
  assert.equal(m.state.rightOpen, false);
  assert.equal(m.state.d.company, 'Note conservée');
});

test('la hauteur réelle de l’en-tête détermine le décalage du bandeau', () => {
  const properties = {};
  const m = memo();
  m.rootRef.current = {
    querySelector: selector => selector === '.memo-header' ? { offsetHeight: 214 } : null,
    style: { setProperty: (name, value) => { properties[name] = value; } },
  };
  m.measure();
  assert.equal(properties['--memo-header-height'], '214px');
});

test('ouvrir la relecture y place le focus et Échap le restitue à sa commande', () => {
  const selectors = [];
  const m = memo();
  m.rootRef.current = { querySelector: selector => ({ focus: () => selectors.push(selector) }) };
  m.togglePane('right')();
  assert.equal(m.state.rightOpen, true);
  assert.equal(selectors.at(-1), '.memo-guidance-toggle');
  m.reviewKeyListener({ key: 'Escape' });
  assert.equal(m.state.rightOpen, false);
  assert.equal(selectors.at(-1), '[data-pane-toggle="right"]');
});

test('les commandes de retour du sommaire et de l’aide réservent le bandeau collant au focus', () => {
  // Browser regression: Escape from a long final section used to return focus
  // behind the standalone sticky header. Both controls share this toolbar.
  const desktop = template.slice(template.indexOf('@media screen and (min-width: 60.01rem)'));
  assert.match(desktop, /\.memo-main-toolbar > button\s*\{\s*scroll-margin-top:calc\(var\(--memo-header-height, 80px\) \+ 144px\)/);
});

test('rouvrir le sommaire révèle entièrement son étape active dans le rail horizontal', () => {
  const actions = [];
  const m = memo();
  m.state.leftOpen = false;
  m.state.step = m.order().length - 1;
  m.rootRef.current = { querySelector: selector => {
    assert.equal(selector, '.memo-rail-body button[aria-current="step"]');
    return { focus: () => actions.push('focus'), scrollIntoView: options => actions.push(options) };
  } };
  m.togglePane('left')();
  assert.equal(m.state.leftOpen, true);
  assert.deepEqual(JSON.parse(JSON.stringify(actions)), ['focus', { block: 'nearest', inline: 'nearest' }]);
});

test('le zoom de l’aperçu mobile conserve la mesure intrinsèque du dépassement A4', () => {
  const m = memo({}, { getComputedStyle: () => ({ paddingLeft: '12px', paddingRight: '12px' }) });
  m.pageRef.current = { style: {}, scrollHeight: 1123 };
  m.previewRef.current = { clientWidth: 390 };
  m.measure();
  assert.ok(Number(m.pageRef.current.style.zoom) < 1);
  assert.equal(m.state.overflow, false);
  m.pageRef.current.scrollHeight = 2200;
  m.measure();
  assert.equal(m.state.overflow, true);
  assert.match(template, /@media print\s*\{[\s\S]*zoom:1 !important/);
});

test('les trois artefacts sont reproductibles et utilisent exactement le modèle importable', async () => {
  const expected = await renderMemoArtifact();
  for (const output of memoOutputs) {
    assert.equal(readFileSync(new URL(`../${output}`, import.meta.url), 'utf8'), expected, output);
  }
  assert.equal(JSON.stringify(memo(reference).calc()), JSON.stringify(calculateMemo(reference)));
  assert.equal(memo().num('1 234,5'), parseMemoNumber('1 234,5'));
});

test('le cas de référence utilise la logique servie', () => {
  const c = memo(reference).calc();
  for (const [key, expected] of Object.entries({ ownEff: 8, residEff: 5.6, ret: 28, multEff: 14, fracEff: 0.28 })) {
    assert.ok(Math.abs(c[key] - expected) < 1e-12, `${key}: ${c[key]} ≠ ${expected}`);
  }
});

test('les nombres français sont lus intégralement, jamais par préfixe', () => {
  const m = memo();
  for (const invalid of ['', ' ', '20abc', '2,5,3', '1 2', '1.000,50', '1e3', 'Infinity', 'NaN', '0x20', '12\n345']) {
    assert.equal(m.num(invalid), null, JSON.stringify(invalid));
  }
  for (const valid of ['1 234,50', '1\u00a0234,50', '1\u202f234.50', '1234.5']) {
    assert.equal(m.num(valid), 1234.5, valid);
  }
  assert.equal(m.num('0'), 0);
});

test('chaque donnée manquante ne bloque que les résultats qui en dépendent', () => {
  const dependencies = {
    preMoney: ['post', 'ownEff', 'residEff', 'ret', 'multEff', 'fracEff'],
    amount: ['post', 'ownEff', 'residEff', 'ret', 'multEff', 'fracEff'],
    ticket: ['ownEff', 'residEff', 'ret', 'multEff', 'fracEff'],
    dilution: ['residEff', 'ret', 'multEff', 'fracEff'],
    exitValue: ['ret', 'multEff', 'fracEff'],
    fundSize: ['fracEff'],
  };
  const baseline = memo(reference).calc();
  for (const [field, blocked] of Object.entries(dependencies)) {
    for (const raw of ['', 'texte', '20abc']) {
      const c = memo({ ...reference, [field]: raw }).calc();
      for (const result of ['post', 'ownEff', 'residEff', 'ret', 'multEff', 'fracEff']) {
        assert.equal(c[result], blocked.includes(result) ? null : baseline[result], `${field}=${raw}: ${result}`);
      }
    }
  }
});

test('les bornes et les relations sont contrôlées sans interdire une sortie nulle', () => {
  for (const [field, value, result] of [
    ['preMoney', '-1', 'ownEff'], ['amount', '0', 'ownEff'], ['amount', '-5', 'ownEff'],
    ['ticket', '0', 'ownEff'], ['ticket', '-2', 'ownEff'], ['ticket', '6', 'ownEff'],
    ['dilution', '-1', 'residEff'], ['dilution', '101', 'residEff'],
    ['exitValue', '-500', 'ret'], ['fundSize', '0', 'fracEff'], ['fundSize', '-100', 'fracEff'],
  ]) {
    assert.equal(memo({ ...reference, [field]: value }).calc()[result], null, `${field}=${value}`);
  }
  for (const data of [{ exitValue: '0' }, { dilution: '100' }]) {
    const c = memo({ ...reference, ...data }).calc();
    for (const key of ['ret', 'multEff', 'fracEff']) assert.equal(c[key], 0, key);
  }
  assert.equal(memo({ ...reference, preMoney: '0', ticket: '5' }).calc().ownEff, 100);
});

test('un override invalide, incohérent ou sans hypothèses ne remplace pas le calcul', () => {
  for (const [key, result, correct] of [
    ['ovOwnership', 'ownEff', '8'], ['ovResidual', 'residEff', '5,6'],
    ['ovMultiple', 'multEff', '14'], ['ovFraction', 'fracEff', '0,28'],
  ]) {
    for (const value of ['texte', '-1', '101', '99']) {
      const c = memo({ ...reference, [key]: value }).calc();
      assert.equal(c[result], null, `${key}=${value}`);
      assert.ok(c.errors[key], key);
    }
    assert.equal(memo({ [key]: correct }).calc()[result], null, `sans hypothèses: ${key}`);
    assert.notEqual(memo({ ...reference, [key]: correct }).calc()[result], null, `cohérent: ${key}`);
  }
  const invalid = memo({ ...reference, ovOwnership: '9' }).calc();
  for (const key of ['residEff', 'ret', 'multEff', 'fracEff']) assert.equal(invalid[key], null, key);
});

test('les overrides se recalculent sans arrondi caché et restent éditables quand ils sont vides', () => {
  const m = memo({ ...reference, ticket: '1,234567' });
  const initial = m.calc();
  m.renderVals().calcRows[0].toggle();
  assert.equal(m.calc().ownEff, initial.ownEff);
  m.renderVals().calcRows[0].onOv({ target: { value: '' } });
  assert.equal(m.renderVals().calcRows[0].isOverridden, true);
  m.renderVals().calcRows[0].toggle();
  assert.equal(m.renderVals().calcRows[0].isOverridden, false);
  assert.equal(m.calc().ownEff, initial.ownEff);
});

test('le screening ignore les données cachées, conserve le mémo et offre six critères accessibles', () => {
  const visible = {
    company: 'Exemple pédagogique', date: '2026-09-05', round: 'Série A',
    preMoney: '20', amount: '5', ticket: '2', reco: 'diligence', recoWhy: 'À vérifier',
    thesisIf: 'condition', thesisThen: 'mécanisme', thesisOutcome: 'issue', falsifiedIf: 'réfutation',
    facts: Array.from({ length: 3 }, () => ({ text: 'fait', source: 'source', date: '2026-09-05', status: 'declared' })),
    nextQuestion: 'question bloquante',
  };
  const m = memo(visible);
  m.renderVals().setModeScreen();
  const first = m.renderVals();
  assert.equal(first.sixQuestions.filter(q => q.mark === '✓').length, 6);
  for (const q of first.sixQuestions) {
    q.go();
    assert.ok(m.order().includes(m.order()[m.state.step]));
  }
  Object.assign(m.state.d, { whyTeam: 'caché', whyNow: 'caché', bearCase: 'caché', exitValue: '500', fundSize: '100', ovOwnership: '99', ovMultiple: '99' });
  const saved = JSON.stringify(m.state.d);
  const second = m.renderVals();
  assert.equal(JSON.stringify(second.sixQuestions.map(q => [q.text, q.mark])), JSON.stringify(first.sixQuestions.map(q => [q.text, q.mark])));
  assert.equal(second.calc.ownership, first.calc.ownership);
  assert.equal(second.score, first.score);
  m.renderVals().setModeFull();
  assert.equal(JSON.stringify(m.state.d), saved);
  assert.equal(m.calc().ownEff, null, 'override incohérent retrouvé dans le mode complet');
  m.renderVals().setModeScreen();
  assert.equal(m.calc().ownEff, 8);
});

test('le screening remplace les collections persistées invalides sans interrompre le rendu', () => {
  for (const key of ['facts', 'beliefs', 'unknowns', 'risks']) {
    for (const invalid of [null, [null]]) {
      const storage = {
        getItem: () => JSON.stringify({ mode: 'screen', d: { [key]: invalid } }),
        setItem: () => {},
      };
      const instance = memo({}, { localStorage: storage });
      instance.renderVals();
      assert.equal(instance.state.mode, 'screen');
      assert.ok(Array.isArray(instance.state.d[key]));
      assert.ok(instance.state.d[key].every(row => row && typeof row === 'object'));
    }
  }
});

test('une étape persistée invalide revient à la première section', () => {
  for (const step of [-1, 1.5]) {
    const storage = {
      getItem: () => JSON.stringify({ step }),
      setItem: () => {},
    };
    const instance = memo({}, { localStorage: storage });
    assert.doesNotThrow(() => instance.renderVals());
    assert.equal(instance.state.step, 0);
  }
});

test('la mention locale ne confirme que la saisie effectivement enregistrée', () => {
  let unavailable = false;
  let saved = null;
  const storage = {
    getItem: () => saved,
    setItem: (_key, value) => {
      if (unavailable) throw new Error('quota');
      saved = value;
    },
  };
  const m = memo({}, { localStorage: storage });
  assert.doesNotMatch(m.T().localNote, /saisie enregistrée/i, 'aucune écriture au premier affichage');
  m.setD('company', 'Exemple pédagogique');
  assert.match(m.T().localNote, /saisie enregistrée dans ce navigateur/i);
  assert.match(memo({}, { localStorage: storage }).T().localNote, /saisie enregistrée dans ce navigateur/i);

  unavailable = true;
  m.setD('company', 'Modification non enregistrée');
  assert.match(m.T().localNote, /dernières modifications non enregistrées/i);
  assert.match(m.T().localNote, /copiez votre saisie/i);
  assert.match(m.T().confidentialityNote, /n’utilisez pas de données confidentielles/i);
  assert.equal(JSON.parse(saved).d.company, 'Exemple pédagogique');

  unavailable = false;
  m.save();
  assert.match(m.T().localNote, /saisie enregistrée dans ce navigateur/i);
  m.storageListener({ key: 'vcmemo.onepager.v1', newValue: null });
  assert.doesNotMatch(m.T().localNote, /saisie enregistrée/i);
});

test('un échec de sauvegarde est annoncé sans perdre la saisie en cours', () => {
  let writes = 0;
  const storage = {
    getItem: () => null,
    setItem: () => { writes += 1; throw new Error('quota'); },
    removeItem: () => { throw new Error('unavailable'); },
  };
  let reloads = 0;
  const instance = memo({}, {
    localStorage: storage,
    window: {
      confirm: () => true,
      location: { reload: () => { reloads += 1; } },
    },
  });

  instance.setD('company', 'ACME');
  assert.equal(writes, 1);
  assert.equal(instance.state.d.company, 'ACME');
  assert.equal(instance.state.storageError, true);
  assert.match(instance.renderVals().storageError, /dernières modifications non enregistrées/i);
  assert.match(template, /class="memo-storage-alert" role="alert"/);

  instance.renderVals().reset();
  assert.equal(reloads, 0, 'un effacement non persisté ne doit pas simuler une réussite');
  assert.equal(instance.state.storageError, true);
  assert.match(instance.renderVals().storageError, /suppression du brouillon local impossible/i);
  assert.match(instance.T().localNote, /dernières modifications non enregistrées/i);
});

test('S1 copie le brouillon en mémoire complet sans lire ni modifier le stockage en panne', async () => {
  let stored = null;
  let unavailable = false;
  let copied;
  const storage = {
    getItem: () => stored,
    setItem: (_key, value) => { if (unavailable) throw new Error('quota'); stored = value; },
  };
  const m = memo({}, { localStorage: storage, navigator: { clipboard: { writeText: async text => { copied = text; } } } });
  m.setD('company', 'Ancien état');
  const before = stored;
  unavailable = true;
  m.setD('company', 'MARQUEUR UNIQUEMENT EN MÉMOIRE');
  m.setD('amount', '20abc');
  m.setD('ovMultiple', '0,00 invalide');
  m.setRow('risks', 0, 'mitigation', 'Masquée par Screening');
  m.renderVals().setModeScreen();
  const expected = JSON.parse(JSON.stringify(m.state.d));
  storage.getItem = () => { assert.fail('la copie ne lit pas le stockage'); };
  assert.equal(typeof m.renderVals().copyDraft, 'function');
  await m.renderVals().copyDraft();
  assert.deepEqual(JSON.parse(copied).d, expected);
  assert.equal(JSON.parse(copied).mode, 'screen');
  assert.equal(stored, before);
  assert.equal(m.hasUnsavedDraft, true);
  assert.equal(m.state.storageStatus, 'write-error');
  assert.match(m.renderVals().copyNotice, /copié/i);
  assert.match(m.T().localNote, /non enregistrées/);
  unavailable = false;
  storage.getItem = () => stored;
  m.save();
  assert.deepEqual(JSON.parse(stored).d, expected);
  assert.equal(memo({}, { localStorage: storage }).state.d.company, expected.company);
  assert.equal(m.state.storageStatus, 'saved');
});

test('S1 offre un texte de secours sélectionné quand le presse-papiers est absent ou refusé', async () => {
  for (const globals of [{}, { navigator: {} }, { navigator: { clipboard: { writeText: async () => { throw new Error('denied'); } } } }]) {
    const m = memo({ company: '<script>texte brut</script>', amount: '20abc' }, globals);
    const actions = [];
    m.copyTextRef.current = { focus: () => actions.push('focus'), select: () => actions.push('select') };
    m.copyButtonRef.current = { focus: () => actions.push('return') };
    await m.renderVals().copyDraft();
    assert.equal(m.renderVals().copyFallback, true);
    assert.deepEqual(JSON.parse(m.renderVals().draftText).d, JSON.parse(JSON.stringify(m.state.d)));
    assert.deepEqual(actions, ['focus', 'select']);
    assert.doesNotMatch(m.renderVals().copyNotice, /brouillon copié/i);
    assert.equal(m.state.storageStatus, 'empty');
    m.renderVals().closeCopy();
    assert.equal(m.renderVals().copyFallback, false);
    assert.equal(actions.at(-1), 'return');
  }
  assert.match(template, /<textarea[^>]*id="memo-copy-text"[^>]*readonly[^>]*value="\{\{ draftText \}\}"/);
  assert.ok(/<label for="memo-copy-text"[^>]*>/.test(template));
});

test('S1 expose le statut et le secours dans l’en-tête, même en aperçu', () => {
  const header = template.match(/<header[\s\S]*?<\/header>/)[0];
  assert.ok(/role="status"[^>]*>\{\{ t.localNote \}\}/.test(header));
  assert.ok(header.includes('{{ t.confidentialityNote }}'));
  assert.ok(header.includes('sc-camel-on-click="{{ copyDraft }}"'));
  assert.ok(header.includes('ref="{{ copyButtonRef }}"'));
  const m = memo();
  m.renderVals().setViewPreview();
  assert.equal(typeof m.renderVals().copyDraft, 'function');
  assert.doesNotMatch(m.T().localNote, /saisie enregistrée/i);
  m.state.storageStatus = 'read-error'; m.state.storageError = true;
  assert.match(m.T().localNote, /lecture.*indisponible/i);
  m.state.storageStatus = 'remove-error';
  assert.match(m.T().localNote, /suppression.*impossible/i);
});

test('S1 ne confirme pas une copie périmée et empêche les demandes concurrentes', async () => {
  let resolve;
  let calls = 0;
  const m = memo({}, { navigator: { clipboard: { writeText: () => { calls++; return new Promise(done => { resolve = done; }); } } } });
  const pending = m.renderVals().copyDraft();
  assert.equal(m.renderVals().copyBusy, true);
  await m.renderVals().copyDraft();
  assert.equal(calls, 1);
  m.setD('company', 'Saisie pendant la copie');
  resolve(); await pending;
  assert.equal(m.renderVals().copyBusy, false);
  assert.doesNotMatch(m.renderVals().copyNotice, /brouillon copié/i);
  const current = m.renderVals().copyDraft();
  resolve(); await current;
  assert.match(m.renderVals().copyNotice, /brouillon copié/i);
  m.setD('company', 'Nouvelle saisie après copie');
  assert.doesNotMatch(m.renderVals().copyNotice, /brouillon copié/i);
});

test('une écriture d’une autre instance est intégrée avant la saisie suivante', () => {
  let stored = null;
  const listeners = new Map();
  const media = { matches: false, addEventListener: () => {}, removeEventListener: () => {} };
  const storage = {
    getItem: () => stored,
    setItem: (_key, value) => { stored = value; },
    removeItem: () => { stored = null; },
  };
  const browser = {
    matchMedia: () => media,
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: (type, listener) => {
      if (listeners.get(type) === listener) listeners.delete(type);
    },
  };
  const instance = memo({}, { localStorage: storage, window: browser });
  instance.componentDidMount();

  assert.equal(typeof listeners.get('storage'), 'function');
  listeners.get('storage')({
    key: 'vcmemo.onepager.v1',
    newValue: JSON.stringify({ d: { company: 'Alpha' } }),
  });
  assert.equal(instance.state.d.company, 'Alpha');

  instance.setD('author', 'Bob');
  assert.equal(JSON.parse(stored).d.company, 'Alpha');
  assert.equal(JSON.parse(stored).d.author, 'Bob');

  instance.componentWillUnmount();
  assert.equal(listeners.has('storage'), false);
});

test('un brouillon non sauvegardé résiste aux événements distants jusqu’à récupération', () => {
  let stored = null;
  let unavailable = false;
  const storage = {
    getItem: () => stored,
    setItem: (_key, value) => {
      if (unavailable) throw new Error('QuotaExceededError');
      stored = value;
    },
  };
  const instance = memo({}, { localStorage: storage });
  instance.setD('company', 'Ancienne note');
  const previous = stored;
  unavailable = true;
  instance.setD('company', 'Brouillon à préserver');

  for (const newValue of [previous, JSON.stringify({ d: { author: 'Action distante' } }), null]) {
    instance.storageListener({ key: 'vcmemo.onepager.v1', newValue });
    assert.equal(instance.state.d.company, 'Brouillon à préserver');
    assert.equal(instance.state.storageError, true);
    assert.equal(stored, previous);
  }

  unavailable = false;
  instance.setD('author', 'Reprise locale');
  assert.equal(JSON.parse(stored).d.company, 'Brouillon à préserver');
  assert.equal(JSON.parse(stored).d.author, 'Reprise locale');
  assert.equal(instance.state.storageError, false);

  instance.storageListener({
    key: 'vcmemo.onepager.v1',
    newValue: JSON.stringify({ d: { company: 'Après récupération' } }),
  });
  assert.equal(instance.state.d.company, 'Après récupération');
  instance.storageListener({ key: 'vcmemo.onepager.v1', newValue: null });
  assert.equal(instance.state.d.company, '');
});

test('une note remplacée dans le stockage reste intacte quand un autre onglet reprend son brouillon', async () => {
  let stored = null;
  let unavailable = false;
  let copied = '';
  const storage = {
    getItem: () => stored,
    setItem: (_key, raw) => { if (unavailable) throw Error('quota'); stored = raw; },
  };
  const b = memo({}, { localStorage: storage, navigator: { clipboard: { writeText: async raw => { copied = raw; } } } });
  b.setD('company', 'ANCIEN');
  unavailable = true;
  b.setD('company', 'BROUILLON_B');
  assert.equal(b.hasUnsavedDraft, true);

  const restoredV2 = JSON.stringify({ d: { company: 'SAUVEGARDE_V2' } });
  stored = restoredV2; // A restaure la clé memo depuis le payload d'une sauvegarde globale v2
  b.storageListener({ key: 'vcmemo.onepager.v1', newValue: restoredV2 });
  assert.equal(b.state.d.company, 'BROUILLON_B');

  unavailable = false;
  b.setD('author', 'ÉDITION_B_APRÈS_RESTAURATION');
  assert.equal(stored, restoredV2, 'la restauration de A doit rester le document actif');
  assert.equal(b.hasUnsavedDraft, true);
  assert.equal(b.state.storageStatus, 'conflict');
  assert.match(b.T().localNote, /conflit.*copiez votre brouillon/i);
  await b.copyDraft();
  assert.equal(JSON.parse(copied).d.company, 'BROUILLON_B');
  assert.equal(JSON.parse(copied).d.author, 'ÉDITION_B_APRÈS_RESTAURATION');
});

test('un effacement depuis le brouillon préserve la note remplacée, même avant réception de l’événement', () => {
  let stored = JSON.stringify({ d: { company: 'Version initiale' } });
  const storage = {
    getItem: () => stored,
    setItem: () => { throw Error('quota'); },
    removeItem: () => { stored = null; },
  };
  const instance = memo({}, { localStorage: storage });
  instance.setD('company', 'Brouillon en mémoire');
  const restored = JSON.stringify({ d: { company: 'Version importée' } });
  stored = restored;
  assert.equal(instance.clearSavedMemo(), false);
  assert.equal(stored, restored);
  assert.equal(instance.state.storageStatus, 'conflict');
  assert.equal(instance.state.d.company, 'Brouillon en mémoire');
});

test('une lecture indisponible sans brouillon local ne bloque pas la synchronisation', () => {
  const instance = memo({}, {
    localStorage: { getItem: () => { throw new Error('SecurityError'); }, setItem: () => {} },
  });
  assert.equal(instance.state.storageError, true);
  assert.match(instance.T().localNote, /lecture du brouillon local indisponible/i);
  instance.storageListener({
    key: 'vcmemo.onepager.v1',
    newValue: JSON.stringify({ d: { company: 'Note distante' } }),
  });
  assert.equal(instance.state.d.company, 'Note distante');
});

test('les anciennes largeurs persistées ne réintroduisent pas les poignées supprimées', () => {
  const storage = {
    getItem: () => JSON.stringify({ leftW: 5000, rightW: -1 }),
    setItem: () => {},
  };
  const m = memo({}, { localStorage: storage });
  assert.equal(m.renderVals().gridCols, '252px minmax(0,1fr) 0px');
  m.togglePane('right')();
  assert.equal(m.renderVals().gridCols, '252px minmax(0,1fr) 316px');
});

test('la complétude exclut nombres et overrides invalides sans évaluer le raisonnement', () => {
  const valid = memo(reference);
  const invalid = memo({ ...reference, amount: 'texte', dilution: '101' });
  assert.ok(invalid.req('deal').filter(Boolean).length < valid.req('deal').filter(Boolean).length);
  assert.ok(invalid.req('arith').filter(Boolean).length < valid.req('arith').filter(Boolean).length);
  assert.ok(memo({ ...reference, ovMultiple: '99' }).req('arith').includes(false));
  assert.match(valid.renderVals().scoreNote, /qualité du raisonnement/i);
});

test('les explications locales et la synthèse distinguent manque, invalidité et zéro', () => {
  const m = memo({ ...reference, amount: '' });
  let view = m.renderVals();
  assert.ok(view.numericHelp?.amount, 'explication locale de la levée manquante');
  assert.equal(view.numericHelp.amount.message, '');
  assert.equal(view.numericHelp.amount.invalid, false);
  assert.equal(view.calcRows[0].reason, '');
  assert.match(view.arithSentence, /indisponible/i);
  assert.doesNotMatch(view.arithSentence, /\[[^\]]*\]|NaN|Infinity/);
  Object.assign(m.state.d, reference, { ovOwnership: '99' });
  view = m.renderVals();
  assert.equal(view.calc.ownership, '—');
  assert.equal(view.calcRows[0].display, '—');
  assert.match(view.calcRows[0].reason, /incompatible/i);
  assert.doesNotMatch(view.arithSentence, /99|14[\s]*×/);
  Object.assign(m.state.d, { ovOwnership: '', exitValue: '0' });
  view = m.renderVals();
  assert.match(view.arithSentence, /0\s*M€/);
  assert.doesNotMatch(view.arithSentence, /indisponible/i);
});

test('S2 absence neutre et dépendances regroupées par section, sans changer les bornes du zéro', () => {
  for (const mode of ['full', 'screen']) {
    const m = memo();
    m.state.mode = mode;
    m.goToBlock(mode === 'full' ? 'arith' : 'deal');
    let view = m.renderVals();
    assert.equal(Object.values(view.numericHelp).some(field => field.invalid), false);
    assert.ok(view.calcRows.every(row => !row.invalid && row.reason === ''));
    assert.deepEqual(Array.from(view.missingDependencies, group => group.section), mode === 'full' ? ['deal', 'arith'] : ['deal']);
    const missing = Array.from(view.missingDependencies).flatMap(group => Array.from(group.keys));
    assert.equal(new Set(missing).size, mode === 'full' ? 6 : 3);
    for (const group of view.missingDependencies) {
      group.go();
      assert.equal(m.order()[m.state.step], group.section);
    }
    Object.assign(m.state.d, reference, { preMoney: '0', dilution: '0', exitValue: '0' });
    m.goToBlock(mode === 'full' ? 'arith' : 'deal');
    view = m.renderVals();
    assert.equal(view.missingDependencies.length, 0);
    for (const key of ['preMoney', 'dilution', 'exitValue']) assert.equal(view.numericHelp[key].invalid, false);
    for (const [key, raw] of [['amount', '0'], ['ticket', '0'], ['amount', '20abc']]) {
      Object.assign(m.state.d, reference, { [key]: raw });
      view = m.renderVals();
      assert.equal(view.numericHelp[key].invalid, true);
      assert.ok(view.numericHelp[key].message);
      assert.equal(view.missingDependencies.length, 0);
    }
    Object.assign(m.state.d, reference, { amount: '  ' });
    view = m.renderVals();
    assert.equal(view.numericHelp.amount.invalid, false);
    assert.deepEqual(Array.from(view.missingDependencies[0].keys), ['amount']);
    assert.match(view.missingDependencies[0].text, /Levée/);
    if (mode === 'full') {
      m.state.editingOverrides.ovOwnership = true;
      view = m.renderVals();
      assert.equal(view.calcRows[0].invalid, false, 'override vide neutre');
      assert.ok(view.missingDependencies.some(group => group.keys.includes('ovOwnership')));
    }
  }
  assert.match(template, /class="memo-dependencies"/);
  assert.match(template, /sc-camel-on-click="\{\{ group.go \}\}"/);
});

test('S2 les surcharges restaurées bloquantes restent éditables et comptées même composées d’espaces', () => {
  const keys = ['ovOwnership', 'ovResidual', 'ovMultiple', 'ovFraction'];
  for (const [index, key] of keys.entries()) {
    for (const raw of [' ', '\t', '\n', 0, false]) {
      const saved = JSON.stringify({ mode: 'full', step: 8, d: { ...reference, [key]: raw } });
      const m = memo({}, { localStorage: { getItem: () => saved, setItem: () => {} } });
      const view = m.renderVals();
      assert.equal(view.calcRows[index].isOverridden, true, `${key}=${JSON.stringify(raw)}`);
      assert.equal(view.calcRows[index].expected, 'Attendu');
      assert.equal(view.rail[8].progress, 'En cours · 3/4');
      if (typeof raw === 'string') {
        assert.equal(view.calcRows[index].invalid, false);
        assert.deepEqual(Array.from(view.missingDependencies[0].keys), [key]);
        if (key === 'ovOwnership') {
          m.goToBlock('deal');
          m.renderVals().missingDependencies[0].go();
          assert.equal(m.order()[m.state.step], 'arith');
        }
      } else assert.equal(view.calcRows[index].invalid, true);
      assert.equal(m.memoSnapshot().d[key], raw, 'la valeur brute reste inchangée');
      m.renderVals().setModeScreen();
      m.goToBlock('deal');
      assert.equal(m.renderVals().missingDependencies.length, 0);
      assert.equal(m.calc().ownEff, 8);
      m.renderVals().setModeFull();
      m.renderVals().calcRows[index].toggle();
      assert.equal(m.state.d[key], '');
      assert.equal(m.req('arith').length, 3);
      assert.equal(m.calc().ownEff, 8);
    }
  }
});

test('les montants, ratios et hypothèses de la synthèse concordent avec les résultats', () => {
  const view = memo(reference).renderVals();
  assert.match(view.arithSentence, /Taille du fonds : 100 M€/);
  for (const value of [/8(?:,0)?\s*%/, /5,6\s*%/, /28(?:,0)?\s*M€/, /14(?:,0)?\s*×/, /0,28\s*×/]) {
    assert.match(view.arithSentence, value);
  }
  assert.match(view.t.method, /tour primaire simple/i);
  assert.match(view.t.method, /fonds propres/i);
  assert.match(view.t.method, /cumulée/i);
  assert.match(view.t.method, /bruts/i);
  assert.equal(view.pv.sections.find(s => s.label === 'Arithmétique').body, view.arithSentence);
  const small = memo({ ...reference, preMoney: '0,02', amount: '0,005', ticket: '0,002' }).renderVals();
  assert.match(small.pv.sections.find(s => s.label === 'Opération').body, /ticket 0,002 M€/);
});

test('le formulaire se recompose en une colonne avec des fonctions latérales repliables', () => {
  assert.match(template, /class="memo-app"/);
  assert.match(template, /@media \(max-width: 60rem\)/);
  assert.match(template, /\.memo-workspace\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(template, /class="memo-rail-body"/);
  assert.match(template, /class="memo-guidance-body"/);
  assert.match(template, /data-open="\{\{ leftOpen \}\}"/);
  assert.match(template, /data-open="\{\{ rightOpen \}\}"/);
  assert.match(template, /\.memo-field-grid-3\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(template, /\.memo-step-actions\s*\{[^}]*flex-wrap:\s*wrap/s);
});

test('un rail replié retire ses commandes du parcours clavier à toute largeur', () => {
  assert.match(template, /<nav[^>]*class="memo-rail"[^>]*>\s*<sc-if value="\{\{ leftOpen \}\}"[^>]*>\s*<button/);
  assert.match(template, /<aside[^>]*class="memo-guidance"[^>]*>\s*<sc-if value="\{\{ rightOpen \}\}"[^>]*>\s*<button/);
});

test('refermer un rail replace le focus sur sa commande persistante', () => {
  assert.match(template, /data-pane-toggle="left"/);
  assert.match(template, /data-pane-toggle="right"/);
  const m = memo();
  let selector = '';
  let focused = false;
  let focusOptions;
  m.rootRef.current = {
    querySelector: value => {
      selector = value;
      return { focus: options => { focused = true; focusOptions = options; } };
    }
  };

  m.renderVals().toggleLeft();
  assert.equal(m.state.leftOpen, false);
  assert.equal(selector, '[data-pane-toggle="left"]');
  assert.equal(focused, true);
  assert.notEqual(focusOptions?.preventScroll, true, 'la commande doit revenir dans le viewport du document mobile');
});

test('l’en-tête 390 px garde les deux sélecteurs sur une même rangée', () => {
  const narrow = template.match(/@media \(max-width: 36rem\) \{([\s\S]*?)\n {2}\}/)?.[1] || '';
  assert.doesNotMatch(narrow, /\.memo-mode-switch[^\n]*grid-column/);
  assert.match(template, /@media \(max-width: 22rem\)[\s\S]*\.memo-mode-switch, \.memo-view-switch/);
});

test('le chrome expose ses états et rend le changement de section perceptible au clavier', () => {
  assert.match(template, /<html lang="fr">/);
  assert.match(template, /<title>Simulateur de note d’investissement<\/title>/);
  assert.doesNotMatch(template, /sc-camel-on-mouse-down|memo-resize-handle/);
  assert.match(template, /aria-pressed="\{\{ modeFullSelected \}\}"/);
  assert.match(template, /aria-pressed="\{\{ viewFormSelected \}\}"/);
  assert.match(template, /aria-expanded="\{\{ leftOpen \}\}"[^>]*aria-controls="memo-block-list"/);
  assert.match(template, /aria-expanded="\{\{ rightOpen \}\}"[^>]*aria-controls="memo-guidance-content"/);
  assert.match(template, /aria-current="\{\{ b.current \}\}"/);
  assert.match(template, /ref="\{\{ headingRef \}\}" tabindex="-1"/);
  assert.match(template, /\.memo-app[^\n{]*:focus-visible/);

  const documentStub = { documentElement: { lang: '' }, title: '' };
  const m = memo({}, { document: documentStub });
  assert.equal(typeof m.syncDocumentMetadata, 'function');
  m.syncDocumentMetadata();
  assert.equal(documentStub.documentElement.lang, 'fr');
  assert.equal(documentStub.title, 'Simulateur de note d’investissement');
  m.state.lang = 'en';
  m.syncDocumentMetadata();
  assert.equal(documentStub.documentElement.lang, 'en');
  assert.equal(documentStub.title, 'Investment memo simulator');

  let focused = false;
  const main = { scrollTop: 48 };
  m.rootRef.current = { querySelector: () => main };
  let focusOptions;
  m.headingRef.current = { focus: options => { focused = true; focusOptions = options; } };
  m.go(1);
  assert.equal(main.scrollTop, 0);
  assert.equal(focused, true);
  assert.notEqual(focusOptions?.preventScroll, true, 'le titre doit revenir dans le viewport après une section longue');
});

test('les transitions entre saisie et aperçu replacent le focus dans la vue affichée', () => {
  assert.match(template, /class="memo-preview"[^>]*ref="\{\{ previewRef \}\}"/);
  const m = memo();
  assert.ok(m.previewRef);
  let previewFocused = false;
  let previewScrolled = false;
  let headingFocused = false;
  let previewFocusOptions;
  let headingFocusOptions;
  m.previewRef.current = {
    focus: options => { previewFocused = true; previewFocusOptions = options; },
    scrollIntoView: options => { previewScrolled = options?.block === 'start'; }
  };
  m.headingRef.current = { focus: options => { headingFocused = true; headingFocusOptions = options; } };
  const view = m.renderVals();

  view.setViewPreview();
  assert.equal(m.state.view, 'preview');
  assert.equal(previewFocused, true);
  assert.equal(previewScrolled, true);
  assert.notEqual(previewFocusOptions?.preventScroll, true);

  view.setViewForm();
  assert.equal(m.state.view, 'form');
  assert.equal(headingFocused, true);
  assert.notEqual(headingFocusOptions?.preventScroll, true);
});

test('chaque ligne répétable conserve des libellés visibles et expose ses états', () => {
  for (const binding of [
    'f.textLabel', 'f.sourceLabel', 'f.dateLabel',
    'b.textLabel', 'b.becauseLabel',
    'u.questionLabel', 'u.verificationLabel',
    'r.riskLabel', 'r.mitigationLabel'
  ]) {
    assert.match(template, new RegExp(`class="memo-row-label"[^>]*>\\{\\{ ${binding.replace('.', '\\.')} \\}\\}<`));
  }
  assert.match(template, /role="group" aria-label="\{\{ f.statusLabel \}\}"/);
  assert.match(template, /aria-pressed="\{\{ f.verifiedSelected \}\}"/);
  assert.match(template, /role="group" aria-label="\{\{ b.convictionLabel \}\}"/);
  assert.match(template, /aria-pressed="\{\{ lv.selected \}\}"/);
  assert.match(template, /aria-pressed="\{\{ c.isOverridden \}\}"/);
  assert.match(template, /aria-label="\{\{ f.removeLabel \}\}"/);
  assert.match(template, /aria-label="\{\{ b.removeLabel \}\}"/);
  assert.match(template, /aria-label="\{\{ u.removeLabel \}\}"/);
  assert.match(template, /aria-label="\{\{ r.removeLabel \}\}"/);

  const vals = memo().renderVals();
  assert.equal(vals.facts[0].textLabel, 'Fait 1');
  assert.equal(vals.facts[0].declaredSelected, true);
  assert.equal(vals.facts[0].verifiedSelected, false);
  assert.equal(vals.beliefs[0].becauseLabel, 'Raison 1');
  assert.equal(vals.beliefs[0].levels.find(level => level.selected).label, 'moyenne');
  assert.equal(vals.unknowns[0].verificationLabel, 'Action de vérification 1');
  assert.equal(vals.risks[0].mitigationLabel, 'Atténuation 1');
});

test('S1 protège chaque saisie des quatre listes et ne sauvegarde rien après annulation', () => {
  const cases = {
    facts: { text: 'fait', source: 'source seule', date: '2026-09-24', status: 'verified' },
    beliefs: { text: 'jugement', because: 'raison seule', conv: 'high' },
    unknowns: { q: 'question', how: 'vérification seule' },
    risks: { text: 'risque', mitigation: 'atténuation seule' },
  };
  for (const [list, fields] of Object.entries(cases)) {
    for (const [field, value] of Object.entries(fields)) {
      let accepted = false;
      let confirmations = 0;
      let writes = 0;
      let focused = '';
      const m = memo({}, {
        window: { confirm: message => { assert.match(message, /supprimer/i); confirmations++; return accepted; } },
        localStorage: { getItem: () => null, setItem: () => { writes++; } },
      });
      m.state.d[list][0][field] = value;
      const before = JSON.stringify(m.state.d);
      m.rootRef.current = { querySelector: selector => ({ focus: () => { focused = selector; } }) };
      const trigger = { focus: () => { focused = 'remove'; } };
      m.renderVals()[list][0].remove({ currentTarget: trigger });
      assert.equal(confirmations, 1, `${list}.${field}`);
      assert.equal(JSON.stringify(m.state.d), before);
      assert.equal(writes, 0);
      assert.equal(focused, 'remove');
      accepted = true;
      m.renderVals()[list][0].remove({ currentTarget: trigger });
      assert.equal(confirmations, 2);
      assert.equal(writes, 1);
      assert.notEqual(JSON.stringify(m.state.d), before);
      assert.ok(m.state.d[list].length >= 1);
      assert.equal(focused, `[data-add-list="${list}"]`);
    }
    const empty = memo({}, { window: { confirm: () => { assert.fail('ligne vide'); } } });
    empty.renderVals()[list][0].remove();
    assert.ok(empty.state.d[list].length >= 1);
  }
});

test('la suppression d’une ligne replace le focus sur son action d’ajout', () => {
  for (const list of ['facts', 'beliefs', 'unknowns', 'risks']) {
    assert.match(template, new RegExp(`data-add-list="${list}"`));
  }

  const m = memo();
  let selector = '';
  let focused = false;
  m.rootRef.current = {
    querySelector: value => {
      selector = value;
      return { focus: () => { focused = true; } };
    }
  };
  m.renderVals().facts.at(-1).remove({ currentTarget: {} });
  assert.equal(selector, '[data-add-list="facts"]');
  assert.equal(focused, true);
});

test('les actions de suppression conservent une cible tactile suffisante', () => {
  assert.equal((template.match(/class="memo-remove"/g) || []).length, 4);
  assert.match(template, /\.memo-remove\s*\{[^}]*min-width:\s*24px/s);
  assert.match(template, /@media \(max-width: 60rem\)[\s\S]*\.memo-remove\s*\{[^}]*min-width:\s*40px/s);
});

test('l’aperçu A4 scrollable est nommé et directement utilisable au clavier', () => {
  assert.match(template, /class="memo-preview"[^>]*role="region" aria-label="\{\{ t\.viewPreview \}\}" tabindex="0"/);
  assert.match(template, /:where\([^)]*\.memo-preview[^)]*\):focus-visible/);
});

test('les tons secondaires suivent les tokens du site et le papier garde son contraste', () => {
  const legacyLightText = template.match(/color:#(?:8A8375|A9A294|B4AD9D)/g) || [];
  assert.equal(legacyLightText.length, 0, 'aucun ancien texte pâle ne reste figé dans l’interface');
  assert.doesNotMatch(logic, /#(?:8A8375|A9A294|B4AD9D|A0731A)/);
  assert.match(template, /--memo-muted:\s*var\(--on-surface-variant\)/);
  assert.match(template, /\.memo-preview \[data-page\]\s*\{[^}]*--memo-muted:#695F50/s);
  assert.match(logic, /var\(--memo-muted\)/);
  assert.match(logic, /var\(--memo-warning\)/);
});

test('la navigation de bord expose les commandes indisponibles sans texte illisible', () => {
  assert.match(template, /aria-disabled="\{\{ prevDisabled \}\}"/);
  assert.match(template, /aria-disabled="\{\{ nextDisabled \}\}"/);
  assert.doesNotMatch(logic, /color:' \+ \(on \? '#16150F' : '#CFC8B8'\)/);

  const m = memo();
  let vals = m.renderVals();
  assert.equal(vals.prevDisabled, true);
  assert.equal(vals.nextDisabled, false);
  m.state.step = m.order().length - 1;
  vals = m.renderVals();
  assert.equal(vals.prevDisabled, false);
  assert.equal(vals.nextDisabled, false);
});

test('S2 Relire la note ouvre et focalise l’aperçu de tout brouillon sans lancer l’impression', () => {
  for (const mode of ['full', 'screen']) {
    for (const data of [{}, { company: 'Partielle', amount: 'texte' }, completed]) {
      const actions = [];
      const m = memo(data, { window: { print: () => actions.push('print') }, setTimeout: callback => callback() });
      m.state.mode = mode;
      m.state.step = m.order().length - 1;
      m.previewRef.current = { focus: () => actions.push('preview'), scrollIntoView: () => actions.push('scroll') };
      m.headingRef.current = { focus: () => actions.push('heading') };
      const before = JSON.stringify(m.memoSnapshot());
      let view = m.renderVals();
      assert.equal(view.nextLabel, 'Relire la note');
      assert.equal(view.nextDisabled, false);
      assert.equal(view.t.review, 'Aide à la relecture');
      view.goNext();
      assert.equal(m.state.view, 'preview');
      assert.deepEqual(actions, ['preview', 'scroll']);
      assert.equal(JSON.stringify(m.memoSnapshot()), before);
      view = m.renderVals();
      assert.equal(view.t.exportPdf, 'Imprimer / enregistrer en PDF');
      assert.match(view.t.printHelp, /dialogue.*navigateur/i);
      view.setViewForm();
      assert.equal(actions.at(-1), 'heading');
      view.doExport();
      assert.equal(m.state.view, 'preview');
      assert.deepEqual(actions.slice(-3), ['preview', 'scroll', 'print']);
    }
  }
  assert.match(template, /\{\{ t.printHelp \}\}/);
  assert.match(template, /\.memo-preview\s*\{\s*scroll-margin-top:calc\(var\(--memo-header-height, 80px\) \+ 16px\)/);
});

test('S2 les aides résiduelles correspondent au bloc et au format, sans jugement de qualité implicite', () => {
  const m = memo();
  for (const id of ['deal', 'activity']) {
    m.goToBlock(id);
    assert.equal(m.renderVals().activeShare, '');
  }
  m.props.showPageShares = false;
  m.goToBlock('thesis');
  assert.equal(m.renderVals().activeShare, '');
  assert.doesNotMatch(m.T().railFoot, /en dit long/);
  assert.doesNotMatch(m.T().bearNote, /diligence n’est pas terminée/);
  assert.doesNotMatch(m.blockMeta().thesis.hint, /ce n’est qu’un avis/);
  m.renderVals().setModeScreen();
  m.goToBlock('next');
  assert.match(m.renderVals().activeHint, /question/);
  assert.doesNotMatch(m.renderVals().activeHint, /responsable|échéance/);
  assert.doesNotMatch(m.T().mustSettleNote, /responsable|échéance/);
  assert.doesNotMatch(template, /t\.activityCount/);
});

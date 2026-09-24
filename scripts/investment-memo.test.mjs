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
  assert.match(instance.renderVals().storageError, /enregistrement local indisponible/i);
  assert.match(template, /class="memo-storage-alert" role="alert"/);

  instance.renderVals().reset();
  assert.equal(reloads, 0, 'un effacement non persisté ne doit pas simuler une réussite');
  assert.equal(instance.state.storageError, true);
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

test('une lecture indisponible sans brouillon local ne bloque pas la synchronisation', () => {
  const instance = memo({}, {
    localStorage: { getItem: () => { throw new Error('SecurityError'); }, setItem: () => {} },
  });
  assert.equal(instance.state.storageError, true);
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
  const view = memo({}, { localStorage: storage }).renderVals();
  assert.equal(view.gridCols, '252px minmax(0,1fr) 316px');
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
  assert.match(view.numericHelp.amount.message, /renseigner/i);
  assert.equal(view.numericHelp.amount.invalid, true);
  assert.match(view.calcRows[0].reason, /levée/i);
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

test('les tons secondaires reproduits sur fond clair franchissent le seuil AA', () => {
  const legacyLightText = template.match(/color:#(?:8A8375|A9A294|B4AD9D)/g) || [];
  assert.equal(legacyLightText.length, 2, 'seuls les deux textes sur fond sombre peuvent conserver #8A8375');
  assert.doesNotMatch(logic, /#(?:8A8375|A9A294|B4AD9D|A0731A)/);
  assert.match(template, /color:#695F50/);
  assert.match(logic, /#695F50/);
  assert.match(logic, /#7A550F/);
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
  assert.equal(vals.nextDisabled, true);
});

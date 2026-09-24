/* global document, localStorage, Storage, innerWidth */
/** Isolated browser recipe. Start Vite on 127.0.0.1:5178, then run this file.
 * Uses a fresh browser context and synthetic data only. No build or generated writes.
 */
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer';

const origin = process.env.LOCAL_DATA_TEST_ORIGIN ?? 'http://127.0.0.1:5178';
assert.match(origin, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/);
const artifacts = await mkdtemp(join(tmpdir(), 'vc-local-data-browser-'));
const browser = await puppeteer.launch({ headless: true, ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}) });
const context = await browser.createBrowserContext();
const page = await context.newPage();
const downloads = join(artifacts, 'downloads');
await mkdir(downloads);
const cdp = await page.createCDPSession();
await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.setViewport({ width: 1280, height: 900 });
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
const env = (value, storageVersion = 1) => JSON.stringify({ storageVersion, value });
const notes = (prefix, size = 30) => Array.from({ length: 100 }, (_, id) => ({ id: `${prefix}-${id}`, kind: 'note', body: 'x'.repeat(size), createdAt: '2026-09-10T00:00:00Z' }));
const workspace = (answer) => env({ schemaVersion: 2, diagnostics: { test: { answers: { q1: answer }, updatedAt: '2026-09-10T00:00:00Z' } }, productions: {}, activities: {} }, 2);
const moduleUrl = '/src/lib/localDataLifecycle.ts';
async function click(text) {
  await page.waitForFunction(text => [...document.querySelectorAll('button')].some(button => button.textContent.trim() === text && !button.disabled), {}, text);
  await page.evaluate(text => [...document.querySelectorAll('button')].find(button => button.textContent.trim() === text && !button.disabled).click(), text);
}
async function see(text) { await page.waitForFunction(text => document.body.textContent.includes(text), {}, text); }
async function waitForDownload(name, expected) {
  for (let attempt = 0; attempt < 40; attempt++) {
    try { assert.equal(await readFile(join(downloads, name), 'utf8'), expected); return; } catch { await new Promise(resolve => setTimeout(resolve, 50)); }
  }
  assert.fail(`Download not verified: ${name}`);
}
async function snapshot() { return page.evaluate(() => Object.fromEntries(Object.entries(localStorage))); }
async function seed(values) {
  await page.evaluate(async values => {
    localStorage.clear();
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value);
    await (await import('/src/lib/localDataRecovery.ts')).localDataRecovery.clear();
  }, values);
  await page.reload({ waitUntil: 'networkidle0' });
  await see('Données locales');
}
async function inputFile(payload, name = 'test-import.json') {
  const backup = await page.evaluate(async moduleUrl => {
    const api = await import(moduleUrl);
    const exported = api.createLocalDataExport();
    for (const key of Object.keys(exported.payload)) exported.payload[key] = null;
    exported.archives = {};
    delete exported.domains;
    return exported;
  }, moduleUrl);
  Object.assign(backup.payload, payload);
  const text = JSON.stringify(backup);
  const path = join(artifacts, name);
  await writeFile(path, text);
  const fileInput = await page.$('input[type=file]');
  await fileInput.uploadFile(path);
  return text;
}
const checks = [];
try {
  await page.goto(`${origin}/profile`, { waitUntil: 'networkidle0' });
  const initial = { 'vcpx:theme': env('light'), 'vcpx:notes': env(notes('old')), 'vcpx:learning-workspace': workspace('old'), 'vcmemo.onepager.v1': JSON.stringify({ d: { company: 'Test ancien' } }), 'vcpx:archive:notes:v0': '{archive de test}', 'foreign:test': 'preserved', 'vcpx:archive:foreign:v0': 'also preserved' };
  await seed(initial);
  await page.evaluate(async () => { (await import('/src/lib/learningWorkspace.ts')).learningWorkspace.getSnapshot(); });
  const importedMemo = JSON.stringify({ mode: 'full', lang: 'fr', d: { company: 'Test importé' } });
  const source = await inputFile({ theme: env('dark'), notes: env(notes('new')), 'learning-workspace': workspace('new'), 'vcmemo.onepager.v1': importedMemo });
  await see('100 suppressions');
  await see('Sauvegarder avant de continuer');
  await click('Remplacer les données de cet appareil');
  await see('Import appliqué');
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), true);
  assert.equal(await page.evaluate(async () => (await import('/src/lib/learningWorkspace.ts')).learningWorkspace.getSnapshot().diagnostics.test.answers.q1), 'new');
  let stored = await snapshot();
  assert.equal(stored['vcpx:notes'], env(notes('new')));
  assert.equal(stored['vcmemo.onepager.v1'], importedMemo);
  assert.equal(stored['vcpx:archive:notes:v0'], undefined);
  assert.equal(stored['foreign:test'], 'preserved');
  await page.reload({ waitUntil: 'networkidle0' });
  await see('Thème sombre');
  assert.deepEqual(await snapshot(), stored);
  checks.push('Import : 100 notes, thème, workspace, note d’investissement, archives, clés étrangères et rechargement.');

  await click('Tout effacer');
  await see('Suppressions prévues');
  await click('Confirmer la suppression…');
  await page.waitForSelector('[role=dialog]');
  assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Annuler');
  await page.keyboard.press('Escape');
  assert.deepEqual(await snapshot(), stored);
  await click('Confirmer la suppression…');
  await page.waitForSelector('[role=dialog]');
  await page.evaluate(() => [...document.querySelectorAll('[role=dialog] button')].find(button => button.textContent === 'Tout effacer').click());
  await see('Données locales supprimées');
  await see('Thème clair');
  assert.deepEqual(await page.evaluate(async () => (await import('/src/lib/learningWorkspace.ts')).learningWorkspace.getSnapshot().diagnostics), {});
  await page.reload({ waitUntil: 'networkidle0' });
  assert.deepEqual(await snapshot(), { 'foreign:test': 'preserved', 'vcpx:archive:foreign:v0': 'also preserved' });
  checks.push('Purge : aperçu, focus Annuler, Échap, suppression, thème, workspace et rechargement.');

  await seed({ 'vcpx:notes': '{donnée illisible}', 'vcpx:theme': env('light', 99), 'vcpx:archive:notes:v0': 'brut' });
  await click('Exporter');
  await see('Ce fichier contient une copie brute');
  const exported = await page.evaluate(async moduleUrl => (await import(moduleUrl)).createLocalDataExport(), moduleUrl);
  assert.equal(exported.payload.notes, '{donnée illisible}');
  assert.equal(exported.payload.theme, env('light', 99));
  assert.equal(exported.archives['vcpx:archive:notes:v0'], 'brut');
  const incompatibleText = await inputFile({ theme: env('dark', 99), notes: env(notes('valid')) });
  await see('Import refusé');
  await see('Télécharger les domaines valides pour récupération');
  await see('Télécharger le fichier original');
  await click('Télécharger le fichier original');
  await waitForDownload('test-import.json', incompatibleText);
  checks.push('Export brut et import incompatible : refus avant modification, récupération des domaines valides et original disponible.');

  // Real browser quota, measured with synthetic foreign filler, including key lengths.
  for (const scenario of ['fits', 'overflow']) {
    await seed({ 'vcpx:theme': env('light'), 'vcpx:notes': env(notes('old', 18_000)) });
    const fillerLength = await page.evaluate(() => {
      let low = 0, high = 8_000_000;
      while (low < high) {
        const mid = Math.ceil((low + high) / 2);
        try { localStorage.setItem('foreign:quota-test', 'q'.repeat(mid)); low = mid; } catch { high = mid - 1; }
      }
      localStorage.setItem('foreign:quota-test', 'q'.repeat(low));
      return low;
    });
    const before = await snapshot();
    await inputFile({ theme: env('dark'), notes: env(notes('new', scenario === 'fits' ? 17_900 : 19_000)) }, `quota-${scenario}.json`);
    await click('Remplacer les données de cet appareil');
    if (scenario === 'fits') {
      await see('Import appliqué');
      assert.equal((await snapshot())['vcpx:notes'], env(notes('new', 17_900)));
    } else {
      await see('L’état précédent a été restauré et vérifié');
      assert.deepEqual(await snapshot(), before);
    }
    const after = await snapshot();
    await page.reload({ waitUntil: 'networkidle0' });
    assert.deepEqual(await snapshot(), after);
    checks.push(`Quota réel ${scenario} : 100 notes de 18 000 caractères initialement, ${fillerLength} caractères de remplissage étranger ; résultat et rechargement vérifiés.`);
  }

  await seed(initial);
  await inputFile({ theme: env('dark'), notes: env(notes('bad')) }, 'rollback-failed.json');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'vcpx:notes' || (key === 'vcpx:theme' && JSON.parse(value).value === 'light')) throw new DOMException('Test failure', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  await click('Remplacer les données de cet appareil');
  await see('Restauration non confirmée');
  await see('Télécharger la copie de récupération');
  assert.equal(await page.evaluate(async () => JSON.parse(await (await import('/src/lib/localDataRecovery.ts')).localDataRecovery.read()).payload.notes), initial['vcpx:notes']);
  await page.reload({ waitUntil: 'networkidle0' });
  await see('Télécharger la copie de récupération');
  const recovery = await page.evaluate(async () => (await import('/src/lib/localDataRecovery.ts')).localDataRecovery.read());
  assert.equal(JSON.parse(recovery).payload.notes, initial['vcpx:notes']);
  assert.equal(JSON.parse(recovery).payload.theme, initial['vcpx:theme']);
  await click('Télécharger la copie de récupération');
  await waitForDownload(`vc-platform-recuperation-${new Date().toISOString().slice(0, 10)}.json`, recovery);
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: join(artifacts, 'recovery-mobile.png'), fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  checks.push('Panne persistante : domaines affectés, copie IndexedDB exacte et récupération encore accessible après rechargement ; largeur mobile 390 px.');
  assert.equal(source, JSON.stringify(JSON.parse(source)));
  const reservation = await page.evaluate(async () => {
    const { localDataRecovery } = await import('/src/lib/localDataRecovery.ts');
    await localDataRecovery.clear();
    const results = await Promise.allSettled([localDataRecovery.save('copy-a'), localDataRecovery.save('copy-b')]);
    const pending = await localDataRecovery.read();
    await localDataRecovery.clear();
    return { statuses: results.map(result => result.status).sort(), pending, cleared: await localDataRecovery.read() };
  });
  assert.deepEqual(reservation.statuses, ['fulfilled', 'rejected']);
  assert.ok(['copy-a', 'copy-b'].includes(reservation.pending));
  assert.equal(reservation.cleared, null);
  checks.push('Téléchargements original/récupération vérifiés octet pour octet ; réservation IndexedDB concurrente et suppression vérifiée.');
  assert.deepEqual(errors, []);
  await writeFile(join(artifacts, 'report.json'), JSON.stringify({ browser: await browser.version(), origin, checks, errors }, null, 2));
  console.log(JSON.stringify({ ok: true, artifacts, browser: await browser.version(), checks }, null, 2));
} catch (error) {
  await page.screenshot({ path: join(artifacts, 'failure.png'), fullPage: true }).catch(() => {});
  await writeFile(join(artifacts, 'failure.txt'), await page.evaluate(() => document.body.innerText));
  console.error({ artifacts, checks });
  throw error;
} finally { await context.close(); await browser.close(); }

import { localDataRecovery } from './localDataRecovery';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createLocalDataExport, importLocalDataExport, previewLocalDataImport, purgeLocalData, PRODUCT_STORAGE_KEYS } from './localDataLifecycle';
import { learningWorkspace } from './learningWorkspace';

const env = (value: unknown, storageVersion = 1) => JSON.stringify({ storageVersion, value });
const note = { id: 'test-note', kind: 'note', body: 'Donnée de test', createdAt: '2026-09-10T00:00:00Z' };
function setup(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const local: Storage = {
    get length() { return values.size; },
    key: vi.fn(i => [...values.keys()][i] ?? null),
    getItem: vi.fn(k => values.get(k) ?? null),
    setItem: vi.fn((k, v) => { values.set(k, v); }),
    removeItem: vi.fn(k => { values.delete(k); }),
    clear: vi.fn(() => values.clear()),
  };
  vi.stubGlobal('localStorage', local);
  return { local, values };
}
function file(payload: Record<string, string | null> = {}) {
  return JSON.stringify({ formatVersion: 1, origin: 'vc-platform', exportedAt: '2026-09-10T00:00:00Z', payload: { ...Object.fromEntries(PRODUCT_STORAGE_KEYS.map(k => [k, null])), ...payload } });
}
afterEach(() => { vi.unstubAllGlobals(); learningWorkspace.reload(); });

describe('intégrité locale, constats audit S6', () => {
  it('S6-03 conserve exactement une donnée illisible dans la sauvegarde', () => {
    setup({ 'vcpx:notes': '{illisible', 'vcpx:profile': env(null, 99) });
    const exported = createLocalDataExport();
    expect(exported.payload.notes).toBe('{illisible');
    expect(exported.payload.profile).toBe(env(null, 99));
  });
  it('S6-06 accepte une ancienne version migrable sans écrire pendant la préparation', () => {
    const { local } = setup();
    expect(previewLocalDataImport(file({ notes: JSON.stringify([note]) }))).toMatchObject({ ok: true });
    expect(local.setItem).not.toHaveBeenCalled();
    expect(local.removeItem).not.toHaveBeenCalled();
  });
  it('S6-04 et S6-21 purgent les archives connues, les héritages et la note, conservent les clés étrangères', async () => {
    const { values } = setup({ 'vcpx:archive:notes:v0': 'original', 'vcmemo.onepager.v1': '{}', onboardingMode: 'bref', 'vcpx:highlights': 'ancien', 'vcpx:archive:foreign:v0': 'étranger', 'vcpx:foreign': 'étranger' });
    expect(await purgeLocalData()).toMatchObject({ ok: true });
    expect(Object.fromEntries(values)).toEqual({ 'vcpx:archive:foreign:v0': 'étranger', 'vcpx:foreign': 'étranger' });
  });
  it('S6-11 retourne un échec préparatoire de purge sans aucune mutation', async () => {
    const { local, values } = setup({ 'vcpx:notes': env([note]) });
    vi.mocked(local.getItem).mockImplementation(() => { throw Error('lecture indisponible'); });
    const result = await purgeLocalData();
    expect(result).toMatchObject({ ok: false, operation: 'read' });
    expect(values.size).toBe(1);
    expect(local.removeItem).not.toHaveBeenCalled();
  });
  it('S6-01 identifie une restauration incomplète et conserve la copie brute', async () => {
    const before = env('dark');
    const { local, values } = setup({ 'vcpx:theme': before, 'vcpx:notes': env([note]) });
    vi.mocked(local.setItem).mockImplementation((k, v) => {
      if (k === 'vcpx:notes' || (k === 'vcpx:theme' && v === before)) throw Error('panne persistante');
      values.set(k, v);
    });
    const result = await importLocalDataExport(file({ theme: env('light'), notes: env([{ ...note, id: 'next' }]) }));
    expect(result).toMatchObject({ ok: false, restoration: 'failed', affectedKeys: expect.arrayContaining(['theme']), recoveryText: expect.stringContaining(before.replaceAll('"', '\\"')) });
  });
  it('S6-01 détecte aussi une écriture silencieusement ignorée', async () => {
    const { local } = setup();
    vi.mocked(local.setItem).mockImplementation(() => {});
    expect(await importLocalDataExport(file({ notes: env([note]) }))).toMatchObject({ ok: false });
  });
});

vi.mock('./localDataRecovery', () => ({ localDataRecovery: { save: vi.fn(), clear: vi.fn(), read: vi.fn() } }));
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(localDataRecovery.read).mockResolvedValue(null);
  vi.mocked(localDataRecovery.save).mockResolvedValue(undefined);
  vi.mocked(localDataRecovery.clear).mockResolvedValue(undefined);
});

describe('non-régressions import, export et purge', () => {
  it('conserve la copie avant la première mutation, même si sa persistance échoue', async () => {
    const { local, values } = setup({ 'vcpx:notes': env([note]) });
    vi.mocked(localDataRecovery.save).mockImplementationOnce(async text => {
      expect(JSON.parse(text).payload.notes).toBe(env([note]));
      expect(local.removeItem).not.toHaveBeenCalled();
      throw new DOMException('quota recovery', 'QuotaExceededError');
    });
    expect(await importLocalDataExport(file())).toMatchObject({ ok: false, phase: 'preparation', restoration: 'untouched', reason: 'quota' });
    expect(local.setItem).not.toHaveBeenCalled();
    expect(local.removeItem).not.toHaveBeenCalled();
    expect(values.get('vcpx:notes')).toBe(env([note]));
  });
  it('signale une lecture impossible sans exporter null à sa place', () => {
    const { local } = setup({ 'vcpx:notes': env([note]) });
    vi.mocked(local.getItem).mockImplementation(key => { if (key === 'vcpx:notes') throw Error('denied'); return null; });
    const exported = createLocalDataExport();
    expect(exported.complete).toBe(false);
    expect(exported.readErrors).toContain('notes');
    expect(Object.hasOwn(exported.payload, 'notes')).toBe(false);
    expect(exported.domains).toContainEqual(expect.objectContaining({ key: 'notes', status: 'unavailable', itemCount: null }));
  });
  it('signale une erreur d’inventaire des archives et interdit la purge', async () => {
    const { local } = setup({ outside: 'keep' });
    vi.mocked(local.key).mockImplementation(() => { throw Error('enumeration blocked'); });
    expect(createLocalDataExport()).toMatchObject({ complete: false, readErrors: ['archives'] });
    expect(await purgeLocalData()).toMatchObject({ ok: false, phase: 'preparation' });
    expect(local.removeItem).not.toHaveBeenCalled();
  });
  it.each([99, -1, 0, 1.5])('refuse une version inconnue %s sans aucune écriture', async version => {
    const { local } = setup();
    const input = file({ notes: env([note], version) });
    expect(previewLocalDataImport(input)).toMatchObject({ ok: false, reason: 'version' });
    expect(await importLocalDataExport(input)).toMatchObject({ ok: false, phase: 'preparation', reason: 'version' });
    expect(local.setItem).not.toHaveBeenCalled();
    expect(local.removeItem).not.toHaveBeenCalled();
  });
  it('propose les domaines valides d’un fichier incompatible sans produire un remplacement partiel', () => {
    setup();
    const input = file({ notes: env([note]), theme: env('dark', 99) });
    const preview = previewLocalDataImport(input);
    expect(preview.ok).toBe(false);
    if (preview.ok) return;
    const recovered = JSON.parse(preview.validRecoveryText!);
    expect(recovered.payload.notes).toBe(env([note]));
    expect(Object.hasOwn(recovered.payload, 'theme')).toBe(false);
    expect(previewLocalDataImport(preview.validRecoveryText!)).toMatchObject({ ok: false });
    expect(JSON.parse(input).payload.theme).toBe(env('dark', 99));
  });
  it('prépare la migration workspace v1 et conserve les diagnostics, productions et le fichier original', async () => {
    const { local, values } = setup();
    const old = env({ schemaVersion: 1, diagnostics: { d1: { answers: { q1: 'yes' }, updatedAt: '2026-09-10T00:00:00Z' } }, productions: { p1: { stage: 'reviewed', note: 'test', updatedAt: '2026-09-10T00:00:00Z' } } });
    const input = file({ 'learning-workspace': old });
    const preview = previewLocalDataImport(input);
    expect(preview).toMatchObject({ ok: true, domains: expect.arrayContaining([expect.objectContaining({ key: 'learning-workspace', status: 'migrated', itemCount: 2 })]) });
    expect(local.setItem).not.toHaveBeenCalled();
    expect(await importLocalDataExport(input)).toEqual({ ok: true });
    expect(JSON.parse(values.get('vcpx:learning-workspace')!)).toMatchObject({ storageVersion: 2, value: { schemaVersion: 2, activities: {}, diagnostics: { d1: { answers: { q1: 'yes' } } }, productions: { p1: { note: 'test' } } } });
    expect(JSON.parse(input).payload['learning-workspace']).toBe(old);
  });
  it('préserve la note et les archives absentes des sauvegardes v1 historiques', async () => {
    const { values } = setup({ 'vcmemo.onepager.v1': '{legacy-memo}', 'vcpx:archive:notes:v0': 'raw' });
    const input = JSON.parse(file());
    delete input.payload['vcmemo.onepager.v1'];
    expect(previewLocalDataImport(JSON.stringify(input))).toMatchObject({ ok: true, warnings: [expect.stringContaining('v1')] });
    expect(await importLocalDataExport(JSON.stringify(input))).toEqual({ ok: true });
    expect(values.get('vcmemo.onepager.v1')).toBe('{legacy-memo}');
    expect(values.get('vcpx:archive:notes:v0')).toBe('raw');
  });
  it('exporte et importe la note v1 et toutes les archives connues sans altérer leur format', async () => {
    const memo = JSON.stringify({ mode: 'full', lang: 'fr', d: { company: 'Test', facts: [{ text: 'test', source: '', date: '', status: 'declared' }] } });
    const { values } = setup({ 'vcmemo.onepager.v1': memo, 'vcpx:archive:notes:v0': '{raw', 'vcpx:archive:learning-workspace:v1': '{old}', 'vcpx:highlights': '{legacy}', onboardingMode: 'bref', 'vcpx:foreign': 'keep', 'vcpx:archive:foreign:v0': 'keep too' });
    const exported = createLocalDataExport();
    expect(exported.payload['vcmemo.onepager.v1']).toBe(memo);
    expect(exported.archives).toMatchObject({ 'vcpx:archive:notes:v0': '{raw', onboardingMode: 'bref' });
    expect(Object.values(exported.archives!)).not.toContain('keep too');
    expect(await purgeLocalData()).toEqual({ ok: true });
    expect(await importLocalDataExport(JSON.stringify(exported))).toEqual({ ok: true });
    expect(values.get('vcmemo.onepager.v1')).toBe(memo);
    expect(values.get('vcpx:archive:notes:v0')).toBe('{raw');
    expect(values.get('vcpx:onboarding-mode')).toBe(env('bref'));
    expect(values.get('vcpx:foreign')).toBe('keep');
    expect(values.get('vcpx:archive:foreign:v0')).toBe('keep too');
  });
  it('refuse une note incompatible et les archives étrangères avant modification', async () => {
    const { local } = setup();
    const exported = createLocalDataExport();
    exported.payload['vcmemo.onepager.v1'] = JSON.stringify({ storageVersion: 99, d: {} });
    expect(await importLocalDataExport(JSON.stringify(exported))).toMatchObject({ ok: false, reason: 'version' });
    exported.payload['vcmemo.onepager.v1'] = null;
    exported.archives = { 'vcpx:archive:foreign:v0': 'bad' };
    expect(await importLocalDataExport(JSON.stringify(exported))).toMatchObject({ ok: false, reason: 'validation' });
    expect(local.removeItem).not.toHaveBeenCalled();
  });
  it('refuse un aperçu périmé et une modification durant la préparation de la copie', async () => {
    const { values, local } = setup();
    const input = file({ notes: env([note]) });
    const preview = previewLocalDataImport(input);
    if (!preview.ok) throw Error('test preparation failed');
    values.set('vcpx:notes', 'concurrent');
    expect(await importLocalDataExport(input, preview.expected)).toMatchObject({ ok: false, restoration: 'untouched' });
    expect(local.removeItem).not.toHaveBeenCalled();
    values.delete('vcpx:notes');
    vi.mocked(localDataRecovery.save).mockImplementationOnce(async () => { values.set('vcpx:notes', 'concurrent'); });
    expect(await importLocalDataExport(input)).toMatchObject({ ok: false, restoration: 'untouched' });
    expect(values.get('vcpx:notes')).toBe('concurrent');
  });
  it('vérifie chaque domaine de restauration malgré plusieurs erreurs', async () => {
    const initial = { 'vcpx:theme': env('dark'), 'vcpx:notes': env([note]), 'vcpx:profile': env({ profileType: 'analyste' }), 'vcpx:bookmarks': env([]) };
    const { values, local } = setup(initial);
    vi.mocked(local.setItem).mockImplementation((key, value) => {
      if (key === 'vcpx:notes' || key === 'vcpx:theme') throw Error('blocked');
      values.set(key, value);
    });
    const result = await importLocalDataExport(file({ theme: env('light'), notes: env([]) }));
    expect(result).toMatchObject({ restoration: 'failed', affectedKeys: ['theme', 'notes'] });
    expect(values.get('vcpx:profile')).toBe(initial['vcpx:profile']);
    expect(values.get('vcpx:bookmarks')).toBe(initial['vcpx:bookmarks']);
    expect(localDataRecovery.clear).not.toHaveBeenCalled();
  });
  it('restaure après un défaut d’actualisation et garde la copie si les états restent non vérifiables', async () => {
    const { values } = setup({ 'vcpx:notes': env([note]) });
    expect(await importLocalDataExport(file(), undefined, () => { throw Error('subscriber'); })).toMatchObject({ ok: false, restoration: 'failed', affectedKeys: ['états affichés'] });
    expect(values.get('vcpx:notes')).toBe(env([note]));
  });
  it('purge : restaure et vérifie une suppression partielle', async () => {
    const initial = { 'vcpx:theme': env('dark'), 'vcpx:notes': env([note]) };
    const { values, local } = setup(initial);
    vi.mocked(local.removeItem).mockImplementation(key => { if (key === 'vcpx:notes') throw Error('blocked'); values.delete(key); });
    expect(await purgeLocalData()).toMatchObject({ ok: false, restoration: 'verified' });
    expect(Object.fromEntries(values)).toEqual(initial);
  });
  it('compare les identifiants, compte les ajouts, remplacements et suppressions avec les activités workspace', () => {
    setup({ 'vcpx:notes': env([note, { ...note, id: 'removed' }]) });
    const preview = previewLocalDataImport(file({ notes: env([{ ...note, body: 'modified' }, { ...note, id: 'added' }]) }));
    expect(preview).toMatchObject({ ok: true, domains: expect.arrayContaining([expect.objectContaining({ key: 'notes', currentCount: 2, itemCount: 2, added: 1, replaced: 1, removed: 1 })]) });
  });
  it.each(['fits', 'overflow', 'mid-flight'] as const)('quota calculé sur 100 notes et toutes les clés : %s', async scenario => {
    const oldNotes = env(Array.from({ length: 100 }, (_, id) => ({ ...note, id: `old-${id}`, body: 'é'.repeat(18_000) })));
    const nextNotes = env(Array.from({ length: 100 }, (_, id) => ({ ...note, id: `next-${id}`, body: 'x'.repeat(19_000) })));
    const initial = { 'vcpx:notes': oldNotes, 'vcpx:profile': env({ profileType: 'analyste' }), 'foreign:test': 'x'.repeat(80_000) };
    const { values, local } = setup(initial);
    const size = (map: Map<string, string>) => [...map].reduce((total, [key, value]) => total + 2 * (key.length + value.length), 0);
    const targetSize = size(new Map([['vcpx:notes', nextNotes], ['vcpx:theme', env('light')], ['vcpx:profile', env({ profileType: 'founder' })], ['foreign:test', initial['foreign:test']]]));
    const capacity = scenario === 'overflow' ? size(values) : targetSize;
    let once = scenario === 'mid-flight';
    vi.mocked(local.setItem).mockImplementation((key, value) => {
      if (key === 'vcpx:notes' && once && value === nextNotes) { once = false; throw Error('mid-flight'); }
      const candidate = new Map(values).set(key, value);
      if (size(candidate) > capacity) throw new DOMException('full', 'QuotaExceededError');
      values.set(key, value);
    });
    const result = await importLocalDataExport(file({ notes: nextNotes, profile: env({ profileType: 'founder' }), theme: env('light') }));
    if (scenario === 'fits') {
      expect(result).toEqual({ ok: true });
      expect(values.get('vcpx:notes')).toBe(nextNotes);
    } else {
      expect(result).toMatchObject({ ok: false, restoration: 'verified' });
      expect(Object.fromEntries(values)).toEqual(initial);
    }
    expect(values.get('foreign:test')).toBe(initial['foreign:test']);
  });
});

it('préserve une copie de récupération déjà présente au lieu de la remplacer', async () => {
  setup({ 'vcpx:notes': env([note]) });
  vi.mocked(localDataRecovery.save).mockRejectedValueOnce(Error('pending copy'));
  vi.mocked(localDataRecovery.read).mockResolvedValueOnce('older recovery copy');
  expect(await importLocalDataExport(file())).toMatchObject({ ok: false, phase: 'preparation', restoration: 'untouched', recoveryText: 'older recovery copy' });
});

it('restaure aussi après un échec de nettoyage de la copie de récupération', async () => {
  const { values } = setup({ 'vcpx:notes': env([note]) });
  vi.mocked(localDataRecovery.clear).mockRejectedValueOnce(Error('recovery removal blocked'));
  expect(await importLocalDataExport(file())).toMatchObject({ ok: false, phase: 'recovery', restoration: 'verified' });
  expect(values.get('vcpx:notes')).toBe(env([note]));
});

it('compte les réponses du cahier selon son contrat plat, et les activités du workspace', () => {
  setup();
  const preview = previewLocalDataImport(file({
    'ikigai-cahier-answers': env({ 'decouverte-1': 'Réponse 1', 'avance-2': 'Réponse 2', 'avance-3': '  ' }),
    'learning-workspace': env({ schemaVersion: 2, diagnostics: {}, productions: {}, activities: { 'path:simulator:sim': { parcoursId: 'path', kind: 'simulator', id: 'sim', completed: true, completedAt: '2026-09-10T00:00:00Z', updatedAt: '2026-09-10T00:00:00Z' } } }, 2),
  }));
  expect(preview).toMatchObject({ ok: true, domains: expect.arrayContaining([
    expect.objectContaining({ key: 'ikigai-cahier-answers', itemCount: 2 }),
    expect.objectContaining({ key: 'learning-workspace', itemCount: 1 }),
  ]) });
});

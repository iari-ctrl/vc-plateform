// @vitest-environment jsdom
import '@/test/setupDom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderAppAt } from '@/test/renderApp';
import { createLocalDataExport, serializeLocalDataExport } from '@/lib/localDataLifecycle';
import { learningWorkspace } from '@/lib/learningWorkspace';
import { localDataRecovery } from '@/lib/localDataRecovery';

vi.mock('@/lib/localDataRecovery', () => ({ localDataRecovery: { save: vi.fn(), clear: vi.fn(), read: vi.fn() } }));
const env = (value: unknown, storageVersion = 1) => JSON.stringify({ storageVersion, value });
const note = { id: 'test-only', kind: 'note', body: 'Note de test isolée', createdAt: '2026-09-10T00:00:00Z' };
beforeEach(() => {
  localStorage.clear();
  learningWorkspace.reload();
  vi.mocked(localDataRecovery.save).mockResolvedValue(undefined);
  vi.mocked(localDataRecovery.clear).mockResolvedValue(undefined);
  vi.mocked(localDataRecovery.read).mockResolvedValue(null);
});
async function choose(text: string) {
  const input = await waitFor(() => {
    const element = document.querySelector('input[type="file"]');
    expect(element).not.toBeNull();
    return element as HTMLInputElement;
  });
  fireEvent.change(input, { target: { files: [{ name: 'test.json', size: text.length, text: async () => text }] } });
}
describe('gestion locale, interactions S6', () => {
  it('S6-02 actualise le thème et le workspace avant de confirmer un remplacement', async () => {
    localStorage.setItem('vcpx:theme', env('dark'));
    const incoming = serializeLocalDataExport(createLocalDataExport());
    localStorage.clear();
    localStorage.setItem('vcpx:theme', env('light'));
    learningWorkspace.saveDiagnosticAnswer('test-diagnostic', 'q1', 'yes');
    renderAppAt('/profile');
    await screen.findByText('Thème clair');
    await choose(incoming);
    fireEvent.click(await screen.findByRole('button', { name: 'Remplacer les données de cet appareil' }));
    await screen.findByText(/Import appliqué/);
    expect(screen.getByText('Thème sombre')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
    expect(learningWorkspace.getSnapshot().diagnostics).toEqual({});
  });
  it('S6-05 montre les suppressions prévues et propose une sauvegarde avant remplacement', async () => {
    const incoming = serializeLocalDataExport(createLocalDataExport());
    localStorage.setItem('vcpx:notes', env([note]));
    renderAppAt('/profile');
    await choose(incoming);
    await screen.findByRole('button', { name: 'Remplacer les données de cet appareil' });
    expect(screen.getByText(/1 suppressions/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sauvegarder avant de continuer' })).toBeInTheDocument();
  });
  it('S6-03 annonce une donnée brute avant de proposer son téléchargement', async () => {
    localStorage.setItem('vcpx:notes', '{illisible');
    renderAppAt('/profile');
    fireEvent.click(await screen.findByRole('button', { name: 'Exporter' }));
    await screen.findByText(/Ce fichier contient une copie brute/);
  });
});

it('capture une erreur de lecture du fichier sans proposer le remplacement', async () => {
  renderAppAt('/profile');
  await screen.findByRole('button', { name: 'Exporter' });
  fireEvent.change(document.querySelector('input[type=file]')!, { target: { files: [{ name: 'unreadable.json', size: 1, text: async () => { throw Error('read failure'); } }] } });
  await screen.findByText(/Le fichier ne peut pas être lu/);
  expect(screen.queryByRole('button', { name: 'Remplacer les données de cet appareil' })).not.toBeInTheDocument();
});
it('capture une erreur préparatoire de purge et propose la récupération sans supprimer', async () => {
  localStorage.setItem('vcpx:notes', env([note]));
  renderAppAt('/profile');
  await screen.findByRole('button', { name: 'Tout effacer' });
  await waitFor(() => expect(screen.getByRole('button', { name: 'Tout effacer' })).not.toBeDisabled());
  const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('read blocked'); });
  fireEvent.click(screen.getByRole('button', { name: 'Tout effacer' }));
  await screen.findByText(/La lecture préparatoire a échoué/);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  spy.mockRestore();
  expect(localStorage.getItem('vcpx:notes')).toBe(env([note]));
});
it('actualise aussi le thème, les notes et le workspace après une purge', async () => {
  localStorage.setItem('vcpx:theme', env('dark'));
  localStorage.setItem('vcpx:notes', env([note]));
  learningWorkspace.saveDiagnosticAnswer('test', 'q1', 'yes');
  renderAppAt('/profile');
  await screen.findByText('Thème sombre');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Tout effacer' })).not.toBeDisabled());
  fireEvent.click(screen.getByRole('button', { name: 'Tout effacer' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Confirmer la suppression…' }));
  await screen.findByRole('dialog');
  expect(screen.getByRole('button', { name: 'Annuler' })).toHaveFocus();
  const dialog = screen.getByRole('dialog');
  fireEvent.click([...dialog.querySelectorAll('button')].find(button => button.textContent === 'Tout effacer')!);
  await screen.findByText(/Données locales supprimées et états affichés actualisés/);
  expect(screen.getByText('Thème clair')).toBeInTheDocument();
  expect(document.documentElement).not.toHaveClass('dark');
  expect(learningWorkspace.getSnapshot().diagnostics).toEqual({});
  expect(localStorage.getItem('vcpx:notes')).toBeNull();
});

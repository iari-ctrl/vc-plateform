import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Download, Trash2, Upload } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { localDataChanges } from '@/lib/localDataChanges';
import { localDataRecovery } from '@/lib/localDataRecovery';
import {
  createLocalDataExport, importLocalDataExport, previewLocalDataImport, purgeLocalData,
  readLocalDataSnapshot, serializeLocalDataExport, verifyLocalDataSnapshot, LOCAL_DATA_EXPORT_MAX_BYTES,
  type LocalDataDomainPreview, type LocalDataExport, type LocalDataPayload, type LocalDataPreviewResult, type LocalDataResult,
} from '@/lib/localDataLifecycle';

function download(data: string | Blob, filename: string) {
  const url = URL.createObjectURL(typeof data === 'string' ? new Blob([data], { type: 'application/json' }) : data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const REASONS: Record<string, string> = { unreadable: 'JSON illisible', validation: 'format incompatible', version: 'version inconnue', limit: 'limite de taille dépassée', unavailable: 'lecture impossible' };
const exportName = (prefix: string) => `${prefix}-${new Date().toISOString().slice(0, 10)}.json`;
function DomainReport({ domains, comparison = false }: { domains: LocalDataDomainPreview[]; comparison?: boolean }) {
  return <ul className="mt-3 space-y-2 text-sm">
    {domains.map(domain => <li key={domain.key} className="rounded-xl bg-surface-container px-3 py-2">
      <span className="font-medium">{domain.label}</span> : {domain.itemCount === null ? 'quantité indéterminée' : `${domain.itemCount} ${domain.unit}`}
      {comparison && <span className="block text-surface-variant">Présent : {domain.currentCount ?? 'indéterminé'} · Après : {domain.itemCount ?? 'indéterminé'}.
        {domain.unchanged ? ' Conservé sans modification.' : domain.added !== undefined ? ` ${domain.added} ajouts, ${domain.replaced} remplacements, ${domain.removed} suppressions.` : ' Contenu présent illisible : son remplacement ou sa suppression sera complet.'}
      </span>}
      {domain.status === 'migrated' && <span className="block">Ancienne version migrable.</span>}
      {domain.status === 'raw' && <span className="block">Copie brute{domain.reason ? ` (${REASONS[domain.reason] ?? domain.reason}) : restauration automatique indisponible.` : ' de l’archive.'}</span>}
      {domain.status === 'unavailable' && <span className="block text-error">Lecture impossible : domaine absent du téléchargement.</span>}
    </li>)}
  </ul>;
}
export function LocalDataPanel() {
  const [backup, setBackup] = useState<LocalDataExport | null>(null);
  const [source, setSource] = useState<{ text: string; name: string; file: File } | null>(null);
  const [preview, setPreview] = useState<LocalDataPreviewResult | null>(null);
  const [purge, setPurge] = useState<{ snapshot: LocalDataPayload; domains: LocalDataDomainPreview[] } | null>(null);
  const [purgeOpen, setPurgeOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recovery, setRecovery] = useState<string | null>(null);
  const [recoveryChecked, setRecoveryChecked] = useState(false);
  const [removeRecoveryOpen, setRemoveRecoveryOpen] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);
  const selection = useRef(0);

  useEffect(() => {
    let mounted = true;
    localDataRecovery.read().then(text => {
      if (mounted) { setRecovery(text); setRecoveryChecked(true); }
    }).catch(() => {
      if (mounted) setNotice({ error: true, text: 'La copie de récupération ne peut pas être vérifiée. Import et purge sont indisponibles ; vous pouvez exporter les données lisibles puis recharger cette page.' });
    });
    return () => { mounted = false; selection.current += 1; };
  }, []);

  const exportCurrent = () => {
    setBackup(createLocalDataExport());
  };
  const safeDownload = (text: string | Blob, name: string) => {
    try { download(text, name); } catch {
      setNotice({ error: true, text: 'Le téléchargement n’a pas pu démarrer. Réessayez le téléchargement.' });
    }
  };
  const chooseFile = async (file?: File) => {
    const request = ++selection.current;
    setPreview(null); setSource(null); setPurge(null); setNotice(null);
    if (!file) return;
    if (file.size > LOCAL_DATA_EXPORT_MAX_BYTES) {
      setNotice({ error: true, text: 'Le fichier dépasse 64 Mo. Aucune donnée n’a été modifiée.' }); return;
    }
    try {
      const text = await file.text();
      if (request !== selection.current) return;
      setSource({ text, name: file.name, file });
      setPreview(previewLocalDataImport(text));
    } catch {
      if (request === selection.current) setNotice({ error: true, text: 'Le fichier ne peut pas être lu. Aucune donnée n’a été modifiée. Choisissez à nouveau le fichier.' });
    }
  };
  const refreshVisibleState = (snapshot: LocalDataPayload) => {
    flushSync(() => localDataChanges.publish(snapshot));
  };
  const finish = async (result: LocalDataResult, action: 'import' | 'purge') => {
    if (result.ok) {
      setSource(null); setPreview(null); setPurge(null); setBackup(null);
      setNotice({ error: false, text: action === 'import'
        ? 'Import appliqué. Les données enregistrées ont été vérifiées et les états affichés actualisés.'
        : 'Données locales supprimées et états affichés actualisés. Les clés étrangères au produit sont conservées.' });
    } else {
      setNotice({ error: true, text: result.restoration === 'verified'
        ? 'Opération interrompue. L’état précédent a été restauré et vérifié.'
        : result.restoration === 'untouched'
          ? 'Opération non appliquée. Aucune donnée active n’a été modifiée. Vérifiez la copie de récupération et préparez à nouveau l’opération.'
          : `Opération interrompue. Restauration non confirmée pour : ${result.affectedKeys.join(', ')}. Téléchargez la copie de récupération.` });
      if (result.recoveryText) setRecovery(result.recoveryText);
      setPreview(null); setPurge(null);
    }
  };
  const applyImport = async () => {
    if (!source || !preview?.ok || busy) return;
    setBusy(true); setNotice(null);
    try { await finish(await importLocalDataExport(source.text, preview.expected, refreshVisibleState), 'import'); }
    catch { setNotice({ error: true, text: 'Import interrompu. Son résultat ne peut pas être confirmé. Rechargez la page pour retrouver la copie de récupération.' }); }
    finally { setBusy(false); }
  };
  const preparePurge = () => {
    setPreview(null); setPurge(null); setNotice(null);
    try {
      const snapshot = readLocalDataSnapshot();
      const report = createLocalDataExport();
      if (!report.complete || verifyLocalDataSnapshot(snapshot).length) throw Error('Read failed');
      setPurge({ snapshot, domains: report.domains ?? [] });
    } catch {
      setNotice({ error: true, text: 'La lecture préparatoire a échoué. Aucune donnée n’a été supprimée. Exportez les domaines lisibles pour récupération ou réessayez.' });
    }
  };
  const applyPurge = async () => {
    if (!purge || busy) return;
    setBusy(true); setNotice(null);
    try { await finish(await purgeLocalData(purge.snapshot, refreshVisibleState), 'purge'); }
    catch { setNotice({ error: true, text: 'Suppression interrompue. Son résultat ne peut pas être confirmé. Rechargez la page pour retrouver la copie de récupération.' }); }
    finally { setBusy(false); }
  };
  const blocked = busy || !recoveryChecked || recovery !== null;
  return <div className="premium-card p-7" aria-busy={busy}>
    <p className="eyebrow mb-4">Données locales</p>
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 text-sm leading-relaxed text-surface-variant">
      <p className="font-medium text-foreground">Stockage sur cet appareil</p>
      <p className="mt-1">Profil, carnet, favoris, progression, journal, cahier, travail de formation, évaluations, préférences, note d’investissement et archives de migration sont enregistrés dans ce navigateur. Ces données ne sont pas chiffrées par la plateforme. N’y placez aucun secret ni information confidentielle.</p>
      <p className="mt-2">L’import remplace les données de cet appareil. Une copie de récupération est conservée avant l’opération, puis supprimée après vérification. Les autres données du navigateur sont préservées.</p>
    </div>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={exportCurrent} disabled={busy} className="btn-ghost !py-2.5"><Download size={15} /> Exporter</button>
      <label className="btn-quiet cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-4">
        <Upload size={15} /> Choisir un import
        <input type="file" accept="application/json,.json" className="sr-only" disabled={blocked} onChange={event => {
          const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; void chooseFile(file);
        }} />
      </label>
      <button type="button" onClick={preparePurge} disabled={blocked} className="btn-ghost !py-2.5"><Trash2 size={15} /> Tout effacer</button>
    </div>
    {backup && <div className="mt-4">
      <p role="status">{backup.complete ? 'Inventaire de sauvegarde terminé. Toutes les valeurs lues sont conservées, y compris les copies brutes.' : 'Sauvegarde incomplète : certains domaines n’ont pas pu être lus.'}</p>
      {backup.readErrors?.length ? <p role="alert">Domaines non lus : {backup.readErrors.join(', ')}.</p> : null}
      <details className="mt-2"><summary>Bilan par domaine</summary><DomainReport domains={backup.domains ?? []} /></details>
      {backup.domains?.some(d => d.reason && d.status === 'raw') && <p className="mt-2">Ce fichier contient une copie brute de données incompatibles. Leur restauration automatique est indisponible ; conservez le fichier pour récupération.</p>}
      <button type="button" className="btn-ghost mt-3" onClick={() => safeDownload(serializeLocalDataExport(backup), exportName('vc-platform-sauvegarde'))}>
        {backup.complete ? 'Télécharger la sauvegarde' : 'Télécharger la récupération partielle'}
      </button>
    </div>}
    {preview && <div className="mt-4">
      {!preview.ok ? <>
        <p role="alert">Import refusé : {preview.message}</p>
        {preview.domains && <DomainReport domains={preview.domains} />}
        {preview.validRecoveryText && <button type="button" className="btn-ghost mt-3" onClick={() => safeDownload(preview.validRecoveryText!, exportName('vc-platform-domaines-valides'))}>Télécharger les domaines valides pour récupération</button>}
      </> : <>
        <h3 className="font-medium">Remplacer les données de cet appareil</h3>
        <p className="mt-1 text-sm">Le contenu absent de cette sauvegarde sera supprimé dans les domaines pris en charge. Aucune fusion n’est effectuée.</p>
        {preview.warnings.map(warning => <p key={warning} className="mt-2 text-sm">{warning}</p>)}
        <DomainReport domains={preview.domains} comparison />
        <button type="button" onClick={exportCurrent} disabled={busy} className="btn-ghost mt-3">Sauvegarder avant de continuer</button>
        <button type="button" onClick={() => { void applyImport(); }} disabled={blocked} className="btn-foil mt-3">Remplacer les données de cet appareil</button>
      </>}
    </div>}
    {source && <button type="button" className="btn-quiet mt-3" onClick={() => safeDownload(source.file, source.name)}>Télécharger le fichier original</button>}
    {purge && <div className="mt-4">
      <h3 className="font-medium">Suppressions prévues</h3>
      <p className="mt-1 text-sm">Toutes les données ci-dessous seront supprimées définitivement de cet appareil, y compris la note d’investissement et les archives.</p>
      <DomainReport domains={purge.domains.filter(d => d.present)} />
      <button type="button" className="btn-ghost mt-3" onClick={exportCurrent} disabled={busy}>Sauvegarder avant de continuer</button>
      <button type="button" className="btn-ghost mt-3" onClick={() => setPurgeOpen(true)} disabled={blocked}>Confirmer la suppression…</button>
      <button type="button" className="btn-quiet mt-3" onClick={() => setPurge(null)}>Annuler la suppression</button>
    </div>}
    {recovery && <div className="mt-4" role="region" aria-label="Copie de récupération">
      <p>Une copie de récupération de l’état précédent est disponible. Téléchargez-la avant de poursuivre. Elle peut contenir des données brutes incompatibles.</p>
      <button type="button" className="btn-ghost mt-3" onClick={() => safeDownload(recovery, exportName('vc-platform-recuperation'))}>Télécharger la copie de récupération</button>
      <button type="button" className="btn-quiet mt-3" onClick={() => setRemoveRecoveryOpen(true)}>Retirer cette copie de récupération</button>
    </div>}
    {busy && <p role="status" className="mt-3">Vérification et enregistrement en cours…</p>}
    {notice && <p role={notice.error ? 'alert' : 'status'} className="mt-3 text-sm">{notice.text}</p>}
    <ConfirmDialog open={purgeOpen} onClose={() => setPurgeOpen(false)} onConfirm={() => { void applyPurge(); }} title="Effacer toutes les données locales ?" body="Cette suppression est définitive. Elle concerne les domaines inventoriés, la note d’investissement et les archives. Une sauvegarde téléchargée pourra être importée depuis cette page." confirmLabel="Tout effacer" focusCancel />
    <ConfirmDialog open={removeRecoveryOpen} onClose={() => setRemoveRecoveryOpen(false)} onConfirm={() => {
      void localDataRecovery.clear().then(() => { setRecovery(null); setRecoveryChecked(true); }).catch(() => setNotice({ error: true, text: 'La copie de récupération n’a pas pu être supprimée.' }));
    }} title="Retirer la copie de récupération ?" body="Conservez d’abord le fichier téléchargé. Cette commande supprime uniquement la copie de récupération, sans modifier les données actives." confirmLabel="Retirer la copie" focusCancel />
  </div>;
}

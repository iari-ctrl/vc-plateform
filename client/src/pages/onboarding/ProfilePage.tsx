import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, RotateCcw, Sun, Moon, Target, Trash2, Upload } from 'lucide-react';
import { profileById } from '@/content';
import { recommendedPaths, TIME_LABEL } from '@/lib/ikigai';
import { KanjiSeal, Fleuron } from '@/components/ornaments/Ornaments';
import { IkigaiCahierSummary } from '@/components/ikigai/IkigaiCahierSummary';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SectionHeading } from '@/components/ui/primitives';
import { useUserData } from '@/context/UserDataContext';
import { useTheme } from '@/context/ThemeContext';
import {
  createLocalDataExport,
  importLocalDataExport,
  previewLocalDataImport,
  purgeLocalData,
  serializeLocalDataExport,
  type LocalDataPreviewResult,
} from '@/lib/localDataLifecycle';
import { usePageMeta } from '@/lib/seo';

function downloadLocalExport() {
  const exported = createLocalDataExport();
  const blob = new Blob([serializeLocalDataExport(exported)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `vc-platform-donnees-locales-${exported.exportedAt.slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ImportPreview({ preview }: { preview: LocalDataPreviewResult }) {
  if (!preview.ok) {
    return <p role="alert" className="mt-3 text-sm text-error">Import refusé : {preview.message}</p>;
  }
  const populated = preview.domains.filter((domain) => domain.present);
  return (
    <div className="mt-3 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-surface-variant">
      <p className="font-medium text-foreground">Aperçu sans contenu libre</p>
      <p className="mt-1">Export du {new Date(preview.exportedAt).toLocaleString('fr-FR')} · {populated.length} domaines renseignés.</p>
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {populated.map((domain) => (
          <li key={domain.key} className="rounded-xl bg-surface-container px-3 py-2">
            <span className="font-mono text-[0.6875rem] text-surface-variant">{domain.key}</span>
            <span className="ml-2 text-foreground">{domain.itemCount} élément{domain.itemCount > 1 ? 's' : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProfilePage() {
  usePageMeta('Mon profil', 'Votre profil d’apprentissage et vos préférences, enregistrés uniquement sur cet appareil.');
  const { profile, reloadLocalData } = useUserData();
  const { theme, toggle } = useTheme();
  const [purgeOpen, setPurgeOpen] = useState(false);
  const [importText, setImportText] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<LocalDataPreviewResult | null>(null);
  const [lifecycleMessage, setLifecycleMessage] = useState<string | null>(null);

  const learningProfile = profile ? profileById(profile.profileType) : undefined;
  const recPaths = learningProfile ? recommendedPaths(learningProfile, profile?.timeBudget) : [];

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    setImportText(text);
    setImportPreview(previewLocalDataImport(text));
    setLifecycleMessage(null);
  };

  const applyImport = () => {
    if (!importText || !importPreview?.ok) return;
    const result = importLocalDataExport(importText);
    if (result.ok) {
      reloadLocalData();
      setImportText(null);
      setImportPreview(null);
      setLifecycleMessage('Import appliqué. Les données locales ont été relues depuis cet appareil.');
    } else {
      setLifecycleMessage('Import interrompu. Les données précédentes ont été conservées lorsque le navigateur l’a permis.');
    }
  };

  const purgeAll = () => {
    const result = purgeLocalData();
    if (result.ok) {
      reloadLocalData();
      setLifecycleMessage('Données locales supprimées. Les autres clés du navigateur ont été conservées.');
    } else {
      setLifecycleMessage('La suppression locale a échoué. Les données précédentes ont été conservées lorsque le navigateur l’a permis.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Votre espace" title="Mon profil" description="Votre profil, votre cahier et vos préférences sont enregistrés uniquement sur cet appareil." />

      <div className="mt-8 space-y-6">
        {/* Learning profile */}
        {learningProfile ? (
          <div className="premium-card p-7" style={{ borderColor: `color-mix(in srgb, ${learningProfile.accent} 35%, transparent)` }}>
            <p className="eyebrow mb-4">Profil d’apprentissage</p>
            <div className="flex flex-wrap items-center gap-4">
              <KanjiSeal kanji={learningProfile.kanji} accent={learningProfile.accent} size={56} />
              <div className="flex-1">
                <h3 className="font-headline text-headline-md font-semibold" style={{ color: learningProfile.accent }}>{learningProfile.name}</h3>
                <p className="text-sm text-surface-variant">{learningProfile.tag} · {TIME_LABEL[profile?.timeBudget ?? 'medium']}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-surface-variant">{learningProfile.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/profile-result" className="btn-ghost !py-2.5">Voir le détail <ArrowRight size={15} /></Link>
              <Link to="/onboarding" className="btn-quiet"><RotateCcw size={14} /> Refaire le test</Link>
            </div>
            {recPaths[0] && (
              <p className="mt-4 text-sm text-surface-variant">Parcours recommandé : <Link to={`/parcours/${recPaths[0].slug}`} className="gold-link">{recPaths[0].title}</Link></p>
            )}
          </div>
        ) : (
          <div className="premium-card p-7 text-center">
            <Fleuron className="text-base" />
            <h3 className="mt-2 font-headline text-headline-sm font-semibold">Pas encore de profil</h3>
            <p className="mt-1.5 text-sm text-surface-variant">Faites le test d’orientation pour révéler votre profil d’apprentissage.</p>
            <Link to="/onboarding" className="btn-foil mt-4 !py-2.5"><Target size={15} /> Faire le test</Link>
          </div>
        )}

        {/* Mon cahier Ikigai */}
        <IkigaiCahierSummary />

        {/* Preferences */}
        <div className="premium-card p-7">
          <p className="eyebrow mb-4">Préférences</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Apparence</p>
              <p className="text-sm text-surface-variant">Thème {theme === 'dark' ? 'sombre' : 'clair'}</p>
            </div>
            <button onClick={toggle} className="btn-ghost !py-2.5">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            </button>
          </div>
        </div>

        <div className="premium-card p-7">
          <p className="eyebrow mb-4">Données locales</p>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 text-sm leading-relaxed text-surface-variant">
            <p className="font-medium text-foreground">Stockage sur cet appareil</p>
            <p className="mt-1">Profil, notes, favoris, progression, journal, cahier, workspace et tentatives sont enregistrés localement dans ce navigateur. Ces données ne sont pas chiffrées par la plateforme, peuvent être visibles par les utilisateurs de l’appareil et ne doivent pas contenir de secret, jeton, donnée réglementée ou information professionnelle confidentielle.</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={downloadLocalExport} className="btn-ghost !py-2.5">
              <Download size={15} /> Exporter
            </button>
            <label className="btn-quiet cursor-pointer">
              <Upload size={15} /> Choisir un import
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(event) => { void handleImportFile(event.currentTarget.files?.[0]); }}
              />
            </label>
            <button type="button" onClick={() => setPurgeOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-error px-4 py-2.5 text-sm font-semibold text-error-foreground transition-colors hover:bg-[color-mix(in_srgb,var(--error)_85%,black)]">
              <Trash2 size={15} /> Tout effacer
            </button>
          </div>

          {importPreview && <ImportPreview preview={importPreview} />}
          {importPreview?.ok && (
            <button type="button" onClick={applyImport} className="btn-foil mt-3 !py-2.5">
              Appliquer cet import
            </button>
          )}
          {lifecycleMessage && <p role="status" className="mt-3 text-sm text-surface-variant">{lifecycleMessage}</p>}
        </div>
      </div>
      <ConfirmDialog
        open={purgeOpen}
        onClose={() => setPurgeOpen(false)}
        onConfirm={purgeAll}
        title="Effacer toutes les données locales ?"
        body="Cette action supprime le profil, les notes, les favoris, la progression, le journal, le cahier, le workspace et les tentatives enregistrés par la plateforme dans ce navigateur. Elle ne supprime pas les autres clés du navigateur."
        confirmLabel="Tout effacer"
      />
    </div>
  );
}

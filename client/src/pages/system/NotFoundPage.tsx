import { Link } from 'react-router-dom';
import { CompassRose, SeaMonster, Constellation } from '@/components/ornaments/Illustrations';
import { usePageMeta } from '@/lib/seo';

export default function NotFoundPage() {
  usePageMeta('Terra Incognita');
  return (
    <div className="map-paper grain relative mx-auto flex min-h-[72vh] max-w-2xl flex-col items-center justify-center overflow-hidden px-4 text-center">
      <Constellation className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />
      <div className="pointer-events-none absolute bottom-6 right-2 opacity-70 sm:right-10">
        <SeaMonster size={120} />
      </div>
      <div className="pointer-events-none absolute bottom-8 left-2 opacity-50 sm:left-10" style={{ transform: 'scale(-1,1)' }}>
        <SeaMonster size={90} />
      </div>

      <div className="relative">
        <CompassRose size={104} className="mx-auto opacity-90" />
        <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.34em] text-[color:var(--primary)]">Erreur 404</p>
        <h1 className="mt-3 font-headline text-display-md font-semibold italic">Terra Incognita</h1>
        <p className="mx-auto mt-3 max-w-md text-surface-variant text-pretty">
          <span className="font-headline italic">Hic sunt dracones.</span> Ce chemin ne figure sur aucune carte — mais le venture récompense l’exploration. Reprenez la boussole.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-foil sheen-host">Revenir au port</Link>
          <Link to="/parcours" className="btn-ghost">Voir la carte des parcours</Link>
        </div>
      </div>
    </div>
  );
}

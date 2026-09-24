import { ExternalLink } from 'lucide-react';
import { publicAssetUrl } from '@shared/base-url.mjs';

const MEMO_SIMULATOR_PATH = 'tools/simulateur-memo.html';

export function InvestmentMemoSim({ accent }: { accent: string }) {
  const simulatorSrc = publicAssetUrl(MEMO_SIMULATOR_PATH, import.meta.env.BASE_URL);

  return (
    <section className="space-y-3" aria-labelledby="investment-memo-simulator-title">
      <div className="flex flex-col gap-3 border-l-2 pl-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderLeftColor: accent }}>
        <div className="max-w-3xl">
          <h2 id="investment-memo-simulator-title" className="font-headline text-headline-sm font-semibold tracking-tight">
            Rédiger la note
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-surface-variant">
            Saisie enregistrée localement. Pour finaliser l’export PDF, ouvrez la pleine page puis imprimez.
          </p>
        </div>
        <a href={simulatorSrc} target="_blank" rel="noreferrer" className="btn-foil shrink-0">
          Ouvrir en pleine page <ExternalLink size={15} aria-hidden />
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest">
        <iframe
          src={simulatorSrc}
          title="Simulateur de note d'investissement"
          allow="clipboard-write"
          className="block h-[82svh] min-h-[42rem] w-full border-0 sm:h-[900px] sm:min-h-[78vh]"
        />
      </div>
    </section>
  );
}

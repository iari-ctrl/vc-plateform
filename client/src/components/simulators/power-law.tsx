import { useMemo, useState } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { simulatePowerLawPortfolio, type HistogramBucket, type PolicySummary } from '@/lib/simulators/power-law';
import { GlossaryPreview } from '@/lib/markdown';
import { Panel, Slider, Stat } from './shared';

// ── 8. Power law & portfolio construction (Monte Carlo) ─────────────────────
function Histogram({ data, accent, title }: { data: HistogramBucket[]; accent: string; title: string }) {
  const max = Math.max(...data.map((d) => d.share), 0.0001);
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
      <p className="mb-3 text-xs text-surface-variant">{title}</p>
      <div className="flex items-end gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="font-mono text-[0.625rem] text-surface-variant">{d.share >= 0.005 ? formatPercent(d.share * 100, 0) : ''}</span>
            <div className="flex h-24 w-full items-end">
              <div className="w-full rounded-t" style={{ height: `${(d.share / max) * 100}%`, minHeight: d.share > 0 ? '2px' : 0, background: accent }} />
            </div>
            <span className="text-[0.625rem] text-surface-variant">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatMultiple(value: number) {
  return `${formatNumber(value, { maximumFractionDigits: 2 })}×`;
}

const policyLabels = { allRounds: 'Tous les tours ouverts', milestone: 'Objectif atteint' } as const;
type LivePolicy = keyof typeof policyLabels;

function PolicyComparison({ allRounds, milestone, budgetM }: {
  allRounds: PolicySummary;
  milestone: PolicySummary;
  budgetM: number;
}) {
  const policies = [allRounds, milestone];
  const rows = [
    ['TVPI brut médian', ...policies.map(p => formatMultiple(p.percentiles.p50))],
    ['Fonds en perte (TVPI < 1×)', ...policies.map(p => formatPercent(100 * (1 - p.probAtLeast.x1)))],
    ['Réserves investies en moyenne', ...policies.map(p => formatCurrency(p.meanInvestedReservesM * 1e6))],
    ['Réserves non appelées en moyenne', ...policies.map(p => formatCurrency(Math.max(0, budgetM - p.meanInvestedReservesM) * 1e6))],
  ];
  return (
    <table className="w-full table-fixed text-left text-xs sm:text-sm">
      <caption className="pb-3 text-left font-headline text-lg font-semibold">Comparaison sur les mêmes 4 000 portefeuilles</caption>
      <thead><tr className="border-b border-outline-variant">
        <th scope="col" className="w-2/5 py-2 pr-2">Indicateur</th>
        <th scope="col" className="px-1 py-2 text-right">{policyLabels.allRounds}</th>
        <th scope="col" className="py-2 pl-1 text-right">{policyLabels.milestone}</th>
      </tr></thead>
      <tbody>{rows.map(([label, all, met]) => (
        <tr key={label} className="border-b border-outline-variant">
          <th scope="row" className="py-2 pr-2 font-normal">{label}</th>
          <td className="px-1 text-right tabular-nums">{all}</td>
          <td className="pl-1 text-right tabular-nums">{met}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

export function PowerLawSim({ accent }: { accent: string }) {
  const [fundSize, setFundSize] = useState(80); // M€
  const [lines, setLines] = useState(25);
  const [reserves, setReserves] = useState(40); // %
  const [ownership, setOwnership] = useState(10); // %
  const [dilution, setDilution] = useState(40); // %
  const [failRate, setFailRate] = useState(50); // %
  const [modestRate, setModestRate] = useState(35); // %
  const [alpha, setAlpha] = useState(2.0);
  const [maxMultiple, setMaxMultiple] = useState(300);
  const [detailPolicy, setDetailPolicy] = useState<LivePolicy>('allRounds');

  const simulation = useMemo(
    () =>
      simulatePowerLawPortfolio({
        fundSizeM: fundSize,
        portfolioSize: lines,
        reservesPct: reserves / 100,
        ownershipPct: ownership / 100,
        dilutionPct: dilution / 100,
        failRatePct: failRate / 100,
        modestRatePct: modestRate / 100,
        alpha,
        maxMultiple,
      }),
    [fundSize, lines, reserves, ownership, dilution, failRate, modestRate, alpha, maxMultiple],
  );

  const tailRate = Math.max(0, 100 - failRate - Math.min(modestRate, 100 - failRate));
  const res = simulation.policies[detailPolicy];
  const reference = simulation.policies.hindsight;
  const reserveBudgetM = fundSize * reserves / 100;

  return (
    <Panel
      inputs={
        <>
          <Slider label="Taille du fonds" value={fundSize} min={10} max={500} step={5} format={(v) => formatCurrency(v * 1e6)} onChange={setFundSize} />
          <Slider label="Nombre de lignes (checks initiaux)" value={lines} min={10} max={60} step={1} format={(v) => `${v}`} onChange={setLines} />
          <Slider label="Réserves follow-on" value={reserves} min={0} max={60} step={5} format={(v) => formatPercent(v, 0)} onChange={setReserves} />
          <Slider label="Ownership initial moyen" value={ownership} min={2} max={25} step={1} format={(v) => formatPercent(v, 0)} onChange={setOwnership} />
          <Slider label="Dilution subie jusqu'à l'exit" value={dilution} min={0} max={70} step={5} format={(v) => formatPercent(v, 0)} onChange={setDilution} />
          <Slider label="Taux d'échec (0×)" value={failRate} min={20} max={80} step={5} format={(v) => formatPercent(v, 0)} onChange={setFailRate} />
          <Slider label="Sorties modestes (0,3×–3×)" value={modestRate} min={0} max={60} step={5} format={(v) => formatPercent(v, 0)} onChange={setModestRate} />
          <Slider label="Pente de la queue (alpha)" value={alpha} min={1.3} max={3.5} step={0.1} format={(v) => `α = ${formatNumber(v, { maximumFractionDigits: 1 })}`} onChange={setAlpha} />
          <Slider label="Multiple société maximum" value={maxMultiple} min={50} max={1000} step={50} format={(v) => `${v}×`} onChange={setMaxMultiple} />
          <p className="text-[0.625rem] leading-relaxed text-surface-variant">
            Les sorties se répartissent entre {formatPercent(failRate, 0)} d’échecs, {formatPercent(Math.min(modestRate, 100 - failRate), 0)} de sorties modestes et {formatPercent(tailRate, 0)} de sorties à 3× ou plus.
          </p>
        </>
      }
      results={
        <>
          <PolicyComparison allRounds={simulation.policies.allRounds} milestone={simulation.policies.milestone} budgetM={reserveBudgetM} />
          <p className="text-sm text-surface-variant">
            Les deux politiques disposent de {formatCurrency(reserveBudgetM * 1e6)} de réserves et investissent à parts égales, dans la limite du ticket initial par société.
            La première participe à chaque tour ouvert au fonds. La seconde exige aussi que la société ait atteint son objectif commercial.
            Le TVPI brut rapporte les produits de cession au capital effectivement versé.
          </p>
          <details className="rounded-xl border border-outline-variant p-3 text-sm">
            <summary className="cursor-pointer font-medium">Sélection avec connaissance des sorties</summary>
            <p className="mt-2 text-surface-variant">
              Ce repère rétrospectif retient les tours ouverts dont la société finira à 3× ou plus, aux mêmes prix et plafonds.
              Il donne un TVPI médian de {formatMultiple(reference.percentiles.p50)}, avec {formatPercent(100 * (1 - reference.probAtLeast.x1))} de fonds en perte
              et {formatCurrency(reference.meanInvestedReservesM * 1e6)} de réserves investies en moyenne.
            </p>
          </details>
          <label className="block text-sm font-medium">
            Politique détaillée
            <select value={detailPolicy} onChange={e => setDetailPolicy(e.target.value === 'milestone' ? 'milestone' : 'allRounds')}
              className="ml-2 max-w-full rounded border border-outline-variant bg-surface-container-lowest px-2 py-1.5">
              <option value="allRounds">{policyLabels.allRounds}</option>
              <option value="milestone">{policyLabels.milestone}</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="TVPI médian" value={`${formatNumber(res.percentiles.p50, { maximumFractionDigits: 2 })}×`} accent={accent} hint="brut, hors frais" />
            <Stat label="TVPI moyen" value={`${formatNumber(res.mean, { maximumFractionDigits: 2 })}×`} hint="tiré par les outliers" />
            <Stat label="P10 — défavorable" value={`${formatNumber(res.percentiles.p10, { maximumFractionDigits: 2 })}×`} hint="10 % des cas en dessous" />
            <Stat label="P90 — favorable" value={`${formatNumber(res.percentiles.p90, { maximumFractionDigits: 2 })}×`} hint="10 % des cas au-dessus" />
            <Stat label="Fréquence du TVPI ≥ 2×" value={formatPercent(res.probAtLeast.x2 * 100)} accent={accent} />
            <Stat label="Fréquence du TVPI ≥ 3×" value={formatPercent(res.probAtLeast.x3 * 100)} />
            <Stat label="Part de la meilleure ligne" value={formatPercent(res.medianTopLineShare * 100)} hint="du retour total (médiane)" />
            <Stat label="Part du top 3" value={formatPercent(res.medianTop3Share * 100)} hint="du retour total (médiane)" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Ticket initial" value={formatCurrency(simulation.initialCheckM * 1e6)} hint={`${lines} lignes, réserves déduites`} />
            <Stat label="Post-money implicite" value={formatCurrency(simulation.impliedPostMoneyM * 1e6)} hint={`pour ${formatPercent(ownership, 0)} du capital`} />
            <Stat label="Part à la sortie sans suivi" value={formatPercent(simulation.ownershipAtExitPct * 100, 1)} hint="après dilution du ticket initial" />
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-low/60 p-4 text-sm flex gap-3">
            <span className="font-semibold text-lg leading-none" style={{ color: accent }}>Σ</span>
            <div>
              <p className="font-semibold text-foreground">Fund returner math</p>
              <p className="mt-1 text-xs text-surface-variant">
                Sans réinvestissement, une participation de {formatPercent(simulation.ownershipAtExitPct * 100, 1)} exige une sortie à <strong className="text-foreground">{formatCurrency(simulation.fundReturnerExitM * 1e6)}</strong> pour rapporter à elle seule les {formatCurrency(fundSize * 1e6)} engagés.
              </p>
            </div>
          </div>

          <Histogram data={res.tvpiHistogram} accent={accent} title="Distribution du TVPI sur 4 000 simulations" />
          <Histogram data={simulation.multipleHistogram} accent={accent} title="Distribution des multiples par ligne (avant dilution)" />
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant">
            <p className="font-semibold text-foreground mb-1">Hypothèses de simulation</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Chaque société a 60 % de chances d’ouvrir un tour au fonds et, indépendamment, 50 % de chances d’atteindre son objectif. La valorisation post-money du tour vaut celle de l’entrée si l’objectif est manqué et le double s’il est atteint. Ces valeurs sont des hypothèses pédagogiques.</li>
              <li>L’objectif atteint augmente la probabilité d’une bonne sortie. Au réglage de 50 % d’échecs, la probabilité de perte totale est de 25 % si l’objectif est atteint et de 75 % sinon. Chaque sortie vaut 0×, entre 0,3× et 3×, ou suit une <GlossaryPreview slug="power-law" label="loi de puissance" /> plafonnée à partir de 3×.</li>
              <li>La <GlossaryPreview slug="dilution" label="dilution" /> saisie porte sur le ticket initial. Le ticket de suivi achète une part au prix du tour, conservée jusqu’à la sortie. La fraction des réserves inutilisée reste non appelée et ne donne lieu à aucune distribution.</li>
              <li>Les sociétés sont simulées indépendamment, hors frais, <GlossaryPreview slug="carry" label="carry" /> et recyclage. À tirages identiques, le TVPI reste constant quand la part détenue à l’entrée varie, car les valorisations du tour et de la sortie sont exprimées en multiples de la valorisation initiale.</li>
            </ul>
          </div>
        </>
      }
    />
  );
}

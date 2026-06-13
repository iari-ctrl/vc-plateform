import { useMemo, useState } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { simulatePowerLawPortfolio, type HistogramBucket } from '@/lib/simulators/power-law';
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

  const res = useMemo(
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
            Graduation implicite : {formatPercent(failRate, 0)} échecs · {formatPercent(Math.min(modestRate, 100 - failRate), 0)} sorties modestes · {formatPercent(tailRate, 0)} queue power law (≥ 3×). Plus α est bas, plus les outliers sont extrêmes.
          </p>
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (Monte Carlo, 4 000 portefeuilles simulés) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Tirage par ligne</strong> : échec (0×), sortie modeste (uniforme 0,3×–3×), ou queue <GlossaryPreview slug="power-law" label="power law" /> (Pareto au-delà de 3×, plafonnée au multiple maximum). Les taux jouent le rôle de graduation rates simplifiés.</li>
              <li><strong><GlossaryPreview slug="dilution" label="Dilution" /></strong> : appliquée au check initial uniquement — le multiple effectif du fonds est m × (1 − dilution).</li>
              <li><strong><GlossaryPreview slug="follow-on" label="Follow-ons" /></strong> : les <GlossaryPreview slug="reserve-funds" label="réserves" /> sont déployées à parts égales dans les lignes de la queue, à mi-parcours (rendement √m), pro-rata défendu donc sans dilution.</li>
              <li><strong>Limites</strong> : frais et <GlossaryPreview slug="carry" label="carry" /> non modélisés (<GlossaryPreview slug="tvpi" label="TVPI" /> brut), pas de recyclage, multiples i.i.d. — voir le simulateur Management Fees pour le net.</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="TVPI médian" value={`${formatNumber(res.percentiles.p50, { maximumFractionDigits: 2 })}×`} accent={accent} hint="brut, hors frais" />
            <Stat label="TVPI moyen" value={`${formatNumber(res.mean, { maximumFractionDigits: 2 })}×`} hint="tiré par les outliers" />
            <Stat label="P10 — défavorable" value={`${formatNumber(res.percentiles.p10, { maximumFractionDigits: 2 })}×`} hint="10 % des cas en dessous" />
            <Stat label="P90 — favorable" value={`${formatNumber(res.percentiles.p90, { maximumFractionDigits: 2 })}×`} hint="10 % des cas au-dessus" />
            <Stat label="Proba TVPI ≥ 2×" value={formatPercent(res.probAtLeast.x2 * 100)} accent={accent} hint="seuil d'un bon fonds" />
            <Stat label="Proba TVPI ≥ 3×" value={formatPercent(res.probAtLeast.x3 * 100)} hint="territoire top décile" />
            <Stat label="Part de la meilleure ligne" value={formatPercent(res.medianTopLineShare * 100)} hint="du retour total (médiane)" />
            <Stat label="Part du top 3" value={formatPercent(res.medianTop3Share * 100)} hint="du retour total (médiane)" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Check initial" value={formatCurrency(res.initialCheckM * 1e6)} hint={`${lines} lignes, réserves déduites`} />
            <Stat label="Post-money implicite" value={formatCurrency(res.impliedPostMoneyM * 1e6)} hint={`pour ${formatPercent(ownership, 0)} d'ownership`} />
            <Stat label="Ownership à l'exit" value={formatPercent(res.ownershipAtExitPct * 100, 1)} hint="après dilution non défendue" />
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-low/60 p-4 text-sm flex gap-3">
            <span className="font-semibold text-lg leading-none" style={{ color: accent }}>Σ</span>
            <div>
              <p className="font-semibold text-foreground">Fund returner math</p>
              <p className="mt-1 text-xs text-surface-variant">
                Avec {formatPercent(res.ownershipAtExitPct * 100, 1)} d'ownership à l'exit, une seule société doit sortir à <strong className="text-foreground">{formatCurrency(res.fundReturnerExitM * 1e6)}</strong> pour rendre 1× le fonds à elle seule. C'est le test de cohérence entre taille de fonds, ownership et marché visé.
              </p>
            </div>
          </div>

          <Histogram data={res.tvpiHistogram} accent={accent} title="Distribution du TVPI sur 4 000 simulations" />
          <Histogram data={res.multipleHistogram} accent={accent} title="Distribution des multiples par ligne (avant dilution)" />
        </>
      }
    />
  );
}

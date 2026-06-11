import { useMemo, useState, type ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import { calculateDilution } from '@/lib/simulators/dilution';
import { calculateWaterfall } from '@/lib/simulators/waterfall';
import { calculateFundReturns } from '@/lib/simulators/fund-returns';
import { calculateManagementFees } from '@/lib/simulators/management-fees';
import { simulatePowerLawPortfolio, type HistogramBucket } from '@/lib/simulators/power-law';
import { GlossaryPreview } from '@/lib/markdown';

// ── Shared inputs ────────────────────────────────────────────────────────────
function Field({ label, suffix, value, onChange, step = 1, min = 0 }: { label: string; suffix?: string; value: number; onChange: (v: number) => void; step?: number; min?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-surface-variant">
        <span>{label}</span>
        {suffix && <span className="font-mono">{suffix}</span>}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-[color:var(--primary)] focus:bg-surface-container-lowest"
      />
    </label>
  );
}

function Slider({ label, value, onChange, min, max, step = 1, format }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format: (v: number) => string }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-surface-variant">
        <span>{label}</span>
        <span className="font-mono text-foreground">{format(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-[color:var(--primary)]" />
    </label>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: ReactNode; hint?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <p className="text-[0.625rem] uppercase tracking-wider text-surface-variant">{label}</p>
      <p className="mt-1 font-headline text-headline-md font-semibold" style={{ color: accent }}>{value}</p>
      {hint && <p className="mt-0.5 text-[0.625rem] text-surface-variant">{hint}</p>}
    </div>
  );
}

function Panel({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <div className="space-y-4 rounded-2xl border border-outline-variant bg-surface-container-low/50 p-6">
        <p className="eyebrow">Paramètres</p>
        {inputs}
      </div>
      <div className="space-y-4">{results}</div>
    </div>
  );
}

// ── 1. Dilution ──────────────────────────────────────────────────────────────
interface Round { id: number; label: string; pre: number; raise: number; esopTarget: number; }

function DilutionSim({ accent }: { accent: string }) {
  const [rounds, setRounds] = useState<Round[]>([
    { id: 1, label: 'Seed', pre: 6, raise: 1.5, esopTarget: 10 },
    { id: 2, label: 'Series A', pre: 18, raise: 6, esopTarget: 5 },
    { id: 3, label: 'Series B', pre: 60, raise: 18, esopTarget: 0 },
  ]);

  const results = calculateDilution(rounds);
  const rows = rounds.map((r, i) => ({ ...r, ...results[i] }));
  const founder = results.length > 0 ? results[results.length - 1].founderAfter : 100;

  return (
    <Panel
      inputs={
        <>
          <div className="space-y-3">
            {rounds.map((r, i) => (
              <div key={r.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-3">
                <div className="mb-2 flex items-center justify-between">
                  <input value={r.label} aria-label={`Nom du tour ${i + 1}`} onChange={(e) => setRounds((rs) => rs.map((x) => (x.id === r.id ? { ...x, label: e.target.value } : x)))} className="w-28 bg-transparent text-sm font-medium outline-none" />
                  {rounds.length > 1 && <button onClick={() => setRounds((rs) => rs.filter((x) => x.id !== r.id))} aria-label={`Retirer le tour ${r.label}`} className="text-surface-variant hover:text-error"><Trash2 size={14} /></button>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Pre-money" suffix="M€" value={r.pre} step={0.5} onChange={(v) => setRounds((rs) => rs.map((x) => (x.id === r.id ? { ...x, pre: v } : x)))} />
                  <Field label="Levée" suffix="M€" value={r.raise} step={0.5} onChange={(v) => setRounds((rs) => rs.map((x) => (x.id === r.id ? { ...x, raise: v } : x)))} />
                  <Field label="Création ESOP" suffix="%" value={r.esopTarget} step={1} onChange={(v) => setRounds((rs) => rs.map((x) => (x.id === r.id ? { ...x, esopTarget: v } : x)))} />
                </div>
                <p className="mt-1.5 text-[0.625rem] text-surface-variant">Cède {formatPercent(rows[i].investorPct)} aux investisseurs et {formatPercent(rows[i].esopPct)} au pool ESOP (pre-money)</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setRounds((rs) => {
              const getNextLabel = (len: number) => len === 0 ? 'Seed' : `Series ${String.fromCharCode(65 + len - 1)}`;
              return [...rs, { id: Date.now(), label: getNextLabel(rs.length), pre: rows[rows.length - 1]?.post ?? 80, raise: 20, esopTarget: 0 }];
            })} 
            className="btn-ghost w-full !py-2"
          >
            <Plus size={15} /> Ajouter un tour
          </button>
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (Standard VC) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong><GlossaryPreview slug="pre-money" label="Post-money" /></strong> = <GlossaryPreview slug="pre-money" label="Pre-money" /> + Levée</li>
              <li><strong>Part Investisseur</strong> = Levée ÷ Post-money</li>
              <li><strong>Option Pool Shuffle</strong> : La création de l'<GlossaryPreview slug="esop" label="ESOP" /> se fait sur la valorisation <em>pre-money</em>. La dilution est donc entièrement absorbée par les actionnaires existants.</li>
              <li><strong>Nouvelle part fondateurs</strong> = Part précédente × (100% - Part Investisseur - Nouvel ESOP)</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Part fondateurs finale" value={formatPercent(founder)} accent={accent} hint="après tous les tours" />
            <Stat label="Dilution totale" value={formatPercent(100 - founder)} hint="cédée au total" />
            <Stat label="Valorisation finale" value={formatCurrency((rows[rows.length - 1]?.post ?? 0) * 1_000_000)} hint="post-money dernier tour" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-outline-variant">
            <table className="w-full text-sm">
              <thead className="bg-surface-container text-left text-xs text-surface-variant">
                <tr><th className="px-4 py-2.5 font-medium">Tour</th><th className="px-4 py-2.5 font-medium">Post-money</th><th className="px-4 py-2.5 font-medium">Nouveaux inv.</th><th className="px-4 py-2.5 font-medium">Nouvel ESOP</th><th className="px-4 py-2.5 font-medium">Fondateurs après</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-outline-variant">
                    <td className="px-4 py-2.5 font-medium">{r.label}</td>
                    <td className="px-4 py-2.5">{formatCurrency(r.post * 1_000_000)}</td>
                    <td className="px-4 py-2.5">{formatPercent(r.investorPct)}</td>
                    <td className="px-4 py-2.5 text-surface-variant">{r.esopPct > 0 ? formatPercent(r.esopPct) : '-'}</td>
                    <td className="px-4 py-2.5 font-mono">{formatPercent(r.founderAfter)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
    />
  );
}

// ── 2. Pre / Post money ────────────────────────────────────────────────────────
function PrePostSim({ accent }: { accent: string }) {
  const [pre, setPre] = useState(8);
  const [raise, setRaise] = useState(2);
  const post = pre + raise;
  const investorPct = post > 0 ? (raise / post) * 100 : 0;
  return (
    <Panel
      inputs={
        <>
          <Slider label="Valorisation pre-money" value={pre} min={0.5} max={100} step={0.5} format={(v) => formatCurrency(v * 1e6)} onChange={setPre} />
          <Slider label="Montant levé" value={raise} min={0.1} max={50} step={0.1} format={(v) => formatCurrency(v * 1e6)} onChange={setRaise} />
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie mathématique :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong><GlossaryPreview slug="pre-money" label="Post-money" /></strong> = <GlossaryPreview slug="pre-money" label="Pre-money" /> + Montant levé</li>
              <li><strong>Part de l’investisseur (Dilution)</strong> = Montant levé ÷ Valorisation Post-money</li>
              <li><strong>Multiple implicite</strong> = Post-money ÷ Pre-money</li>
            </ul>
            <p className="mt-2">L'erreur classique des fondateurs est de diviser la levée par la valorisation pre-money. En VC, la dilution se calcule toujours sur le <strong>Post-money</strong>.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Valorisation post-money" value={formatCurrency(post * 1e6)} accent={accent} hint="pre + montant levé" />
            <Stat label="Part de l’investisseur" value={formatPercent(investorPct)} hint="montant / post-money" />
            <Stat label="Part conservée" value={formatPercent(100 - investorPct)} hint="par les détenteurs existants" />
            <Stat label="Multiple implicite" value={`${formatNumber(post / Math.max(pre, 0.01), { maximumFractionDigits: 2 })}×`} hint="post / pre" />
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Répartition post-money</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${100 - investorPct}%`, background: accent }} />
              <div style={{ width: `${investorPct}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-surface-variant">
              <span>Existants {formatPercent(100 - investorPct)}</span>
              <span>Nouvel investisseur {formatPercent(investorPct)}</span>
            </div>
          </div>
        </>
      }
    />
  );
}

// ── 3. Ownership / cap table ────────────────────────────────────────────────────
interface Holder { id: number; name: string; shares: number }
function OwnershipSim({ accent }: { accent: string }) {
  const [valuation, setValuation] = useState(40);
  const [holders, setHolders] = useState<Holder[]>([
    { id: 1, name: 'Fondateurs', shares: 6000 },
    { id: 2, name: 'ESOP', shares: 1000 },
    { id: 3, name: 'Seed', shares: 1800 },
    { id: 4, name: 'Series A', shares: 1200 },
  ]);
  const total = holders.reduce((s, h) => s + h.shares, 0) || 1;
  return (
    <Panel
      inputs={
        <>
          <Slider label="Valorisation de l’entreprise" value={valuation} min={1} max={500} step={1} format={(v) => formatCurrency(v * 1e6)} onChange={setValuation} />
          <div className="space-y-2">
            {holders.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                <input value={h.name} aria-label="Nom du détenteur" onChange={(e) => setHolders((hs) => hs.map((x) => (x.id === h.id ? { ...x, name: e.target.value } : x)))} className="w-28 rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-sm outline-none" />
                <input type="number" value={h.shares} aria-label={`Parts de ${h.name || 'ce détenteur'}`} onChange={(e) => setHolders((hs) => hs.map((x) => (x.id === h.id ? { ...x, shares: parseFloat(e.target.value) || 0 } : x)))} className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-sm outline-none" />
                {holders.length > 1 && <button onClick={() => setHolders((hs) => hs.filter((x) => x.id !== h.id))} aria-label={`Retirer ${h.name || 'ce détenteur'}`} className="text-surface-variant hover:text-error"><Trash2 size={14} /></button>}
              </div>
            ))}
          </div>
          <button onClick={() => setHolders((hs) => [...hs, { id: Date.now(), name: 'Nouveau', shares: 500 }])} className="btn-ghost w-full !py-2"><Plus size={15} /> Ajouter une ligne</button>
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (<GlossaryPreview slug="cap-table" label="Cap Table" />) :</p>
            <p>La valeur de la participation de chaque entité se calcule simplement au prorata de ses actions :</p>
            <ul className="list-inside list-disc space-y-1 mt-1">
              <li><strong>Part (%)</strong> = (Nombre d'actions du détenteur) ÷ (Total des actions émises)</li>
              <li><strong>Valeur</strong> = Part (%) × Valorisation totale de l'entreprise</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-outline-variant">
            <table className="w-full text-sm">
              <thead className="bg-surface-container text-left text-xs text-surface-variant"><tr><th className="px-4 py-2.5 font-medium">Détenteur</th><th className="px-4 py-2.5 font-medium">Actions</th><th className="px-4 py-2.5 font-medium">Part</th><th className="px-4 py-2.5 font-medium">Valeur</th></tr></thead>
              <tbody>
                {holders.map((h) => {
                  const pct = (h.shares / total) * 100;
                  return (
                    <tr key={h.id} className="border-t border-outline-variant">
                      <td className="px-4 py-2.5 font-medium">{h.name}</td>
                      <td className="px-4 py-2.5 font-mono">{formatNumber(h.shares)}</td>
                      <td className="px-4 py-2.5 font-mono">{formatPercent(pct)}</td>
                      <td className="px-4 py-2.5">{formatCurrency((pct / 100) * valuation * 1e6)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr className="border-t border-outline-variant bg-surface-container-low font-medium"><td className="px-4 py-2.5">Total</td><td className="px-4 py-2.5 font-mono">{formatNumber(total)}</td><td className="px-4 py-2.5">100 %</td><td className="px-4 py-2.5">{formatCurrency(valuation * 1e6)}</td></tr></tfoot>
            </table>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full">
            {holders.map((h, i) => (
              <div key={h.id} style={{ width: `${(h.shares / total) * 100}%`, background: `color-mix(in srgb, ${accent} ${100 - i * 18}%, var(--surface-container-highest))` }} title={h.name} />
            ))}
          </div>
        </>
      }
    />
  );
}

// ── 4. Waterfall ─────────────────────────────────────────────────────────────
function WaterfallSim({ accent }: { accent: string }) {
  const [investment, setInvestment] = useState(5);
  const [multiple, setMultiple] = useState(1);
  const [participating, setParticipating] = useState(false);
  const [ownership, setOwnership] = useState(25);
  const [exit, setExit] = useState(30);

  const { investor, common, pref, choseConvert, investorMultiple } = calculateWaterfall(investment, multiple, ownership, exit, participating);

  return (
    <Panel
      inputs={
        <>
          <Field label="Montant investi" suffix="M€" value={investment} step={0.5} onChange={setInvestment} />
          <Slider label="Multiple de préférence" value={multiple} min={1} max={3} step={0.5} format={(v) => `${v}×`} onChange={setMultiple} />
          <Slider label="Part de l’investisseur (as-converted)" value={ownership} min={1} max={80} step={1} format={(v) => formatPercent(v, 0)} onChange={setOwnership} />
          <Slider label="Produit de la sortie" value={exit} min={1} max={300} step={1} format={(v) => formatCurrency(v * 1e6)} onChange={setExit} />
          <label className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm">
            <span>Participating (double-dip)</span>
            <button onClick={() => setParticipating((p) => !p)} className={`relative h-6 w-11 rounded-full transition-colors ${participating ? 'bg-[color:var(--primary)]' : 'bg-surface-container-highest'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${participating ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (<GlossaryPreview slug="liquidation-preference" label="Liquidation Preference" />) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>1x <GlossaryPreview slug="liquidation-preference" label="Non-Participating" /> (Standard)</strong> : Lors de la revente, l'investisseur VC a le choix. Soit il récupère sa mise initiale (la préférence), soit il convertit ses parts au prorata et prend son % de la vente totale. Il choisit toujours l'option mathématiquement la plus rentable.</li>
              <li><strong><GlossaryPreview slug="liquidation-preference" label="Participating" /> (Double-dip)</strong> : L'investisseur récupère sa mise en priorité (la préférence) <em>puis</em> prend en plus son % au prorata sur le reste de la vente (le produit résiduel). C'est extrêmement punitif pour les fondateurs.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Investisseur préférentiel" value={formatCurrency(investor * 1e6)} accent={accent} hint={participating ? 'préférence + participation' : choseConvert ? 'convertit en ordinaire' : 'préférence exercée'} />
            <Stat label="Actions ordinaires" value={formatCurrency(common * 1e6)} hint="fondateurs & employés" />
            <Stat label="Préférence de liquidation" value={formatCurrency(pref * 1e6)} hint={`${multiple}× la mise`} />
            <Stat label="Multiple investisseur" value={`${formatNumber(investorMultiple, { maximumFractionDigits: 2 })}×`} hint="retour sur la mise" />
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Répartition du produit de sortie</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${(investor / Math.max(exit, 1)) * 100}%`, background: accent }} />
              <div style={{ width: `${(common / Math.max(exit, 1)) * 100}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-surface-variant"><span>Investisseur {formatPercent((investor / Math.max(exit, 1)) * 100)}</span><span>Ordinaires {formatPercent((common / Math.max(exit, 1)) * 100)}</span></div>
          </div>
        </>
      }
    />
  );
}

// ── 5. Fund returns ─────────────────────────────────────────────────────────────
function FundReturnsSim({ accent }: { accent: string }) {
  const [paidIn, setPaidIn] = useState(100);
  const [distributed, setDistributed] = useState(60);
  const [nav, setNav] = useState(180);
  const { dpi, rvpi, tvpi } = calculateFundReturns(paidIn, distributed, nav);
  return (
    <Panel
      inputs={
        <>
          <Field label="Capital appelé (paid-in)" suffix="M€" value={paidIn} step={5} onChange={setPaidIn} />
          <Field label="Distributions versées" suffix="M€" value={distributed} step={5} onChange={setDistributed} />
          <Field label="Valeur résiduelle (NAV)" suffix="M€" value={nav} step={5} onChange={setNav} />
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (Métriques <GlossaryPreview slug="lp" label="ILPA" />) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong><GlossaryPreview slug="dpi" label="DPI" /> (Cash rendu)</strong> = Distributions en numéraire ÷ Capital appelé (Paid-in). C'est la seule métrique qui mesure le vrai cash retourné aux LPs.</li>
              <li><strong><GlossaryPreview slug="rvpi" label="RVPI" /> (Valeur latente)</strong> = Valeur liquidative (<GlossaryPreview slug="tvpi" label="NAV" />) du portefeuille ÷ Capital appelé. C'est l'argent "virtuel" bloqué dans les startups non encore revendues.</li>
              <li><strong><GlossaryPreview slug="tvpi" label="TVPI" /> (Multiple Total)</strong> = DPI + RVPI. Le <GlossaryPreview slug="moic" label="MOIC" /> brut mesure la performance globale.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="DPI" value={`${formatNumber(dpi, { maximumFractionDigits: 2 })}×`} accent={accent} hint="cash rendu" />
            <Stat label="RVPI" value={`${formatNumber(rvpi, { maximumFractionDigits: 2 })}×`} hint="valeur latente" />
            <Stat label="TVPI" value={`${formatNumber(tvpi, { maximumFractionDigits: 2 })}×`} accent={accent} hint="DPI + RVPI" />
            <Stat label="MOIC (brut)" value={`${formatNumber(tvpi, { maximumFractionDigits: 2 })}×`} hint="multiple total" />
          </div>
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Réalisé vs latent (sur le TVPI)</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${tvpi ? (dpi / tvpi) * 100 : 0}%`, background: accent }} />
              <div style={{ width: `${tvpi ? (rvpi / tvpi) * 100 : 0}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-surface-variant"><span>Réalisé (DPI) {formatPercent(tvpi ? (dpi / tvpi) * 100 : 0)}</span><span>Latent (RVPI) {formatPercent(tvpi ? (rvpi / tvpi) * 100 : 0)}</span></div>
          </div>
        </>
      }
    />
  );
}

// ── 6. Fundraising scenario ─────────────────────────────────────────────────────
function FundraisingSim({ accent }: { accent: string }) {
  const [burn, setBurn] = useState(120);
  const [runway, setRunway] = useState(18);
  const [cash, setCash] = useState(200);
  const [dilution, setDilution] = useState(18);

  const needed = Math.max(burn * runway - cash, 0) / 1000; // M€
  const buffered = needed * 1.25;
  const postLow = needed > 0 ? needed / (dilution / 100) : 0;
  const postHigh = buffered > 0 ? buffered / (dilution / 100) : 0;

  return (
    <Panel
      inputs={
        <>
          <Field label="Burn mensuel" suffix="k€/mois" value={burn} step={5} onChange={setBurn} />
          <Slider label="Runway cible" value={runway} min={6} max={36} step={1} format={(v) => `${v} mois`} onChange={setRunway} />
          <Field label="Trésorerie actuelle" suffix="k€" value={cash} step={10} onChange={setCash} />
          <Slider label="Dilution acceptable" value={dilution} min={5} max={30} step={1} format={(v) => formatPercent(v, 0)} onChange={setDilution} />
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie de ciblage :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Besoin brut</strong> = (Burn mensuel cible × <GlossaryPreview slug="runway" label="Runway" /> souhaité) - Trésorerie actuelle en banque.</li>
              <li><strong>Montant ciblé à lever</strong> = Besoin brut + 25% de marge de sécurité (indispensable en Venture Capital pour absorber les aléas).</li>
              <li><strong>Valorisation <GlossaryPreview slug="pre-money" label="Post-money" /> induite</strong> = Montant à lever ÷ Dilution acceptable. La valorisation de l'entreprise est la conséquence mathématique du besoin en capital combiné à la limite de dilution que les fondateurs se fixent, pas l'inverse.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Montant à lever" value={`${formatNumber(needed, { maximumFractionDigits: 1 })} – ${formatNumber(buffered, { maximumFractionDigits: 1 })} M€`} accent={accent} hint="besoin + marge de 25 %" />
            <Stat label="Valorisation post-money" value={`${formatNumber(postLow, { maximumFractionDigits: 1 })} – ${formatNumber(postHigh, { maximumFractionDigits: 1 })} M€`} hint={`pour ${formatPercent(dilution, 0)} de dilution`} />
            <Stat label="Dépense sur le runway" value={formatCurrency(burn * runway * 1000)} hint={`${burn} k€ × ${runway} mois`} />
            <Stat label="Pre-money impliquée" value={`≈ ${formatNumber(Math.max(postLow - needed, 0), { maximumFractionDigits: 1 })} M€`} hint="post − levée" />
          </div>
        </>
      }
    />
  );
}

// ── 7. Management fees & budget simulator ────────────────────────────────────
function ManagementFeesSim({ accent }: { accent: string }) {
  const [fundSize, setFundSize] = useState(100); // M€
  const [feeRate, setFeeRate] = useState(2.0); // %
  const [teamSize, setTeamSize] = useState(5);
  const [avgSalary, setAvgSalary] = useState(120); // k€

  const {
    annualBudgetInv,
    annualBudgetHarvest,
    totalFees,
    salaryCostM,
    remainingBudgetInv,
    salaryPctInv,
    stepDownRate
  } = calculateManagementFees(fundSize, feeRate, teamSize, avgSalary);

  const feasibleTeamSize = Math.max(0, Math.floor((annualBudgetInv * 0.70 * 1000) / avgSalary));
  const alertLevel = salaryPctInv > 100 ? 'error' : salaryPctInv > 70 ? 'warning' : 'ok';

  return (
    <Panel
      inputs={
        <>
          <Slider label="Taille du fonds (Fund Size)" value={fundSize} min={5} max={500} step={5} format={(v) => formatCurrency(v * 1e6)} onChange={setFundSize} />
          <Slider label="Frais de gestion annuels" value={feeRate} min={1.0} max={3.0} step={0.1} format={(v) => formatPercent(v, 1)} onChange={setFeeRate} />
          <Slider label="Taille de l'équipe visée" value={teamSize} min={1} max={20} step={1} format={(v) => `${v} personne(s)`} onChange={setTeamSize} />
          <Slider label="Salaire moyen chargé" value={avgSalary} min={50} max={250} step={5} format={(v) => `${formatNumber(v)} k€/an`} onChange={setAvgSalary} />
        </>
      }
      results={
        <>
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5 text-xs text-surface-variant space-y-2 mb-4">
            <p className="font-semibold text-foreground">Méthodologie et Analyse (<GlossaryPreview slug="lp" label="IR" />) :</p>
            <ul className="list-inside list-disc space-y-1 mb-2">
              <li><strong>Période d'investissement (Années 1-5)</strong> : Budget = Taille du fonds × Frais (ex: 2%).</li>
              <li><strong>Période de récolte (Années 6-10)</strong> : Application du <em><GlossaryPreview slug="management-fees" label="Step-down" /></em> (baisse typique de 0.5%), simulant la baisse d'activité d'investissement.</li>
            </ul>
            <p>En pratique, pour un fonds de taille modeste, le budget annuel est très serré. En comptant 70% alloué aux salaires, vous ne pouvez rémunérer que {feasibleTeamSize} personne(s) à {avgSalary} k€/an.</p>
            <p>Lors de la période de récolte, la chute mécanique des frais force souvent l'équipe de gestion à lever rapidement un Fonds II pour pouvoir maintenir ses propres opérations à l'équilibre.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Budget annuel (Inv.)" value={formatCurrency(annualBudgetInv * 1e6)} accent={accent} hint={`Années 1-5 (${feeRate}%)`} />
            <Stat label="Budget annuel (Récolte)" value={formatCurrency(annualBudgetHarvest * 1e6)} hint={`Années 6-10 (${stepDownRate}%)`} />
            <Stat label="Frais cumulés (10 ans)" value={formatCurrency(totalFees * 1e6)} hint="Total sur la durée du fonds" />
            <Stat label="Part du budget en salaires" value={formatPercent(salaryPctInv)} accent={alertLevel === 'error' ? 'var(--error)' : alertLevel === 'warning' ? '#B0894A' : accent} hint="Sur la période d'inv. (< 70%)" />
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Répartition du budget annuel (Période d'investissement)</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${Math.min(100, salaryPctInv)}%`, background: alertLevel === 'error' ? 'var(--error)' : alertLevel === 'warning' ? '#B0894A' : accent }} />
              {remainingBudgetInv > 0 && <div style={{ width: `${(remainingBudgetInv / annualBudgetInv) * 100}%`, background: 'var(--surface-container-highest)' }} />}
            </div>
            <div className="mt-2 flex justify-between text-xs text-surface-variant">
              <span>Masse salariale : {formatPercent(salaryPctInv)}</span>
              <span>Opérations (SaaS, audits) : {formatPercent(Math.max(0, 100 - salaryPctInv))}</span>
            </div>
          </div>

          {alertLevel === 'error' && (
            <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error flex gap-3">
              <span className="font-semibold text-lg leading-none">⚠</span>
              <div>
                <p className="font-semibold">Budget dépassé !</p>
                <p className="mt-1 text-xs text-surface-variant">Le coût de votre équipe ({formatCurrency(salaryCostM * 1e6)}/an) dépasse l'intégralité du budget de la période d'investissement ({formatCurrency(annualBudgetInv * 1e6)}/an).</p>
              </div>
            </div>
          )}

          {alertLevel === 'warning' && (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] p-4 text-sm text-foreground flex gap-3">
              <span className="font-semibold text-lg leading-none">⚠</span>
              <div>
                <p className="font-semibold">Marge opérationnelle faible</p>
                <p className="mt-1 text-xs text-surface-variant">Il vous reste seulement {formatCurrency(remainingBudgetInv * 1e6)}/an pour couvrir les frais de fonctionnement.</p>
              </div>
            </div>
          )}

          {alertLevel === 'ok' && (
            <div className="rounded-xl border border-outline-variant bg-surface-container-low/60 p-4 text-sm text-surface-variant flex gap-3">
              <span className="font-semibold text-lg leading-none text-foreground">✓</span>
              <div>
                <p className="font-semibold text-foreground">Budget équilibré</p>
                <p className="mt-1 text-xs">La structure dispose de {formatCurrency(remainingBudgetInv * 1e6)}/an de marge pour ses opérations.</p>
              </div>
            </div>
          )}

        </>
      }
    />
  );
}

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

function PowerLawSim({ accent }: { accent: string }) {
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

export const SIMULATOR_COMPONENTS: Record<string, ({ accent }: { accent: string }) => ReactNode> = {
  dilution: DilutionSim,
  'pre-post-money': PrePostSim,
  ownership: OwnershipSim,
  waterfall: WaterfallSim,
  'fund-returns': FundReturnsSim,
  'fundraising-scenario': FundraisingSim,
  'management-fees': ManagementFeesSim,
  'power-law': PowerLawSim,
};


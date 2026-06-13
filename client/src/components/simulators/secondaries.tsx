import { useState } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { calculateSecondarySale, calculateContinuationFund } from '@/lib/simulators/secondaries';
import { GlossaryPreview } from '@/lib/markdown';
import { Field, Panel, Slider, Stat } from './shared';

// ── 9. Secondaries & continuation fund ───────────────────────────────────────
function SecondarySaleMode({ accent }: { accent: string }) {
  const [paidIn, setPaidIn] = useState(100);
  const [distributed, setDistributed] = useState(40);
  const [nav, setNav] = useState(120);
  const [soldPct, setSoldPct] = useState(50);
  const [discount, setDiscount] = useState(20);
  const [years, setYears] = useState(4);
  const [exitMultiple, setExitMultiple] = useState(1.6);
  const [rate, setRate] = useState(12);

  const res = calculateSecondarySale({
    paidInM: paidIn,
    distributedM: distributed,
    navM: nav,
    soldPct: soldPct / 100,
    discountPct: discount / 100,
    yearsToLiquidity: years,
    exitMultiple,
    discountRate: rate / 100,
  });

  return (
    <Panel
      inputs={
        <>
          <Field label="Capital appelé (paid-in)" suffix="M€" value={paidIn} step={5} onChange={setPaidIn} />
          <Field label="Distributions déjà versées" suffix="M€" value={distributed} step={5} onChange={setDistributed} />
          <Field label="Valeur résiduelle (NAV)" suffix="M€" value={nav} step={5} onChange={setNav} />
          <Slider label="Part de la NAV cédée" value={soldPct} min={5} max={100} step={5} format={(v) => formatPercent(v, 0)} onChange={setSoldPct} />
          <Slider label="Décote sur la NAV" value={discount} min={0} max={50} step={1} format={(v) => formatPercent(v, 0)} onChange={setDiscount} />
          <Slider label="Années avant la liquidité naturelle" value={years} min={1} max={8} step={1} format={(v) => `${v} an${v > 1 ? 's' : ''}`} onChange={setYears} />
          <Slider label="Multiple attendu sur la NAV à l'exit" value={exitMultiple} min={0.5} max={4} step={0.1} format={(v) => `${formatNumber(v, { maximumFractionDigits: 1 })}×`} onChange={setExitMultiple} />
          <Slider label="Taux d'actualisation du LP" value={rate} min={0} max={25} step={1} format={(v) => formatPercent(v, 0)} onChange={setRate} />
          <p className="text-[0.625rem] leading-relaxed text-surface-variant">
            Repères : les parts de fonds VC se traitent historiquement avec une décote de 15 à 40 % de la NAV selon le millésime, la qualité du portefeuille et le niveau des taux. Le multiple attendu sur la NAV traduit votre confiance dans les marks du GP : 1× = les marks se réalisent telles quelles.
          </p>
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (vente <GlossaryPreview slug="secondary" label="secondaire" /> LP-led) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Produit de la vente</strong> = NAV cédée × (1 − décote). La décote est le prix de la liquidité immédiate.</li>
              <li><strong><GlossaryPreview slug="dpi" label="DPI" /> après vente</strong> = (distributions + produit) ÷ paid-in. La vente convertit du <GlossaryPreview slug="rvpi" label="RVPI" /> (latent) en DPI (réalisé) — en abandonnant la décote au passage.</li>
              <li><strong>Point mort vendre/conserver</strong> = (1 − décote) × (1 + taux)^années. Si le multiple attendu sur la NAV à l'exit dépasse ce seuil, conserver domine en valeur actuelle ; sinon, vendre domine.</li>
              <li><strong>Limites</strong> : décote uniforme sur la part cédée, pas de capital restant à appeler, marks du GP prises comme référence. Le taux d'actualisation capture votre coût d'opportunité — y compris la possibilité de redéployer le cash dans un nouveau millésime.</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Produit de la vente" value={formatCurrency(res.proceedsM * 1e6)} accent={accent} hint={`${formatPercent(100 - discount, 0)} de la NAV cédée`} />
            <Stat label="Valeur abandonnée" value={formatCurrency(res.haircutM * 1e6)} hint="la décote, en euros" />
            <Stat label="DPI avant → après" value={`${formatNumber(res.dpiBefore, { maximumFractionDigits: 2 })}× → ${formatNumber(res.dpiAfter, { maximumFractionDigits: 2 })}×`} accent={accent} hint="cash réellement rendu" />
            <Stat label="TVPI avant → après" value={`${formatNumber(res.tvpiBefore, { maximumFractionDigits: 2 })}× → ${formatNumber(res.tvpiAfter, { maximumFractionDigits: 2 })}×`} hint="aux marks actuelles" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Point mort (multiple d'exit)" value={`${formatNumber(res.breakEvenMultiple, { maximumFractionDigits: 2 })}×`} accent={accent} hint="seuil d'indifférence vendre/conserver" />
            <Stat label="Conserver (valeur actuelle)" value={formatCurrency(res.pvHoldM * 1e6)} hint={`exit à ${formatNumber(exitMultiple, { maximumFractionDigits: 1 })}× dans ${years} an${years > 1 ? 's' : ''}, actualisé`} />
            <Stat label="Vendre (valeur actuelle)" value={formatCurrency(res.pvSellM * 1e6)} hint="cash immédiat" />
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-low/60 p-4 text-sm flex gap-3">
            <span className="font-semibold text-lg leading-none" style={{ color: accent }}>{res.holdWins ? '⏳' : '✓'}</span>
            <div>
              <p className="font-semibold text-foreground">{res.holdWins ? 'Conserver domine — sur le papier' : 'Vendre domine'}</p>
              <p className="mt-1 text-xs text-surface-variant">
                {res.holdWins
                  ? `À ${formatNumber(exitMultiple, { maximumFractionDigits: 1 })}× attendu contre un point mort de ${formatNumber(res.breakEvenMultiple, { maximumFractionDigits: 2 })}×, conserver vaut ${formatCurrency((res.pvHoldM - res.pvSellM) * 1e6)} de plus en valeur actuelle. C'est tout le dilemme de la pression DPI : la vente détruit de la valeur attendue, mais elle rend du cash mesurable aujourd'hui — et c'est ce cash que les LPs regardent avant de re-souscrire au fonds suivant.`
                  : `Le multiple attendu (${formatNumber(exitMultiple, { maximumFractionDigits: 1 })}×) est sous le point mort (${formatNumber(res.breakEvenMultiple, { maximumFractionDigits: 2 })}×) : la décote coûte moins cher que d'attendre. Vendre rend ${formatCurrency(res.proceedsM * 1e6)} aujourd'hui et fait passer le DPI de ${formatNumber(res.dpiBefore, { maximumFractionDigits: 2 })}× à ${formatNumber(res.dpiAfter, { maximumFractionDigits: 2 })}×.`}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Réalisé vs latent — avant et après la vente (sur le paid-in)</p>
            <div className="space-y-3">
              {[
                { label: 'Avant', dpi: res.dpiBefore, rvpi: res.tvpiBefore - res.dpiBefore },
                { label: 'Après', dpi: res.dpiAfter, rvpi: res.rvpiAfter },
              ].map((row) => {
                const totalScale = Math.max(res.tvpiBefore, res.tvpiAfter, 0.01);
                return (
                  <div key={row.label}>
                    <div className="flex h-3 overflow-hidden rounded-full">
                      <div style={{ width: `${(row.dpi / totalScale) * 100}%`, background: accent }} />
                      <div style={{ width: `${(row.rvpi / totalScale) * 100}%`, background: 'var(--surface-container-highest)' }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[0.625rem] text-surface-variant">
                      <span>{row.label} — DPI {formatNumber(row.dpi, { maximumFractionDigits: 2 })}×</span>
                      <span>RVPI {formatNumber(row.rvpi, { maximumFractionDigits: 2 })}×</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      }
    />
  );
}

function ContinuationFundMode({ accent }: { accent: string }) {
  const [assetNav, setAssetNav] = useState(100);
  const [pricing, setPricing] = useState(90);
  const [costBasis, setCostBasis] = useState(40);
  const [rollover, setRollover] = useState(30);
  const [carry, setCarry] = useState(20);
  const [newFee, setNewFee] = useState(1.5);
  const [horizon, setHorizon] = useState(5);
  const [exitMultiple, setExitMultiple] = useState(1.8);

  const res = calculateContinuationFund({
    assetNavM: assetNav,
    pricingPctOfNav: pricing / 100,
    costBasisM: costBasis,
    rolloverPct: rollover / 100,
    carryPct: carry / 100,
    newFeeRate: newFee / 100,
    horizonYears: horizon,
    exitMultiple,
  });

  return (
    <Panel
      inputs={
        <>
          <Field label="NAV de l'actif transféré" suffix="M€" value={assetNav} step={5} onChange={setAssetNav} />
          <Slider label="Prix de transaction (% de la NAV)" value={pricing} min={60} max={110} step={1} format={(v) => formatPercent(v, 0)} onChange={setPricing} />
          <Field label="Coût d'acquisition initial" suffix="M€" value={costBasis} step={5} onChange={setCostBasis} />
          <Slider label="LPs existants qui roulent" value={rollover} min={0} max={100} step={5} format={(v) => formatPercent(v, 0)} onChange={setRollover} />
          <Slider label="Carried interest" value={carry} min={0} max={30} step={1} format={(v) => formatPercent(v, 0)} onChange={setCarry} />
          <Slider label="Frais du continuation fund" value={newFee} min={0} max={2.5} step={0.25} format={(v) => formatPercent(v, 2)} onChange={setNewFee} />
          <Slider label="Horizon du continuation fund" value={horizon} min={2} max={8} step={1} format={(v) => `${v} ans`} onChange={setHorizon} />
          <Slider label="Multiple attendu sur la NAV à l'exit" value={exitMultiple} min={0.5} max={4} step={0.1} format={(v) => `${formatNumber(v, { maximumFractionDigits: 1 })}×`} onChange={setExitMultiple} />
          <p className="text-[0.625rem] leading-relaxed text-surface-variant">
            Repères : les GP-led se traitent typiquement entre 80 et 100 % de la NAV (parfois avec prime sur un actif trophée). Les LPs existants ont le choix : sortir en cash au prix de transaction, ou rouler dans le nouveau véhicule. Le statu quo varie selon les deals — vérifiez toujours l'option par défaut.
          </p>
        </>
      }
      results={
        <>
          <div className="rounded-xl bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant mb-4">
            <p className="font-semibold text-foreground mb-1">Méthodologie (<GlossaryPreview slug="continuation-fund" label="continuation fund" /> GP-led) :</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Mécanique</strong> : le GP vend un actif de son fonds… à un nouveau véhicule qu'il gère aussi. Des investisseurs secondaires apportent le cash ; les LPs existants choisissent entre sortir (cash) et rouler.</li>
              <li><strong>Carry cristallisé</strong> = (prix de transaction − coût d'acquisition) × carry. Le GP encaisse son carry au closing, sur une vente dont il a fixé le prix. Dans la pratique, une partie de ce carry est souvent roulée dans le nouveau véhicule — exigence fréquente des acheteurs pour l'alignement.</li>
              <li><strong>LP qui roule</strong> : repart au prix de transaction, paie les frais du nouveau véhicule, et subit un <em>second</em> carry sur la plus-value future. Multiple net = (valeur d'exit − second carry − frais cumulés) × sa quote-part ÷ montant roulé.</li>
              <li><strong>Limites</strong> : carry deal-by-deal sans hurdle, frais calculés sur le prix de transaction, pas de structure en tranches. Les vrais deals ajoutent hurdle rate, tiering du carry et clauses de statu quo.</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Prix de transaction" value={formatCurrency(res.transactionPriceM * 1e6)} accent={accent} hint={`${formatPercent(pricing, 0)} de la NAV`} />
            <Stat label="Cash aux LPs sortants" value={formatCurrency(res.cashToSellersM * 1e6)} hint={`récupèrent ${formatPercent(res.sellerRecoveryPct * 100, 0)} de la NAV, net`} />
            <Stat label="Montant roulé" value={formatCurrency(res.rolledM * 1e6)} hint={`${formatPercent(rollover, 0)} des LPs existants`} />
            <Stat label="Multiple net du LP qui roule" value={`${formatNumber(res.rollerNetMultiple, { maximumFractionDigits: 2 })}×`} accent={accent} hint={`à l'exit dans ${horizon} ans`} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Carry cristallisé (closing)" value={formatCurrency(res.crystallizedCarryM * 1e6)} hint="GP, jour 1" />
            <Stat label="Second carry (exit)" value={formatCurrency(res.secondCarryM * 1e6)} hint="GP, sur la plus-value du CV" />
            <Stat label="Frais cumulés du CV" value={formatCurrency(res.cvFeesM * 1e6)} hint={`${formatPercent(newFee, 2)} × ${horizon} ans`} />
            <Stat label="Total GP sur l'opération" value={formatCurrency(res.gpTotalTakeM * 1e6)} accent={accent} hint="2 carries + frais" />
          </div>

          <div className="rounded-xl border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] p-4 text-sm text-foreground flex gap-3">
            <span className="font-semibold text-lg leading-none">⚠</span>
            <div>
              <p className="font-semibold">Le conflit d'intérêts structurel</p>
              <p className="mt-1 text-xs text-surface-variant">
                Le GP est des deux côtés de la table : vendeur (pour ses LPs existants) et acheteur (pour le nouveau véhicule). Il fixe le prix, encaisse {formatCurrency(res.crystallizedCarryM * 1e6)} de carry au closing, puis perçoit frais et second carry sur le même actif. C'est pourquoi l'ILPA recommande fairness opinion indépendante, validation par le LP Advisory Committee et délai suffisant pour l'élection des LPs.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <p className="mb-3 text-xs text-surface-variant">Répartition de la valeur d'exit du continuation fund ({formatCurrency(res.exitValueM * 1e6)})</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${res.exitValueM ? Math.min(100, ((res.exitValueM - res.secondCarryM - res.cvFeesM) / res.exitValueM) * 100) : 0}%`, background: accent }} />
              <div style={{ width: `${res.exitValueM ? (res.cvFeesM / res.exitValueM) * 100 : 0}%`, background: 'color-mix(in srgb, var(--primary) 35%, var(--surface-container-highest))' }} />
              <div style={{ width: `${res.exitValueM ? (res.secondCarryM / res.exitValueM) * 100 : 0}%`, background: 'var(--surface-container-highest)' }} />
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-surface-variant">
              <span>Investisseurs du CV {formatCurrency(Math.max(res.exitValueM - res.secondCarryM - res.cvFeesM, 0) * 1e6)}</span>
              <span>Frais {formatCurrency(res.cvFeesM * 1e6)}</span>
              <span>Second carry {formatCurrency(res.secondCarryM * 1e6)}</span>
            </div>
          </div>
        </>
      }
    />
  );
}

export function SecondariesSim({ accent }: { accent: string }) {
  const [mode, setMode] = useState<'sale' | 'continuation'>('sale');
  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-xl border border-outline-variant bg-surface-container-low p-1 text-sm">
        {([
          ['sale', 'Vente secondaire (LP-led)'],
          ['continuation', 'Continuation fund (GP-led)'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`rounded-lg px-4 py-2 transition-colors ${mode === key ? 'bg-surface-container-lowest font-medium text-foreground shadow-sm' : 'text-surface-variant hover:text-foreground'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="max-w-3xl text-xs leading-relaxed text-surface-variant">
        {mode === 'sale'
          ? 'Vous êtes un LP (ou un GP qui vend une ligne) : le marché secondaire offre du cash immédiat contre une décote sur la NAV. L\'outil chiffre le saut de DPI, le TVPI sacrifié, et le point mort au-delà duquel attendre l\'exit naturel rapporte plus que vendre.'
          : 'Vous êtes un LP face à une élection de continuation fund : le GP transfère un actif vers un nouveau véhicule qu\'il gère aussi. L\'outil chiffre ce que touche le LP qui sort, ce que gagne (ou perd) le LP qui roule, et ce que le GP capte au passage — carry cristallisé, second carry, frais.'}
      </p>
      {mode === 'sale' ? <SecondarySaleMode accent={accent} /> : <ContinuationFundMode accent={accent} />}
    </div>
  );
}

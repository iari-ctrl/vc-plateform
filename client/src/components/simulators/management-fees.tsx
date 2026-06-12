import { useState } from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { calculateManagementFees } from '@/lib/simulators/management-fees';
import { GlossaryPreview } from '@/lib/markdown';
import { Panel, Slider, Stat } from './shared';

// ── 7. Management fees & budget simulator ────────────────────────────────────
export function ManagementFeesSim({ accent }: { accent: string }) {
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

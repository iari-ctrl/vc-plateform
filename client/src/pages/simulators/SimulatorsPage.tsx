import { BriefcaseBusiness, ChartPie, Coins, NotebookPen, type LucideIcon } from 'lucide-react';
import { SimulatorCard } from '@/components/cards';
import { SIMULATORS } from '@/content/simulators';
import type { Simulator } from '@/content/types';
import { usePageMeta } from '@/lib/seo';

const decisions = {
  financement: { title: 'Préparer une levée', icon: Coins },
  fonds: { title: 'Piloter un fonds', icon: ChartPie },
  cession: { title: 'Évaluer une cession', icon: BriefcaseBusiness },
  comite: { title: 'Préparer le comité', icon: NotebookPen },
} satisfies Record<Simulator['decision'], { title: string; icon: LucideIcon }>;

const sections = Object.entries(decisions).map(([id, decision]) => ({
  id,
  ...decision,
  tools: SIMULATORS.filter(sim => sim.decision === id),
}));
const calculatorCount = SIMULATORS.filter(sim => sim.id !== 'investment-memo').length;

export default function SimulatorsPage() {
  usePageMeta('Simulateurs', 'Calculez une dilution, préparez une levée, évaluez un fonds ou rédigez une note d’investissement.');
  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 pb-12 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b-2 border-secondary pb-5 sm:mb-5">
        <h1 className="font-headline text-display-md font-semibold tracking-tight sm:text-display-lg">Simulateurs</h1>
        <p className="text-sm text-surface-variant sm:text-base">{calculatorCount} calculateurs et un outil de rédaction</p>
      </header>

      {sections.map(({ id, title, icon: Icon, tools }) => (
        <section key={id} aria-labelledby={id} className="border-b border-outline-variant pb-4 pt-5 first-of-type:pt-0 sm:pb-5 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-6 lg:pb-3 lg:pt-3">
          <div className="flex items-center gap-2.5 pb-2 lg:block lg:pt-3">
            <span className="inline-grid size-8 shrink-0 place-items-center rounded-full bg-primary-container text-primary-container-foreground lg:mb-2">
              <Icon size={17} strokeWidth={1.6} aria-hidden />
            </span>
            <h2 id={id} className="font-headline text-headline-md font-medium leading-tight text-secondary lg:text-[1.7rem]">{title}</h2>
          </div>
          <ul className="min-w-0 divide-y divide-outline-variant">
            {tools.map(sim => <li key={sim.id}><SimulatorCard sim={sim} /></li>)}
          </ul>
        </section>
      ))}
    </div>
  );
}

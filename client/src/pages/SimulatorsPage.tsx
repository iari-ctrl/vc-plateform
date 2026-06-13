import { SIMULATORS } from '@/content';
import { SimulatorCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';

export default function SimulatorsPage() {
  usePageMeta('Simulateurs', 'Dilution, valorisation, waterfall, fund returns : manipulez la mécanique financière du venture.');
  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading eyebrow="Apprendre en manipulant" title="Simulateurs" description="On ne comprend vraiment la dilution ou une waterfall qu’en jouant avec les chiffres. Aucun compte requis — testez librement." />
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SIMULATORS.map((s, i) => (
          <Reveal key={s.id} delay={(i % 3) * 70}>
            <SimulatorCard sim={s} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

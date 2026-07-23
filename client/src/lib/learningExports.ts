import type { Deliverable, DeliverableCriterion } from '@/content/types';

function criterionId(criterion: DeliverableCriterion, index: number): string {
  return criterion.id ?? `criterion-${index + 1}`;
}

export function buildWorksheetMarkdown(
  deliverable: Deliverable,
  note: string,
  externalFileProduced: boolean,
): string {
  const sections = deliverable.template.map((section, index) => (
    `## ${index + 1}. ${section.heading}\n\n${section.prompt}\n\n### Travail\n\n`
  ));
  const components = (deliverable.components ?? []).map((component) => (
    `## ${component.title}\n\n${component.requirements.map((requirement) => `- [ ] ${requirement}`).join('\n')}\n`
  ));
  return [
    `# ${deliverable.title}`,
    '',
    deliverable.summary,
    '',
    `Fichier produit hors plateforme : ${externalFileProduced ? 'oui' : 'non'}`,
    '',
    '## Note de travail',
    '',
    note || '_À compléter._',
    '',
    ...components,
    ...sections,
  ].join('\n');
}

export function buildReviewMarkdown(
  deliverable: Deliverable,
  ratings: Record<string, string>,
  audience: 'self' | 'external',
): string {
  const levels = Object.fromEntries((deliverable.rubricLevels ?? []).map((level) => [level.id, level.label]));
  const title = audience === 'self' ? 'Autoévaluation' : 'Grille de revue externe';
  const introduction = audience === 'self'
    ? 'Cette autoévaluation accompagne la révision de la production. Les niveaux restent qualitatifs et ne sont pas agrégés.'
    : 'Cette fiche peut être transmise à un pair ou à un praticien. La revue est facultative, externe à la plateforme et sans effet certificatif.';

  return [
    `# ${title} · ${deliverable.title}`,
    '',
    introduction,
    '',
    ...(deliverable.rubric ?? []).flatMap((criterion, index) => {
      const id = criterionId(criterion, index);
      return [
        `## ${criterion.criterion}`,
        '',
        `Niveau : ${levels[ratings[id]] ?? ratings[id] ?? 'Non renseigné'}`,
        '',
        `Description observable : ${criterion.description ?? criterion.check ?? 'Non renseignée'}`,
        '',
        `Preuve attendue : ${criterion.expectedEvidence ?? 'Non renseignée'}`,
        '',
        `Erreur fréquente : ${criterion.commonError ?? 'Non renseignée'}`,
        '',
        `Question de révision : ${criterion.revisionQuestion ?? 'Non renseignée'}`,
        '',
        'Commentaire :',
        '',
      ];
    }),
  ].join('\n');
}

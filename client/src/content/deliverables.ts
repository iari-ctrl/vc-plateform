import deliverablesJson from '@data/deliverables.json';
import type { TimeBudget } from './parcoursTypes';
import type { Deliverable, DeliverableComponent, DeliverableCriterion, DeliverableTemplateSection } from './types';

export const DELIVERABLES = deliverablesJson as unknown as Deliverable[];

export const deliverableBySlug = (slug: string) => DELIVERABLES.find((d) => d.slug === slug);
export const deliverableById = (id: string) => DELIVERABLES.find((d) => d.id === id);

export function isDeliverableComponentRequiredForBudget(component: DeliverableComponent, budget?: TimeBudget): boolean {
  if (!budget) return true;
  return !component.requiredInBudgets || component.requiredInBudgets.includes(budget);
}

export function isDeliverableComponentOptionalInDirectAccess(component: DeliverableComponent, budget?: TimeBudget): boolean {
  return !budget && component.requiredInBudgets?.length === 1 && component.requiredInBudgets[0] === 'high';
}

export function selectDeliverableComponents(deliverable: Deliverable, budget?: TimeBudget): DeliverableComponent[] {
  return (deliverable.components ?? []).filter((component) => isDeliverableComponentRequiredForBudget(component, budget));
}

function selectedComponentIds(deliverable: Deliverable, budget?: TimeBudget): Set<string> {
  return new Set(selectDeliverableComponents(deliverable, budget).map((component) => component.id));
}

export function selectDeliverableTemplateSections(deliverable: Deliverable, budget?: TimeBudget): DeliverableTemplateSection[] {
  const componentIds = selectedComponentIds(deliverable, budget);
  return deliverable.template.filter((_, index) => {
    const component = deliverable.components?.[index];
    return !component || componentIds.has(component.id);
  });
}

export function selectDeliverableCriteria(deliverable: Deliverable, budget?: TimeBudget): DeliverableCriterion[] {
  if (!budget) return deliverable.rubric;
  const componentIds = selectedComponentIds(deliverable, budget);
  return deliverable.rubric.filter((criterion) => (
    !criterion.componentIds || criterion.componentIds.some((componentId) => componentIds.has(componentId))
  ));
}

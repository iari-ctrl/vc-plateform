import { resolveStep, visibleSteps, type Parcours, type ParcoursStep, type StepRefKind, type TimeBudget } from '@/content/parcours';
import type { ProgressEntry } from '@/content/types';
import {
  isLearningActivityComplete,
  productionStageAtLeast,
  type LearningWorkspaceState,
} from './learningWorkspace';

export interface ParcoursProgressStep {
  step: ParcoursStep;
  ref: ParcoursStep['ref'];
  href: string | null;
  visible: boolean;
  completed: boolean;
}

export interface ParcoursStepNavigationItem {
  step: ParcoursStep;
  ref: ParcoursStep['ref'];
  href: string;
  title: string;
}

export interface ParcoursStepNavigationSummary {
  current: ParcoursStepNavigationItem;
  previous?: ParcoursStepNavigationItem;
  next?: ParcoursStepNavigationItem;
}

export interface ParcoursProgressSummary {
  budget: TimeBudget;
  steps: ParcoursProgressStep[];
  totalSteps: number;
  completedSteps: number;
  percent: number;
  resumeStep?: ParcoursStep;
  resumeHref?: string;
}

function resolvedLessonIds(step: ParcoursStep): string[] {
  const resolved = resolveStep(step);
  return resolved.lessonIds ?? (resolved.lessonId ? [resolved.lessonId] : []);
}

export function parcoursStepMatches(step: ParcoursStep, kind: StepRefKind, id: string): boolean {
  return step.ref.kind === kind && step.ref.id === id;
}

export function isParcoursStepComplete(
  parcoursId: string,
  step: ParcoursStep,
  progress: Record<string, ProgressEntry>,
  workspace: LearningWorkspaceState,
): boolean {
  const lessonIds = resolvedLessonIds(step);
  if (lessonIds.length > 0) return lessonIds.every((lessonId) => progress[lessonId]?.status === 'done');

  if (step.ref.kind === 'case' || step.ref.kind === 'simulator') {
    return isLearningActivityComplete(workspace, parcoursId, step.ref.kind, step.ref.id);
  }

  if (step.ref.kind === 'milestone') {
    return Boolean(workspace.productions[step.ref.id]?.declaredCompleteAt);
  }

  if (step.ref.kind === 'deliverable') {
    const production = workspace.productions[step.ref.id];
    return Boolean(production?.declaredCompleteAt) || productionStageAtLeast(production?.stage, 'revised');
  }

  return false;
}

function progressStep(
  parcours: Parcours,
  step: ParcoursStep,
  progress: Record<string, ProgressEntry>,
  workspace: LearningWorkspaceState,
): ParcoursProgressStep {
  return {
    step,
    ref: step.ref,
    href: resolveStep(step).href,
    visible: true,
    completed: isParcoursStepComplete(parcours.id, step, progress, workspace),
  };
}

export function buildParcoursProgressSummary(
  parcours: Parcours,
  budget: TimeBudget,
  progress: Record<string, ProgressEntry>,
  workspace: LearningWorkspaceState,
): ParcoursProgressSummary {
  const visible = visibleSteps(parcours, budget).map((step) => progressStep(parcours, step, progress, workspace));
  const reachable = visible.filter((step) => Boolean(step.href));
  const completedSteps = reachable.filter((step) => step.completed).length;
  const resume = reachable.find((step) => !step.completed);
  return {
    budget,
    steps: visible,
    totalSteps: reachable.length,
    completedSteps,
    percent: reachable.length ? Math.round((completedSteps / reachable.length) * 100) : 0,
    resumeStep: resume?.step,
    resumeHref: resume?.href ?? undefined,
  };
}

function navigationItem(step: ParcoursStep): ParcoursStepNavigationItem | undefined {
  const href = resolveStep(step).href;
  if (!href) return undefined;
  return { step, ref: step.ref, href, title: step.label };
}

function adjacentItem(steps: ParcoursStep[], fromIndex: number, direction: -1 | 1): ParcoursStepNavigationItem | undefined {
  for (let index = fromIndex + direction; index >= 0 && index < steps.length; index += direction) {
    const item = navigationItem(steps[index]);
    if (item) return item;
  }
  return undefined;
}

export function parcoursStepNavigation(
  parcours: Parcours,
  budget: TimeBudget,
  kind: StepRefKind,
  id: string,
): ParcoursStepNavigationSummary | null {
  if (!parcours.timeFit.includes(budget)) return null;
  const steps = visibleSteps(parcours, budget);
  const index = steps.findIndex((step) => parcoursStepMatches(step, kind, id));
  if (index < 0) return null;
  const current = navigationItem(steps[index]);
  if (!current) return null;
  return {
    current,
    previous: adjacentItem(steps, index, -1),
    next: adjacentItem(steps, index, 1),
  };
}

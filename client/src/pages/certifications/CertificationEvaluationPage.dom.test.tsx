// @vitest-environment jsdom
import '@/test/setupDom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import CertificationEvaluationPage from './CertificationEvaluationPage';

const fixtures = vi.hoisted(() => {
  const certification = {
    id: 'cert-knowledge',
    slug: 'knowledge-cert',
    shortTitle: 'Certification test',
    certificateType: 'knowledge',
    candidateCharterId: 'charter-1',
    candidateCharterVersion: '1.0.0',
  };

  const assessment = {
    id: 'assessment-1',
    status: 'published',
    version: '1.0.0',
    certificationId: 'cert-knowledge',
    candidateCharterId: 'charter-1',
    candidateCharterVersion: '1.0.0',
    title: 'Évaluation test',
    description: 'Description de l’évaluation.',
    competencies: [{ id: 'competency-1', label: 'Compétence' }],
    exam: {
      title: 'QCM',
      instructions: 'Répondez aux questions.',
      points: 10,
      questionCount: 1,
      questionsPerCompetency: 1,
      shuffleQuestions: true,
      consultationPolicy: 'not-recommended',
      questions: [{
        id: 'question-1',
        competencyId: 'competency-1',
        prompt: 'Question ?',
        options: [
          { id: 'option-1', label: 'Réponse 1' },
          { id: 'option-2', label: 'Réponse 2' },
        ],
        correctOptionId: 'option-1',
        points: 10,
        explanation: 'Explication.',
      }],
    },
    miniCases: [],
    passingRules: { totalMin: 5, examMin: 5, caseMinEach: 0 },
    resourcePolicy: { exam: 'Sans ressource.', miniCases: 'Sans objet.' },
    attemptPolicy: {
      unlimited: true,
      timer: false,
      technicalLocking: false,
      persistActiveAttempt: true,
      submittedHistoryLimit: 5,
      preserveBestResult: true,
      shuffleOncePerAttempt: true,
    },
    toolDeclaration: {
      required: true,
      prompt: 'Décrivez les outils utilisés ou prévus.',
      choices: ['Aucun', 'Calculatrice'],
      allowFreeText: true,
    },
  };

  const charter = {
    id: 'charter-1',
    version: '1.0.0',
    status: 'active',
    title: 'Charte test',
    effectiveDate: '2026-07-23',
    introduction: 'Introduction.',
    principles: [{
      id: 'authenticity',
      title: 'Authenticité',
      statement: 'Déclaration sincère.',
    }],
    acceptanceStatement: 'J’accepte la charte du candidat.',
    futureSessionAnnex: { status: 'inactive', title: 'Annexe inactive', provisions: [] },
  };

  return { certification, assessment, charter };
});

vi.mock('@/content/certifications', () => ({
  certificationBySlug: (slug: string) => (slug === fixtures.certification.slug ? fixtures.certification : undefined),
}));

vi.mock('@/content/certificationAssessments', () => ({
  assessmentForCertification: (certificationId: string) => (
    certificationId === fixtures.certification.id ? fixtures.assessment : undefined
  ),
  resolveCertificationEvaluationState: (
    certificateType: string | undefined,
    assessment: { status?: string } | undefined,
    hasActiveCharter: boolean,
  ) => {
    if (!certificateType) return 'unknown';
    if (certificateType !== 'knowledge') return 'unsupported-type';
    if (!assessment || assessment.status !== 'published' || !hasActiveCharter) return 'unavailable';
    return 'available';
  },
}));

vi.mock('@/content/candidateCharters', () => ({
  candidateCharterByIdVersion: (id: string, version: string) => (
    id === fixtures.charter.id && version === fixtures.charter.version ? fixtures.charter : undefined
  ),
}));

function renderEvaluation() {
  return render(
    <MemoryRouter initialEntries={[`/certifications/${fixtures.certification.slug}/evaluation`]}>
      <Routes>
        <Route path="/certifications/:slug/evaluation" element={<CertificationEvaluationPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CertificationEvaluationPage — erreurs de champs', () => {
  it('relie les erreurs de démarrage aux champs concernés', async () => {
    const user = userEvent.setup();
    renderEvaluation();

    await user.click(screen.getByRole('button', { name: /commencer l'évaluation/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/complétez la déclaration/i);
    expect(screen.getByRole('textbox', { name: /outils utilisés ou prévus/i })).toHaveAccessibleDescription(/décrivez les outils/i);
    expect(screen.getByRole('textbox', { name: /outils utilisés ou prévus/i })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('checkbox', { name: /j’accepte la charte/i })).toHaveAccessibleDescription(/acceptez la charte/i);
    expect(screen.getByRole('checkbox', { name: /déclaration est complète/i })).toHaveAccessibleDescription(/confirmez la déclaration/i);
  });
});

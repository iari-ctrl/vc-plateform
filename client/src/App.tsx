import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import SplashPage from '@/pages/home/SplashPage';
import { PageLoader } from '@/components/ui/primitives';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const HomePage = lazy(() => import('@/pages/home/HomePage'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/OnboardingPage'));
const IkigaiPage = lazy(() => import('@/pages/onboarding/IkigaiPage'));
const ProfileResultPage = lazy(() => import('@/pages/onboarding/ProfileResultPage'));
const DashboardPage = lazy(() => import('@/pages/workspace/DashboardPage'));
const ParcoursPage = lazy(() => import('@/pages/learn/ParcoursPage'));
const ParcoursDetailPage = lazy(() => import('@/pages/learn/ParcoursDetailPage'));
const ParcoursDiagnosticPage = lazy(() => import('@/pages/learn/ParcoursDiagnosticPage'));
const CertificationsPage = lazy(() => import('@/pages/certifications/CertificationsPage'));
const CertificationLevelsPage = lazy(() => import('@/pages/certifications/CertificationLevelsPage'));
const CertificationDetailPage = lazy(() => import('@/pages/certifications/CertificationDetailPage'));
const CertificationEvaluationPage = lazy(() => import('@/pages/certifications/CertificationEvaluationPage'));
const LibraryPage = lazy(() => import('@/pages/learn/LibraryPage'));
const CourseDetailPage = lazy(() => import('@/pages/learn/CourseDetailPage'));
const LessonPage = lazy(() => import('@/pages/learn/LessonPage'));
const GlossaryPage = lazy(() => import('@/pages/glossary/GlossaryPage'));
const CaseStudyPage = lazy(() => import('@/pages/cases/CaseStudyPage'));
const CaseCorrectionPage = lazy(() => import('@/pages/cases/CaseCorrectionPage'));
const IntelligencePage = lazy(() => import('@/pages/intelligence/IntelligencePage'));
const ConvictionsPage = lazy(() => import('@/pages/intelligence/ConvictionsPage'));
const DecisionsIndexPage = lazy(() => import('@/pages/intelligence/DecisionsIndexPage'));
const MethodePage = lazy(() => import('@/pages/intelligence/MethodePage'));
const DeliverablesPage = lazy(() => import('@/pages/intelligence/DeliverablesPage'));
const DeliverablePage = lazy(() => import('@/pages/intelligence/DeliverablePage'));
const SimulatorsPage = lazy(() => import('@/pages/simulators/SimulatorsPage'));
const SimulatorPage = lazy(() => import('@/pages/simulators/SimulatorPage'));
const AntiPortfolioPage = lazy(() => import('@/pages/intelligence/AntiPortfolioPage'));
const AntiPortfolioEntryPage = lazy(() => import('@/pages/intelligence/AntiPortfolioEntryPage'));
const MemoLibraryPage = lazy(() => import('@/pages/intelligence/MemoLibraryPage'));
const MemoPage = lazy(() => import('@/pages/intelligence/MemoPage'));
const BlogPage = lazy(() => import('@/pages/blog/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/blog/BlogPostPage'));
const EcosystemsPage = lazy(() => import('@/pages/ecosystems/EcosystemsPage'));
const EcosystemPage = lazy(() => import('@/pages/ecosystems/EcosystemPage'));
const NotesPage = lazy(() => import('@/pages/workspace/NotesPage'));
const DecisionJournalPage = lazy(() => import('@/pages/workspace/DecisionJournalPage'));
const ProfilePage = lazy(() => import('@/pages/onboarding/ProfilePage'));
const SearchPage = lazy(() => import('@/pages/search/SearchPage'));
const DesignSystemShowcasePage = import.meta.env.DEV
  ? lazy(() => import('@/pages/system/DesignSystemShowcasePage'))
  : undefined;
const NotFoundPage = lazy(() => import('@/pages/system/NotFoundPage'));

export function PageFallback() {
  return <PageLoader label="Chargement de la page…" />;
}

/**
 * Layout route that wraps routed pages in a single Suspense (for the lazy
 * chunks) and an ErrorBoundary keyed on the pathname, then renders the matched
 * page through <Outlet/>. A pathless layout route keeps one flat route tree,
 * which is what React Router expects and what lets the data/loader APIs work
 * later.
 */
function PageShell() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary resetKey={pathname}>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

import { MainLayout } from '@/layouts/MainLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<SplashPage />} />
        <Route element={<PageShell />}>
          <Route path="home" element={<HomePage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="ikigai" element={<IkigaiPage />} />
          <Route path="profile-result" element={<ProfileResultPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="parcours" element={<ParcoursPage />} />
          <Route path="parcours/:slug" element={<ParcoursDetailPage />} />
          <Route path="parcours/:slug/diagnostic" element={<ParcoursDiagnosticPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="certifications/niveaux" element={<CertificationLevelsPage />} />
          <Route path="certifications/venture-philanthropy-foundations/evaluation" element={<Navigate to="/parcours/venture-philanthropy-foundations" replace />} />
          <Route path="certifications/venture-philanthropy-foundations" element={<Navigate to="/parcours/venture-philanthropy-foundations" replace />} />
          <Route path="certifications/analyst-foundations/evaluation" element={<Navigate to="/parcours/analyst-foundations" replace />} />
          <Route path="certifications/analyst-foundations" element={<Navigate to="/parcours/analyst-foundations" replace />} />
          <Route path="certifications/:slug/evaluation" element={<CertificationEvaluationPage />} />
          <Route path="certifications/:slug" element={<CertificationDetailPage />} />
          <Route path="bibliotheque" element={<LibraryPage />} />
          <Route path="bibliotheque/:slug" element={<Navigate to="/bibliotheque" replace />} />
          <Route path="courses/:slug" element={<CourseDetailPage />} />
          <Route path="lessons/:slug" element={<LessonPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="glossary/:slug" element={<GlossaryPage />} />
          <Route path="intelligence" element={<IntelligencePage />} />
          <Route path="convictions" element={<ConvictionsPage />} />
          <Route path="decisions" element={<DecisionsIndexPage />} />
          <Route path="methode" element={<MethodePage />} />
          <Route path="cases" element={<Navigate to="../bibliotheque" replace />} />
          <Route path="cases/:slug" element={<CaseStudyPage />} />
          <Route path="cases/:slug/correction" element={<CaseCorrectionPage />} />
          <Route path="livrables" element={<DeliverablesPage />} />
          <Route path="livrables/:slug" element={<DeliverablePage />} />
          <Route path="simulators" element={<SimulatorsPage />} />
          <Route path="simulators/:slug" element={<SimulatorPage />} />
          <Route path="anti-portfolio" element={<AntiPortfolioPage />} />
          <Route path="anti-portfolio/:slug" element={<AntiPortfolioEntryPage />} />
          <Route path="memos" element={<MemoLibraryPage />} />
          <Route path="memos/:slug" element={<MemoPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="ecosystemes" element={<EcosystemsPage />} />
          <Route path="ecosystemes/:slug" element={<EcosystemPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="journal" element={<DecisionJournalPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="search" element={<SearchPage />} />
          {DesignSystemShowcasePage && <Route path="design-system" element={<DesignSystemShowcasePage />} />}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

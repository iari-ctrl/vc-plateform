import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { LocaleBoundary, RootRedirect } from '@/i18n/guards';
import SplashPage from '@/pages/SplashPage';
import { Spinner } from '@/components/ui/primitives';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const HomePage = lazy(() => import('@/pages/HomePage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const ProfileResultPage = lazy(() => import('@/pages/ProfileResultPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ParcoursPage = lazy(() => import('@/pages/ParcoursPage'));
const ParcoursOrSubjectPage = lazy(() => import('@/pages/ParcoursOrSubjectPage'));
const PathsPage = lazy(() => import('@/pages/PathsPage'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'));
const LessonPage = lazy(() => import('@/pages/LessonPage'));
const GlossaryPage = lazy(() => import('@/pages/GlossaryPage'));
const CaseStudyPage = lazy(() => import('@/pages/CaseStudyPage'));
const DeliverablePage = lazy(() => import('@/pages/DeliverablePage'));
const SimulatorsPage = lazy(() => import('@/pages/SimulatorsPage'));
const SimulatorPage = lazy(() => import('@/pages/SimulatorPage'));
const AntiPortfolioPage = lazy(() => import('@/pages/AntiPortfolioPage'));
const AntiPortfolioEntryPage = lazy(() => import('@/pages/AntiPortfolioEntryPage'));
const MemoLibraryPage = lazy(() => import('@/pages/MemoLibraryPage'));
const MemoPage = lazy(() => import('@/pages/MemoPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const EcosystemsPage = lazy(() => import('@/pages/EcosystemsPage'));
const EcosystemPage = lazy(() => import('@/pages/EcosystemPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const DecisionJournalPage = lazy(() => import('@/pages/DecisionJournalPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));
const DesignSystemShowcasePage = lazy(() => import('@/pages/DesignSystemShowcasePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-surface-variant" role="status">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

/**
 * Layout route that wraps every locale-scoped page in a single Suspense (for the
 * lazy chunks) and an ErrorBoundary keyed on the pathname, then renders the
 * matched page through <Outlet/>. A pathless layout route keeps one flat route
 * tree — no nested <Routes> — which is what React Router expects and what lets
 * the data/loader APIs work later.
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

export default function App() {
  return (
    <Routes>
      {/* Bare `/` → redirect once to the detected locale (cookie → browser → fr). */}
      <Route path="/" element={<RootRedirect />} />

      {/* Everything else lives under `/:locale`. LocaleBoundary validates the
          segment (redirecting legacy unprefixed links like `/paths` → `/fr/paths`)
          and renders MainLayout, whose <Outlet/> shows the child route below. */}
      <Route path="/:locale" element={<LocaleBoundary />}>
        <Route index element={<SplashPage />} />
        <Route element={<PageShell />}>
          <Route path="home" element={<HomePage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="profile-result" element={<ProfileResultPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="paths" element={<ParcoursPage />} />
          <Route path="paths/:slug" element={<ParcoursOrSubjectPage />} />
          <Route path="bibliotheque" element={<PathsPage />} />
          <Route path="courses/:slug" element={<CourseDetailPage />} />
          <Route path="lessons/:slug" element={<LessonPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="glossary/:slug" element={<GlossaryPage />} />
          <Route path="cases" element={<Navigate to="../bibliotheque" replace />} />
          <Route path="cases/:slug" element={<CaseStudyPage />} />
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
          <Route path="admin" element={<AdminPage />} />
          <Route path="design-system" element={<DesignSystemShowcasePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

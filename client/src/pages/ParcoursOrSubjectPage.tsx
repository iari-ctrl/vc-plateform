import { lazy } from 'react';
import { useParams } from 'react-router-dom';
import { pathBySlug } from '@/content';

const ParcoursDetailPage = lazy(() => import('./ParcoursDetailPage'));
const PathDetailPage = lazy(() => import('./PathDetailPage'));

export default function ParcoursOrSubjectPage() {
  const { slug } = useParams();

  const isPath = slug ? !!pathBySlug(slug) : false;

  if (isPath) {
    return <PathDetailPage />;
  }

  return <ParcoursDetailPage />;
}

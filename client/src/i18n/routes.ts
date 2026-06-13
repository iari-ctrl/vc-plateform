// Client-side, typed view of the shared route registry (shared/routes.mjs).
//
// `usePageMeta` reads its `noindex` policy and default Open Graph card from
// here, and the sitemap/robots script reads the very same `.mjs`. So adding a
// private page or a new content section is a one-line registry edit instead of
// touching three desynchronized places (router, sitemap, per-page meta).
//
// This module exists so the client funnels its dependency on the shared file
// through a single, typed import — handy for the coverage test in routes.test.ts.

export {
  NOINDEX_SEGMENTS,
  STATIC_ROUTES,
  OG_IMAGE_BY_SEGMENT,
  firstSegment,
  isNoindexPath,
  ogImageKeyForPath,
} from '@shared/routes.mjs';

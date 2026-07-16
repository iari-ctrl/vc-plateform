// Convenience barrel for content collections and lookups.
//
// Each collection lives in its own module so the bundler can split them: a page
// that only needs `glossary` pulls just `glossary.json`, and collections used
// solely by lazy routes never reach the initial bundle. Eagerly-loaded surfaces
// (HomePage, cards, primitives, the atlas, the command palette) should import
// from the specific module — or from `./labels` for JSON-free helpers — rather
// than from this barrel, to avoid dragging a collection into the entry chunk.
//
// `searchLocal` is deliberately NOT re-exported here: it references every
// collection and is meant to be loaded lazily from `./search`.
export * from './paths';
export * from './courses';
export * from './lessons';
export * from './glossary';
export * from './caseStudies';
export * from './deliverables';
export * from './blog';
export * from './ecosystems';
export * from './convictions';
export * from './simulators';
export * from './antiPortfolio';
export * from './memos';
export * from './ikigai';
export * from './labels';
export * from './certifications';

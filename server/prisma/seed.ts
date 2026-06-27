import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db.js';
import { content, buildSearchText } from '../src/lib/content.js';

// ── Seed mode ────────────────────────────────────────────────────────────
// By default the seed is *non-destructive* for admin-editable content
// (glossary, blog, case studies): a row that already exists in the DB keeps its
// edited JSON so a curator's edits survive a re-seed. Derived searchText is still
// refreshed from that DB JSON. Pass `--force` to overwrite those rows with the
// source JSON:  `npm run db:seed -- --force`.
//
// Use `npm run content:export` after admin edits when the DB version should
// become the JSON source again.
const FORCE = process.argv.includes('--force');
const isProd = process.env.NODE_ENV === 'production';

type SeedStat = { created: number; ignored: number; forced: number; refreshedSearchText: number };
const newStat = (): SeedStat => ({ created: 0, ignored: 0, forced: 0, refreshedSearchText: 0 });

/**
 * Create-if-absent / overwrite-only-with-`--force` for editable content.
 * `refreshSearchText` updates only derived searchText while preserving DB edits.
 */
async function seedEditable(
  existing: unknown | null,
  create: () => Promise<unknown>,
  update: () => Promise<unknown>,
  stat: SeedStat,
  refreshSearchText?: () => Promise<unknown>,
): Promise<void> {
  if (!existing) {
    await create();
    stat.created++;
  } else if (FORCE) {
    await update();
    stat.forced++;
  } else {
    if (refreshSearchText) {
      await refreshSearchText();
      stat.refreshedSearchText++;
    }
    stat.ignored++;
  }
}

const summary = (label: string, s: SeedStat) =>
  `   ${label.padEnd(13)} ${s.created} créés · ${s.ignored} préservés · ${s.refreshedSearchText} searchText rafraîchis · ${s.forced} forcés`;

type ExistingDataRow = { id: string; data: string };
type EditableGlossary = {
  term: string;
  latin?: string;
  short: string;
  definition: string;
  example?: string;
  aliases?: string[];
};
type EditableCase = {
  title: string;
  subtitle: string;
  summary: string;
  sections: { heading: string; body: string }[];
};
type EditableBlog = {
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
};

function parseExistingData<T>(label: string, row: ExistingDataRow): T {
  try {
    return JSON.parse(row.data) as T;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`${label}/${row.id} - invalid data JSON: ${message}`);
  }
}

const glossarySearchText = (g: EditableGlossary) =>
  buildSearchText([g.term, g.latin, g.short, g.definition, g.example, ...(g.aliases ?? [])].filter(Boolean).join(' '));

const caseSearchText = (cs: EditableCase) =>
  buildSearchText([cs.title, cs.subtitle, cs.summary, ...cs.sections.map((s) => s.heading + ' ' + s.body)].join(' '));

const blogSearchText = (b: EditableBlog) =>
  buildSearchText([b.title, b.subtitle, b.excerpt, b.body].join(' '));

async function main() {
  console.log(`→ Seeding VC Premium Experience database…${FORCE ? '  [--force: overwrite CMS edits]' : ''}`);

  // ── Users ──────────────────────────────────────────────────────────────
  // Demo / admin accounts are a development convenience only — never seed them
  // into a production database (where real credentials must be the only ones).
  if (isProd) {
    console.log('   (production) comptes de démonstration non créés.');
  } else {
    const adminHash = await bcrypt.hash('admin1234', 10);
    const demoHash = await bcrypt.hash('demo1234', 10);

    await prisma.user.upsert({
      where: { email: 'admin@vcpx.io' },
      update: { role: 'admin', name: 'Curateur', passwordHash: adminHash },
      create: { email: 'admin@vcpx.io', name: 'Curateur', role: 'admin', passwordHash: adminHash },
    });

    const demo = await prisma.user.upsert({
      where: { email: 'demo@vcpx.io' },
      update: { name: 'Apprenant démo', passwordHash: demoHash },
      create: { email: 'demo@vcpx.io', name: 'Apprenant démo', role: 'user', passwordHash: demoHash },
    });

    await prisma.profile.upsert({
      where: { userId: demo.id },
      update: { profileType: 'futur-analyste', timeBudget: 'medium' },
      create: { userId: demo.id, profileType: 'futur-analyste', timeBudget: 'medium' },
    });
  }

  // ── Content (idempotent upserts) ─────────────────────────────────────────
  const tagCount = new Map<string, number>();
  const bumpTags = (tags: string[] = []) => tags.forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1));

  for (const [i, p] of content.parcours().entries()) {
    const searchText = buildSearchText(
      [p.title, p.hook, p.goal, ...(p.forWhom ?? []), p.perspective ?? '', ...(p.outcomes ?? [])].join(' '),
    );
    await prisma.learningPath.upsert({
      where: { id: p.id },
      update: { slug: p.slug, order: i, title: p.title, level: p.level, searchText, data: JSON.stringify(p) },
      create: { id: p.id, slug: p.slug, order: i, title: p.title, level: p.level, searchText, data: JSON.stringify(p) },
    });
  }

  for (const c of content.courses()) {
    bumpTags(c.tags);
    const searchText = buildSearchText([c.title, c.subtitle, c.summary, ...(c.tags ?? [])].join(' '));
    await prisma.course.upsert({
      where: { id: c.id },
      update: { slug: c.slug, pathId: c.pathId, order: c.order, title: c.title, level: c.level, searchText, data: JSON.stringify(c) },
      create: { id: c.id, slug: c.slug, pathId: c.pathId, order: c.order, title: c.title, level: c.level, searchText, data: JSON.stringify(c) },
    });
  }

  for (const l of content.allLessons()) {
    const searchText = buildSearchText(
      [l.title, l.kicker, l.summary, l.body, ...(l.keyTakeaways ?? [])].join(' '),
    );
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: { slug: l.slug, courseId: l.courseId, order: l.order, title: l.title, searchText, data: JSON.stringify(l) },
      create: { id: l.id, slug: l.slug, courseId: l.courseId, order: l.order, title: l.title, searchText, data: JSON.stringify(l) },
    });
    // Quizzes (normalised table seeded from embedded quiz)
    await prisma.quiz.deleteMany({ where: { lessonId: l.id } });
    if (l.quiz?.length) {
      await prisma.quiz.createMany({
        data: l.quiz.map((q, i) => ({
          lessonId: l.id,
          order: i,
          question: q.question,
          data: JSON.stringify({ options: q.options, explanation: q.explanation }),
        })),
      });
    }
  }

  // ── Admin-editable content (non-destructive unless --force) ───────────────
  const glossaryStat = newStat();
  for (const g of content.glossary()) {
    const searchText = glossarySearchText(g);
    const fields = { slug: g.slug, term: g.term, category: g.category, searchText, data: JSON.stringify(g) };
    const existing = await prisma.glossaryTerm.findUnique({ where: { id: g.id } });
    await seedEditable(
      existing,
      () => prisma.glossaryTerm.create({ data: { id: g.id, ...fields } }),
      () => prisma.glossaryTerm.update({ where: { id: g.id }, data: fields }),
      glossaryStat,
      existing
        ? () => prisma.glossaryTerm.update({
            where: { id: existing.id },
            data: { searchText: glossarySearchText(parseExistingData<EditableGlossary>('glossary', existing)) },
          })
        : undefined,
    );
  }

  const caseStat = newStat();
  for (const cs of content.caseStudies()) {
    bumpTags(cs.tags);
    const searchText = caseSearchText(cs);
    const fields = { slug: cs.slug, title: cs.title, kind: cs.kind, searchText, data: JSON.stringify(cs) };
    const existing = await prisma.caseStudy.findUnique({ where: { id: cs.id } });
    await seedEditable(
      existing,
      () => prisma.caseStudy.create({ data: { id: cs.id, ...fields } }),
      () => prisma.caseStudy.update({ where: { id: cs.id }, data: fields }),
      caseStat,
      existing
        ? () => prisma.caseStudy.update({
            where: { id: existing.id },
            data: { searchText: caseSearchText(parseExistingData<EditableCase>('case-studies', existing)) },
          })
        : undefined,
    );
  }

  const blogStat = newStat();
  for (const b of content.blog()) {
    bumpTags(b.tags);
    const searchText = blogSearchText(b);
    const fields = { slug: b.slug, title: b.title, category: b.category, date: b.date, searchText, data: JSON.stringify(b) };
    const existing = await prisma.blogPost.findUnique({ where: { id: b.id } });
    await seedEditable(
      existing,
      () => prisma.blogPost.create({ data: { id: b.id, ...fields } }),
      () => prisma.blogPost.update({ where: { id: b.id }, data: fields }),
      blogStat,
      existing
        ? () => prisma.blogPost.update({
            where: { id: existing.id },
            data: { searchText: blogSearchText(parseExistingData<EditableBlog>('blog', existing)) },
          })
        : undefined,
    );
  }

  for (const s of content.simulators()) {
    const searchText = buildSearchText([s.title, s.subtitle, s.category, s.description].join(' '));
    await prisma.simulator.upsert({
      where: { id: s.id },
      update: { slug: s.slug, title: s.title, category: s.category, searchText, data: JSON.stringify(s) },
      create: { id: s.id, slug: s.slug, title: s.title, category: s.category, searchText, data: JSON.stringify(s) },
    });
  }

  for (const [name, count] of tagCount) {
    await prisma.tag.upsert({ where: { name }, update: { count }, create: { name, count } });
  }

  const counts = {
    paths: await prisma.learningPath.count(),
    courses: await prisma.course.count(),
    lessons: await prisma.lesson.count(),
    quizzes: await prisma.quiz.count(),
    glossary: await prisma.glossaryTerm.count(),
    cases: await prisma.caseStudy.count(),
    blog: await prisma.blogPost.count(),
    simulators: await prisma.simulator.count(),
    tags: await prisma.tag.count(),
    users: await prisma.user.count(),
  };
  console.log('✓ Seed complete', counts);
  console.log('  Contenu éditable :');
  console.log(summary('glossaire', glossaryStat));
  console.log(summary('études de cas', caseStat));
  console.log(summary('blog', blogStat));
  const totalIgnored = glossaryStat.ignored + caseStat.ignored + blogStat.ignored;
  if (totalIgnored > 0 && !FORCE) {
    console.log(`  → ${totalIgnored} ligne(s) éditoriale(s) préservée(s), searchText technique rafraîchi.`);
    console.log('  → Relancer avec « npm run db:seed -- --force » pour écraser avec le JSON source.');
    console.log('  → Pour exporter ces éditions DB vers JSON : npm run content:export');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

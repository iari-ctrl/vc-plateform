import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db.js';
import { content, stripHtml } from '../src/lib/content.js';

async function main() {
  console.log('→ Seeding VC Premium Experience database…');

  // ── Users ──────────────────────────────────────────────────────────────
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

  // ── Content (idempotent upserts) ─────────────────────────────────────────
  const tagCount = new Map<string, number>();
  const bumpTags = (tags: string[] = []) => tags.forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1));

  for (const [i, p] of content.parcours().entries()) {
    await prisma.learningPath.upsert({
      where: { id: p.id },
      update: { slug: p.slug, order: i, title: p.title, level: p.level, data: JSON.stringify(p) },
      create: { id: p.id, slug: p.slug, order: i, title: p.title, level: p.level, data: JSON.stringify(p) },
    });
  }

  for (const c of content.courses()) {
    bumpTags(c.tags);
    await prisma.course.upsert({
      where: { id: c.id },
      update: { slug: c.slug, pathId: c.pathId, order: c.order, title: c.title, level: c.level, data: JSON.stringify(c) },
      create: { id: c.id, slug: c.slug, pathId: c.pathId, order: c.order, title: c.title, level: c.level, data: JSON.stringify(c) },
    });
  }

  for (const l of content.allLessons()) {
    const searchText = stripHtml(
      [l.title, l.kicker, l.summary, l.body, ...(l.keyTakeaways ?? [])].join(' '),
    ).toLowerCase();
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

  for (const g of content.glossary()) {
    const searchText = stripHtml([g.term, g.latin, g.short, g.definition, g.example, ...(g.aliases ?? [])].filter(Boolean).join(' ')).toLowerCase();
    await prisma.glossaryTerm.upsert({
      where: { id: g.id },
      update: { slug: g.slug, term: g.term, category: g.category, searchText, data: JSON.stringify(g) },
      create: { id: g.id, slug: g.slug, term: g.term, category: g.category, searchText, data: JSON.stringify(g) },
    });
  }

  for (const cs of content.caseStudies()) {
    bumpTags(cs.tags);
    const searchText = stripHtml([cs.title, cs.subtitle, cs.summary, ...cs.sections.map((s) => s.heading + ' ' + s.body)].join(' ')).toLowerCase();
    await prisma.caseStudy.upsert({
      where: { id: cs.id },
      update: { slug: cs.slug, title: cs.title, kind: cs.kind, searchText, data: JSON.stringify(cs) },
      create: { id: cs.id, slug: cs.slug, title: cs.title, kind: cs.kind, searchText, data: JSON.stringify(cs) },
    });
  }

  for (const b of content.blog()) {
    bumpTags(b.tags);
    const searchText = stripHtml([b.title, b.subtitle, b.excerpt, b.body].join(' ')).toLowerCase();
    await prisma.blogPost.upsert({
      where: { id: b.id },
      update: { slug: b.slug, title: b.title, category: b.category, date: b.date, searchText, data: JSON.stringify(b) },
      create: { id: b.id, slug: b.slug, title: b.title, category: b.category, date: b.date, searchText, data: JSON.stringify(b) },
    });
  }

  for (const s of content.simulators()) {
    await prisma.simulator.upsert({
      where: { id: s.id },
      update: { slug: s.slug, title: s.title, category: s.category, data: JSON.stringify(s) },
      create: { id: s.id, slug: s.slug, title: s.title, category: s.category, data: JSON.stringify(s) },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

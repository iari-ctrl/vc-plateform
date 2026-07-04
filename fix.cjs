const fs = require('fs');

function modify(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  content = replacer(content);
  fs.writeFileSync(path, content);
}

// BlogPostPage
modify('client/src/pages/blog/BlogPostPage.tsx', c => {
  return c
    .replace('b => b.slug', '(b: any) => b.slug')
    .replace('(t, i)', '(t: any, i: number)');
});

// CaseStudyPage
modify('client/src/pages/cases/CaseStudyPage.tsx', c => {
  return c
    .replace('s => s.slug === slug', '(s: any) => s.slug === slug')
    .replace('(t, i)', '(t: any, i: number)');
});

// GlossaryPage
modify('client/src/pages/glossary/GlossaryPage.tsx', c => {
  return c
    .replace(/canonicalPath: `\/\$\{slug\}`,\n?\s*/g, '')
    .replace(/entry\.definition/g, 'entry.desc');
});

// DeliverablePage
modify('client/src/pages/intelligence/DeliverablePage.tsx', c => {
  return c
    .replace('id =>', '(id: any) =>')
    .replace('l =>', '(l: any) =>')
    .replace('(s, i) =>', '(s: any, i: number) =>')
    .replace('(r, i) =>', '(r: any, i: number) =>');
});

// CourseDetailPage
modify('client/src/pages/learn/CourseDetailPage.tsx', c => {
  return c.replace('t =>', '(t: any) =>');
});

// LessonPage
modify('client/src/pages/learn/LessonPage.tsx', c => {
  return c
    .replace('(t, i)', '(t: any, i: number)')
    .replace('(fr, i)', '(fr: any, i: number)');
});

// ParcoursDetailPage
modify('client/src/pages/learn/ParcoursDetailPage.tsx', c => {
  return c
    .replace('Record<ParcoursFamily,', 'Record<string,')
    .replace('(w, i)', '(w: any, i: number)')
    .replace('(p, i)', '(p: any, i: number)')
    .replace('(o, i)', '(o: any, i: number)');
});


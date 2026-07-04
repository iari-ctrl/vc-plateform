const fs = require('fs');

function modify(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  content = replacer(content);
  fs.writeFileSync(path, content);
}

// 1. BlogPostPage.tsx
modify('client/src/pages/blog/BlogPostPage.tsx', c => {
  return c.replace(/const \{\s*item:\s*post,\s*pending\s*\} = useApiItem[^\)]+\);\n?/g, 
    'const post = slug ? blogBySlug(slug) : undefined;\n  const pending = false;\n');
});

// 2. CaseStudyPage.tsx
modify('client/src/pages/cases/CaseStudyPage.tsx', c => {
  return c.replace(/const \{\s*item:\s*cs,\s*pending\s*\} = useApiItem[^\)]+\);\n?/g,
    'const cs = slug ? caseBySlug(slug) : undefined;\n  const pending = false;\n');
});

// 3. DeliverablePage.tsx
modify('client/src/pages/intelligence/DeliverablePage.tsx', c => {
  return c.replace(/const \{\s*item:\s*d,\s*pending\s*\} = useApiItem[^\)]+\);\n?/g,
    'const d = slug ? deliverableBySlug(slug) : undefined;\n  const pending = false;\n');
});

// 4. CourseDetailPage.tsx
modify('client/src/pages/learn/CourseDetailPage.tsx', c => {
  return c.replace(/const \{\s*item:\s*course,\s*pending\s*\} = useApiItem[^\)]+\);\n?/g,
    'const course = slug ? courseBySlug(slug) : undefined;\n  const pending = false;\n');
});

// 5. LessonPage.tsx
modify('client/src/pages/learn/LessonPage.tsx', c => {
  // Lesson is a bit trickier because loadLesson is async, but we can't await in a React component directly.
  // Actually loadLesson returns a Promise. The old useApiItem handled it if it returned a Promise? 
  // Let's check loadLesson. It returns a Promise<LessonDetail | null>.
  return c; // We'll handle this manually.
});

// 6. ParcoursDetailPage.tsx
modify('client/src/pages/learn/ParcoursDetailPage.tsx', c => {
  return c.replace(/const \{\s*item:\s*parcours,\s*pending\s*\} = useApiItem[^\)]+\);\n?/g,
    'const parcours = slug ? parcoursBySlug(slug) : undefined;\n  const pending = false;\n');
});


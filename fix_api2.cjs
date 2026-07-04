const fs = require('fs');

function modify(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  content = replacer(content);
  fs.writeFileSync(path, content);
}

modify('client/src/pages/blog/BlogPostPage.tsx', c => {
  return c.replace(/const \{\s*item:\s*post,\s*pending\s*\} = useApiItem[\s\S]+?\);/g, 
    'const post = slug ? blogBySlug(slug) : undefined;\n  const pending = false;');
});

modify('client/src/pages/cases/CaseStudyPage.tsx', c => {
  return c.replace(/const \{\s*item:\s*cs,\s*pending\s*\} = useApiItem[\s\S]+?\);/g,
    'const cs = slug ? caseBySlug(slug) : undefined;\n  const pending = false;');
});

modify('client/src/pages/intelligence/DeliverablePage.tsx', c => {
  return c.replace(/const \{\s*item:\s*d,\s*pending\s*\} = useApiItem[\s\S]+?\);/g,
    'const d = slug ? deliverableBySlug(slug) : undefined;\n  const pending = false;');
});

modify('client/src/pages/learn/CourseDetailPage.tsx', c => {
  return c.replace(/const \{\s*item:\s*course,\s*pending\s*\} = useApiItem[\s\S]+?\);/g,
    'const course = slug ? courseBySlug(slug) : undefined;\n  const pending = false;');
});

modify('client/src/pages/learn/ParcoursDetailPage.tsx', c => {
  return c.replace(/const \{\s*item:\s*parcours,\s*pending\s*\} = useApiItem[\s\S]+?\);/g,
    'const parcours = slug ? parcoursBySlug(slug) : undefined;\n  const pending = false;');
});


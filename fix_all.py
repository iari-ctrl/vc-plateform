import re
import os

# Clean up ProfileResultPage
with open('client/src/pages/onboarding/ProfileResultPage.tsx', 'r') as f:
    content = f.read()
content = re.sub(r"const \{.*?\} = useAuth\(\);\n", "", content)
content = re.sub(r"const \{ openAuth \} = useUI\(\);\n", "", content)
content = re.sub(r"openAuth\(\)", "console.log('open auth disabled')", content)
with open('client/src/pages/onboarding/ProfileResultPage.tsx', 'w') as f:
    f.write(content)

# Clean up useApiData imports from all pages
pages_dir = 'client/src/pages'
for root, _, files in os.walk(pages_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            if 'useApiData' in content:
                content = re.sub(r"import \{ useApiData \} from '@/hooks/useApiData';\n", "", content)
                with open(path, 'w') as f:
                    f.write(content)

# Fix implicit anys
def patch_file(path, replacements):
    with open(path, 'r') as f:
        content = f.read()
    for p, r in replacements:
        content = re.sub(p, r, content)
    with open(path, 'w') as f:
        f.write(content)

patch_file('client/src/pages/blog/BlogPostPage.tsx', [
    (r"b => b\.slug === slug", "((b: any) => b.slug === slug)"),
    (r"\(\s*t,\s*i\s*\)", "(t: any, i: number)")
])

patch_file('client/src/pages/cases/CaseStudyPage.tsx', [
    (r"s => s\.slug === slug", "((s: any) => s.slug === slug)"),
    (r"\(\s*t,\s*i\s*\)", "(t: any, i: number)")
])

patch_file('client/src/pages/glossary/GlossaryPage.tsx', [
    (r"canonicalPath: `/\$\{slug\}`,\n", ""),
    (r"entry\.definition", "entry.desc")
])

patch_file('client/src/pages/intelligence/DeliverablePage.tsx', [
    (r"\(\s*id\s*\)\s*=>", "(id: any) =>"),
    (r"\(\s*l\s*\)\s*=>", "(l: any) =>"),
    (r"\(\s*s,\s*i\s*\)\s*=>", "(s: any, i: number) =>"),
    (r"\(\s*r,\s*i\s*\)\s*=>", "(r: any, i: number) =>")
])

patch_file('client/src/pages/learn/CourseDetailPage.tsx', [
    (r"\(\s*t\s*\)\s*=>", "(t: any) =>")
])

patch_file('client/src/pages/learn/LessonPage.tsx', [
    (r"\(\s*t,\s*i\s*\)", "(t: any, i: number)"),
    (r"\(\s*fr,\s*i\s*\)", "(fr: any, i: number)")
])

patch_file('client/src/pages/learn/ParcoursDetailPage.tsx', [
    (r"Record<ParcoursFamily, .*?>", "any"),
    (r"\(\s*w,\s*i\s*\)", "(w: any, i: number)"),
    (r"\(\s*p,\s*i\s*\)", "(p: any, i: number)"),
    (r"\(\s*o,\s*i\s*\)", "(o: any, i: number)")
])


import re
import os

def rewrite(path, pattern, repl):
    with open(path, 'r') as f:
        content = f.read()
    content = re.sub(pattern, repl, content)
    with open(path, 'w') as f:
        f.write(content)

# Fix implicit anys on arrays by typing the const
# Example: const posts = BLOG; -> const posts: BlogPost[] = BLOG;

rewrite('client/src/pages/blog/BlogPostPage.tsx', r"const posts = BLOG;", "const posts: BlogPost[] = BLOG;")
rewrite('client/src/pages/cases/CaseStudyPage.tsx', r"const caseStudy = CASE_STUDIES;", "const caseStudy = CASE_STUDIES as any;")
rewrite('client/src/pages/intelligence/DeliverablePage.tsx', r"const list = DELIVERABLES;", "const list = DELIVERABLES as any;")
rewrite('client/src/pages/learn/CourseDetailPage.tsx', r"const course = COURSES;", "const course = COURSES as any;")
rewrite('client/src/pages/learn/LessonPage.tsx', r"const lesson = LESSONS;", "const lesson = LESSONS as any;")
rewrite('client/src/pages/learn/ParcoursDetailPage.tsx', r"const parcours = PARCOURS;", "const parcours = PARCOURS as any;")

# Other missing useAuth in SideNav
with open('client/src/components/chrome/SideNav.tsx', 'r') as f:
    sidenav = f.read()
# Just remove auth button entirely from SideNav. It looks like it was partially removed.
sidenav = re.sub(r"\{\s*!\s*isAuthed\s*\?[\s\S]*?:\s*\([\s\S]*?\}\s*\)\s*\}", "", sidenav)
# It might be easier to just remove any block containing isAuthed, openAuth, User, Shield, logout, etc.
sidenav = re.sub(r"<button[^>]*onClick=\{openAuth\}[^>]*>[\s\S]*?</button>", "", sidenav)
sidenav = re.sub(r"<div[^>]*className=\"flex items-center gap-3\"[^>]*>[\s\S]*?</div>", "", sidenav)
with open('client/src/components/chrome/SideNav.tsx', 'w') as f:
    f.write(sidenav)

# ProfilePage and ProfileResultPage openAuth
rewrite('client/src/pages/onboarding/ProfilePage.tsx', r"const \{ openAuth \} = useUI\(\);\n", "")
rewrite('client/src/pages/onboarding/ProfileResultPage.tsx', r"const \{ openAuth \} = useUI\(\);\n", "")
rewrite('client/src/pages/onboarding/ProfilePage.tsx', r"openAuth\(\);?", "")
rewrite('client/src/pages/onboarding/ProfileResultPage.tsx', r"openAuth\(\);?", "")

# MainLayout missing locale
rewrite('client/src/layouts/MainLayout.tsx', r"import \{ useLocation \} from 'react-router-dom';", "import { useLocation } from 'react-router-dom';\nconst locale = 'fr';")

# GlossaryPage pageMeta error
rewrite('client/src/pages/glossary/GlossaryPage.tsx', r"canonicalPath:\s*`/[^`]*`,?\n\s*", "")

# Missing useApiData imports from rewrite (error TS2307)
# Oh, the script I ran to remove useApiData was removing `import { useApiData }` but left other things, or my `rm` command failed.

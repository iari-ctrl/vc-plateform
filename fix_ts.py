import os
import re

def rewrite(path, pattern, repl):
    with open(path, 'r') as f:
        content = f.read()
    content = re.sub(pattern, repl, content)
    with open(path, 'w') as f:
        f.write(content)

# Fix SideNav
with open('client/src/components/chrome/SideNav.tsx', 'r') as f:
    sidenav = f.read()
sidenav = re.sub(r"const \{ isAuthed[\s\S]*?\n", "", sidenav)
sidenav = re.sub(r"const \{ openAuth \} = useUI\(\);\n", "", sidenav)
sidenav = re.sub(r"const navigate = useNavigate\(\);\n", "", sidenav)
sidenav = re.sub(r"\{isAuthed \? \([\s\S]*?Se connecter\s*</button>\s*\)\}", "", sidenav)
with open('client/src/components/chrome/SideNav.tsx', 'w') as f:
    f.write(sidenav)

# Replace useNavigate in ProfilePage
rewrite('client/src/pages/onboarding/ProfilePage.tsx', r"import \{ useNavigate \} from '@/i18n/navigation';", "import { useNavigate } from 'react-router-dom';")
rewrite('client/src/pages/onboarding/ProfilePage.tsx', r"import \{ Link \} from '@/i18n/routing';", "import { Link } from 'react-router-dom';")

# Replace in ProfileResultPage
rewrite('client/src/pages/onboarding/ProfileResultPage.tsx', r"import \{ Link \} from '@/i18n/routing';", "import { Link } from 'react-router-dom';")
rewrite('client/src/pages/onboarding/ProfileResultPage.tsx', r"import \{ useAuth \} from '@/context/AuthContext';\n", "")
rewrite('client/src/pages/onboarding/ProfileResultPage.tsx', r"const \{ user \} = useAuth\(\);\n", "")
rewrite('client/src/pages/onboarding/ProfileResultPage.tsx', r"\{user \? `, \$\{user.name.split\(' '\)\[0\]\}` : ''\}", "")
rewrite('client/src/pages/onboarding/ProfileResultPage.tsx', r"import \{ GuestBanner \} from '@/components/ui/GuestBanner';\n", "")
rewrite('client/src/pages/onboarding/ProfileResultPage.tsx', r"<GuestBanner[\s\S]*?/>", "")


# NotesPage and DecisionJournalPage
rewrite('client/src/pages/workspace/DecisionJournalPage.tsx', r"import \{ GuestBanner \} from '@/components/ui/GuestBanner';\n", "")
rewrite('client/src/pages/workspace/DecisionJournalPage.tsx', r"<GuestBanner[\s\S]*?/>", "")
rewrite('client/src/pages/workspace/NotesPage.tsx', r"import \{ GuestBanner \} from '@/components/ui/GuestBanner';\n", "")
rewrite('client/src/pages/workspace/NotesPage.tsx', r"<GuestBanner[\s\S]*?/>", "")


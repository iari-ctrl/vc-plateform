import re

with open('client/src/components/chrome/TopBar.tsx', 'r') as f:
    content = f.read()

# Imports
content = re.sub(r"import \{ useNavigate, isLinkActive \} from '@/i18n/navigation';\n", "", content)
content = re.sub(r"import \{ LocaleSwitcher \} from '@/i18n/LocaleSwitcher';\n", "", content)
content = re.sub(r"import \{ EN_ENABLED \} from '@/i18n/config';\n", "", content)
content = re.sub(r"import \{ useAuth \} from '@/context/AuthContext';\n", "", content)

# Add isLinkActive helper
helper = """
const isLinkActive = (to: string, location: any) => 
  to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
"""
content = content.replace("import { initials } from '@/lib/utils';", "import { initials } from '@/lib/utils';" + helper)

# Remove `isAuthed` and `openAuth`
content = re.sub(r"const \{ isAuthed \} = useAuth\(\);\n", "", content)
content = re.sub(r"const \{ openSearch, openAuth \} = useUI\(\);", "const { openSearch } = useUI();", content)

# Remove EN_ENABLED and LocaleSwitcher
content = re.sub(r"\{EN_ENABLED && <LocaleSwitcher className=\"hidden sm:inline-flex\" />\}", "", content)

# Remove AccountMenu and Se connecter from Desktop
auth_block_desktop = r"\{isAuthed \? \(\s*<AccountMenu />\s*\) : \(\s*<button onClick=\{\(\) => openAuth\(\)\} className=\"hidden rounded-full px-3.5 py-2 text-sm font-medium text-surface-variant transition-colors hover:text-foreground sm:block\">\s*Se connecter\s*</button>\s*\)\}"
content = re.sub(auth_block_desktop, "", content)

# Remove isAuthed and EN_ENABLED from Mobile
mobile_auth = r"\{!isAuthed && \(\s*<button onClick=\{\(\) => openAuth\(\)\} className=\"btn-ghost mt-1\">\s*Se connecter\s*</button>\s*\)\}"
content = re.sub(mobile_auth, "", content)

mobile_en = r"\{EN_ENABLED && \(\s*<div className=\"mt-3 flex items-center justify-between border-t border-outline-variant pt-4\">\s*<span className=\"text-sm font-medium text-surface-variant\">Langue</span>\s*<LocaleSwitcher />\s*</div>\s*\)\}"
content = re.sub(mobile_en, "", content)

# Remove AccountMenu definition completely
content = re.sub(r"function AccountMenu\(\) \{[\s\S]*$", "", content)

with open('client/src/components/chrome/TopBar.tsx', 'w') as f:
    f.write(content)

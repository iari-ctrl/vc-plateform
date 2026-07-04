import re

with open('client/src/pages/workspace/DashboardPage.tsx', 'r') as f:
    content = f.read()

# Imports
content = re.sub(r"import \{ useAuth \} from '@/context/AuthContext';\n", "", content)
content = re.sub(r"import \{ GuestBanner \} from '@/components/ui/GuestBanner';\n", "", content)

# Remove `useAuth()`
content = re.sub(r"const \{ user \} = useAuth\(\);\n", "", content)

# Remove GuestBanner
content = re.sub(r"<GuestBanner\s*className=\"mt-8\"\s*message=\"[^\"]+\"\s*reason=\"[^\"]+\"\s*/>", "", content)

# Remove user from Greeting
content = re.sub(r"Bonjour\{user \? `, \$\{user.name.split\(' '\)\[0\]\}` : ''\}\.", "Bonjour.", content)

with open('client/src/pages/workspace/DashboardPage.tsx', 'w') as f:
    f.write(content)

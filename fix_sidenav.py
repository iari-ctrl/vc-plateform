import re

with open('client/src/components/chrome/SideNav.tsx', 'r') as f:
    sidenav = f.read()

# Delete AccountControl function
sidenav = re.sub(r"function AccountControl\(\{ expanded \}: \{ expanded: boolean \}\) \{[\s\S]*?\}\n\n// ── Mobile bar", "// ── Mobile bar", sidenav)

with open('client/src/components/chrome/SideNav.tsx', 'w') as f:
    f.write(sidenav)

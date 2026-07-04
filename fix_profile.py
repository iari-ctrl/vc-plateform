import re

with open('client/src/pages/onboarding/ProfilePage.tsx', 'r') as f:
    content = f.read()

# Remove the Account card completely
content = re.sub(r"\{\/\* Account \*\/\}.*?\{\/\* Learning profile \*\/\}", "{/* Learning profile */}", content, flags=re.DOTALL)
# Remove useAuth import line if there's any broken one
content = re.sub(r"const \{.*?\} = useAuth\(\);\n", "", content)

with open('client/src/pages/onboarding/ProfilePage.tsx', 'w') as f:
    f.write(content)

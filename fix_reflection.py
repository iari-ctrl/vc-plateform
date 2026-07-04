import re

with open('client/src/components/ikigai/cahierSections/reflection.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"import \{ useAuth \} from '@/context/AuthContext';\n", "", content)
content = re.sub(r"import \{ useUI \} from '@/context/UIContext';\n", "", content)

content = re.sub(r"const \{ isAuthed \} = useAuth\(\);\n", "", content)
content = re.sub(r"const \{ openAuth \} = useUI\(\);\n", "", content)

# Remove the ternary {isAuthed ? '...carnet...' : '...localement...'}
content = re.sub(r"\{isAuthed[\s\S]*?'Vos brouillons sont conservés localement sur cet appareil\.'\}", "'Vos brouillons sont conservés localement sur cet appareil.'", content)

with open('client/src/components/ikigai/cahierSections/reflection.tsx', 'w') as f:
    f.write(content)

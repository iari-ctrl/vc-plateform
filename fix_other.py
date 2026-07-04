import re

def rewrite(path, pattern, repl):
    with open(path, 'r') as f:
        content = f.read()
    content = re.sub(pattern, repl, content)
    with open(path, 'w') as f:
        f.write(content)

# MainLayout
with open('client/src/layouts/MainLayout.tsx', 'r') as f:
    main_layout = f.read()
main_layout = re.sub(r"import \{ useLocale \} from '@/i18n/useLocale';\n", "", main_layout)
main_layout = re.sub(r"const locale = useLocale\(\);\n", "", main_layout)
main_layout = re.sub(r"lang=\{locale\}", 'lang="fr"', main_layout)
with open('client/src/layouts/MainLayout.tsx', 'w') as f:
    f.write(main_layout)

# lib/markdown.tsx
with open('client/src/lib/markdown.tsx', 'r') as f:
    markdown = f.read()
markdown = re.sub(r"import \{ Link \} from '@/i18n/navigation';\n", "import { Link } from 'react-router-dom';\n", markdown)
markdown = re.sub(r"import \{ useLocale \} from '@/i18n/useLocale';\n", "", markdown)
# If useLocale was used, just set it to 'fr' or remove it.
markdown = re.sub(r"const locale = useLocale\(\);\n", "", markdown)
markdown = re.sub(r"const \{ locale \} = useLocale\(\);\n", "", markdown)
with open('client/src/lib/markdown.tsx', 'w') as f:
    f.write(markdown)


import re

with open('client/src/context/UIContext.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"import \{ AuthDialog \} from '@/components/ui/AuthDialog';\n", "", content)
content = re.sub(r"openAuth: \(reason\?: string\) => void;\n", "", content)
content = re.sub(r"const \[authOpen, setAuthOpen\] = useState\(false\);\n", "", content)
content = re.sub(r"const \[authReason, setAuthReason\] = useState<string \| undefined>\(\);\n", "", content)
content = re.sub(r"const openAuth = useCallback\(\(reason\?: string\) => \{\n\s*setAuthReason\(reason\);\n\s*setAuthOpen\(true\);\n\s*\}, \[\]\);\n", "", content)

# Value tuple
content = re.sub(r"const value = useMemo\(\(\) => \(\{ openAuth, openSearch \}\), \[openAuth, openSearch\]\);", "const value = useMemo(() => ({ openSearch }), [openSearch]);", content)

# AuthDialog JSX
content = re.sub(r"<AuthDialog open=\{authOpen\} onClose=\{\(\) => setAuthOpen\(false\)\} reason=\{authReason\} />\n", "", content)

with open('client/src/context/UIContext.tsx', 'w') as f:
    f.write(content)

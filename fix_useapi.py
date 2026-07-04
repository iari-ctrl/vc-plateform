import os
import re

directory = 'client/src/pages'
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()

            if 'useApiData' in content:
                # Remove import
                content = re.sub(r"import \{ useApiData \} from '@/hooks/useApiData';\n", "", content)
                
                # Replace const { data: varName } = useApiData<Type>(url, CONSTANT);
                # Pattern: const \{ data: ([a-zA-Z0-9_]+) \} = useApiData(?:<[^>]+>)?\([^,]+,\s*([^)]+)\);
                content = re.sub(r"const\s*\{\s*data\s*:\s*([a-zA-Z0-9_]+)\s*\}\s*=\s*useApiData(?:<[^>]+>)?\([^,]+,\s*([^)]+)\);", r"const \1 = \2;", content)

                with open(path, 'w') as f:
                    f.write(content)

import os
import re

file_path = 'server/src/generated/client/index.js'

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
    exit(1)

# Try opening with latin-1 to avoid encoding errors
with open(file_path, 'r', encoding='latin-1') as f:
    lines = f.readlines()

new_lines = []
state = 'NORMAL' # NORMAL, HEAD, INCOMING

for line in lines:
    if line.startswith('<<<<<<<'):
        state = 'HEAD'
    elif line.startswith('======='):
        state = 'INCOMING'
    elif line.startswith('>>>>>>>'):
        state = 'NORMAL'
    else:
        if state == 'NORMAL' or state == 'HEAD':
            new_lines.append(line)

with open(file_path, 'w', encoding='latin-1') as f:
    f.writelines(new_lines)

print(f"Resolved conflicts in {file_path}")
import re, sys
s = open('serverless/worker.js', encoding='utf-8').read()
t = re.sub(r'//[^\n]*', '', s)
t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
t = re.sub(r'"(?:[^"\\]|\\.)*"', '""', t)
t = re.sub(r"'(?:[^'\\]|\\.)*'", "''", t)
ok = True
for o, c in [('(', ')'), ('{', '}'), ('[', ']')]:
    a, b = t.count(o), t.count(c)
    status = 'OK' if a == b else '!!不平衡'
    if a != b: ok = False
    print(f'{o}{c}: 开{a} 闭{b} {status}')
print('worker.js 字符数:', len(s))
sys.exit(0 if ok else 1)

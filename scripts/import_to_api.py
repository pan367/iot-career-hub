#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键把 data/jobs.js 的岗位导入动态后端(KV 数据库)

用法:
  py -3 scripts/import_to_api.py https://你的API地址.workers.dev 你的ADMIN_KEY

说明:
  - 从 data/jobs.js 读取岗位(自动剥离注释与赋值语句)
  - 逐条 POST 到 /api/jobs(跳过已存在的 id)
  - 导入完成后,前端配置 apiUrl 即显示这些岗位
"""
import json
import re
import sys
import urllib.request

JOBS_FILE = "data/jobs.js"


def load_jobs():
    text = open(JOBS_FILE, encoding="utf-8").read()
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)          # 去注释
    text = re.sub(r"window\.JOBS_DATA\s*=\s*", "", text).strip()
    text = text.rstrip().rstrip(";").strip()
    # JS 对象 → JSON:给裸键名加双引号(仅匹配对象键位置,不误伤字符串值)
    text = re.sub(r"([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)", r'\1"\2"\3', text)
    return json.loads(text)


def post(base, key, job):
    req = urllib.request.Request(
        base.rstrip("/") + "/api/jobs",
        data=json.dumps(job).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + key},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8"))
        except Exception:
            return e.code, {"error": "HTTP " + str(e.code)}


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    base, key = sys.argv[1], sys.argv[2]
    jobs = load_jobs()
    print(f"共读取 {len(jobs)} 条岗位,开始导入…")
    ok = skipped = failed = 0
    for j in jobs:
        status, body = post(base, key, j)
        if status in (200, 201):
            ok += 1
        elif status == 409:
            skipped += 1
        else:
            failed += 1
            print(f"  失败 {j.get('id')}: {body.get('error', body)}")
    print(f"完成:成功 {ok} / 已存在跳过 {skipped} / 失败 {failed}")


if __name__ == "__main__":
    main()

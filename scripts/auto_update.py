#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IoT 求职雷达 — 自动更新脚本(由 GitHub Actions 每天 5:00 / 12:00 触发)

职责:
  1. 校验 data/jobs.js 数据完整性(必填字段 / 链接格式 / id 去重 / 记录数)
  2. 生成 data/updated.js:写入真实更新时间(UTC → 北京时间),保证"最后自动更新"真实可信
  3. 预留 FETCH_SOURCES 配置位:未来接入合规公开数据源后,可在此真正自动抓取岗位

注意:本脚本不伪造任何岗位数据;岗位内容仍由人工维护 + 用户投稿(投稿走 GitHub Issue)。
"""
import json
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
JOBS_FILE = BASE / "data" / "jobs.js"
UPDATED_FILE = BASE / "data" / "updated.js"
MIN_JOBS = 40  # 少于该条数视为数据异常,不提交

# 预留:未来可接入的合规公开数据源(如高校就业网公开 RSS / 企业官方招聘公开接口)
FETCH_SOURCES = []


def beijing_now():
    return datetime.now(timezone(timedelta(hours=8)))


def extract_jobs(text):
    """从 jobs.js 中提取 id 列表与统计(轻量解析,不执行 JS)。"""
    ids = re.findall(r'id:\s*"([^"]+)"', text)
    urls = re.findall(r'url:\s*"([^"]+)"', text)
    companies = re.findall(r'company:\s*"([^"]+)"', text)
    return ids, urls, companies


def validate():
    text = JOBS_FILE.read_text(encoding="utf-8")
    ids, urls, companies = extract_jobs(text)
    errors = []

    if len(ids) < MIN_JOBS:
        errors.append(f"记录数过少:{len(ids)} < {MIN_JOBS}")

    dup = [i for i in set(ids) if ids.count(i) > 1]
    if dup:
        errors.append(f"存在重复 id:{dup[:5]}")

    bad_urls = [u for u in urls if not u.startswith("http")]
    if bad_urls:
        errors.append(f"存在非 http 链接:{bad_urls[:5]}")

    for c in companies:
        if len(c) > 40:
            errors.append(f"公司名过长:{c}")

    return ids, errors


def write_updated(now):
    content = (
        "/* 由 .github/workflows/auto-update.yml 自动生成,请勿手改 */\n"
        "window.SITE_UPDATED = { at: \"%s\" };\n" % now.strftime("%Y-%m-%d %H:%M")
    )
    UPDATED_FILE.write_text(content, encoding="utf-8")


def main():
    print(f"[auto-update] 开始,北京时间 {beijing_now().strftime('%Y-%m-%d %H:%M:%S')}")

    if FETCH_SOURCES:
        print("[auto-update] 已配置数据源,执行抓取(待实现)")
        # TODO: 接入合规公开源后在此实现抓取并写入 JOBS_FILE

    ids, errors = validate()
    if errors:
        print("[auto-update] 校验失败,不生成时间戳:")
        for e in errors:
            print("  -", e)
        sys.exit(1)

    print(f"[auto-update] 校验通过:{len(ids)} 条岗位记录")

    write_updated(beijing_now())
    print(f"[auto-update] 已写入 data/updated.js(真实时间)")

    # 有变更时由 Actions 负责 commit+push(见 auto-update.yml)
    print("[auto-update] 完成")


if __name__ == "__main__":
    main()

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

# 预留:未来可接入的合规公开数据源
# 注意:商业招聘平台(智联/BOSS/牛客/实习僧等)禁止自动化抓取,本站不抓取;
# 仅允许接入 公开、无登录墙、允许访问 的源(如国家大学生就业服务平台公开页)。
# 配置示例:
# FETCH_SOURCES = [
#   {"name": "公开示例源", "url": "https://example.com/jobs", "parser": "json"},
# ]
FETCH_SOURCES = []


def try_fetch_sources():
    """尽力抓取公开数据源(合规)。成功则返回新增岗位列表,失败返回 [] 并记录日志,绝不伪造数据。"""
    if not FETCH_SOURCES:
        print("[auto-update] 未配置数据源,跳过抓取(岗位内容由人工维护 + 用户投稿)")
        return []
    added = []
    for src in FETCH_SOURCES:
        try:
            import urllib.request
            req = urllib.request.Request(src["url"], headers={"User-Agent": "Mozilla/5.0 (IoT-Career-Hub)"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read().decode("utf-8", errors="ignore")
            print(f"[auto-update] 数据源 {src['name']} 抓取成功({len(body)} 字节)")
            # TODO: 按 src["parser"] 解析 body → 生成岗位记录列表并写入 jobs.js(需维护者审核后合入)
        except Exception as e:
            print(f"[auto-update] 数据源 {src['name']} 抓取失败(跳过):{e}")
    return added


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
        added = try_fetch_sources()
        print(f"[auto-update] 本次抓取新增 {len(added)} 条(需审核后合入)")

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

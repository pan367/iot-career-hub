#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IoT 求职雷达 — 半自动投递脚本

功能:读取 config.json 中的投递目标,逐个打开投递页面,
     自动预填通用信息(姓名/电话/邮箱/学校/专业/毕业年份),
     然后【停住等人工确认提交】。

安全设计(请务必遵守):
  * 有头模式(浏览器可见),绝不静默提交;
  * 遇到验证码/滑块/复杂字段直接停住,由人工处理,脚本不绕任何验证;
  * 每次操作之间随机延迟 3~8 秒限速,并受每日上限限制;
  * 请遵守各招聘平台用户协议,控制频率,账号风险自担。

用法:
  pip install -r requirements.txt
  playwright install chromium
  python auto_apply.py            # 正常模式
  python auto_apply.py --dry-run  # 只打印计划,不打开浏览器
"""
import argparse
import json
import random
import sys
import time
from datetime import date
from pathlib import Path

BASE = Path(__file__).resolve().parent
CONFIG = BASE / "config.json"
DAILY_LOG = BASE / "applied_today.txt"


def load_config():
    with open(CONFIG, "r", encoding="utf-8") as f:
        return json.load(f)


def log_applied(url):
    today = str(date.today())
    entries = []
    if DAILY_LOG.exists():
        entries = [l.strip() for l in DAILY_LOG.read_text(encoding="utf-8").splitlines() if l.strip()]
    # 只保留今天之前的历史,今天的重算
    entries = [e for e in entries if not e.startswith(today)]
    entries.append(f"{today} {url}")
    DAILY_LOG.write_text("\n".join(entries), encoding="utf-8")


def count_today():
    today = str(date.today())
    if not DAILY_LOG.exists():
        return 0
    return sum(1 for l in DAILY_LOG.read_text(encoding="utf-8").splitlines() if l.startswith(today))


def fill_common(page, resume):
    """按 label / placeholder 文本匹配通用字段,填不上的跳过(人工补)。"""
    fields = [
        ("姓名", resume.get("name", "")),
        ("手机", resume.get("phone", "")),
        ("电话", resume.get("phone", "")),
        ("邮箱", resume.get("email", "")),
        ("E-mail", resume.get("email", "")),
        ("学校", resume.get("school", "")),
        ("院校", resume.get("school", "")),
        ("专业", resume.get("major", "")),
        ("毕业", resume.get("grad_year", "")),
    ]
    filled = []
    for label, value in fields:
        if not value:
            continue
        try:
            by_label = page.get_by_label(label, exact=False)
            if by_label.count() > 0 and by_label.first().is_editable():
                by_label.first().fill(value)
                filled.append(label)
                continue
        except Exception:
            pass
        try:
            by_ph = page.get_by_placeholder(label)
            if by_ph.count() > 0 and by_ph.first().is_editable():
                by_ph.first().fill(value)
                filled.append(label)
        except Exception:
            pass
    return filled


def run_target(page, target, resume, dry_run):
    url = target["url"]
    print(f"\n=== 目标:{target.get('name', url)} ===")
    print(f"  链接: {url}")
    if target.get("note"):
        print(f"  备注: {target['note']}")
    if dry_run:
        return

    page.goto(url, wait_until="domcontentloaded", timeout=30000)
    time.sleep(2)  # 等页面渲染

    filled = fill_common(page, resume)
    print(f"  已自动预填:{'、'.join(filled) if filled else '无(表单字段不通用,请手动填写)'}")
    print("  ⚠️ 请人工核对信息、处理验证码/复杂字段,并在确认无误后手动点击提交按钮。")
    input("  完成后按回车继续下一个目标(或 Ctrl+C 退出)…")


def main():
    parser = argparse.ArgumentParser(description="半自动投递脚本")
    parser.add_argument("--dry-run", action="store_true", help="只打印计划不打开浏览器")
    args = parser.parse_args()

    config = load_config()
    resume = config.get("resume", {})
    targets = config.get("targets", [])
    daily_limit = int(config.get("daily_limit", 10))

    if not targets:
        print("config.json 中没有投递目标,请先编辑 tools/auto-apply/config.json")
        sys.exit(1)

    if args.dry_run:
        print("=== DRY RUN:以下为目标清单 ===")
        for t in targets:
            print(f"  - {t.get('name', t['url'])}: {t['url']}")
        print(f"\n简历信息:姓名={resume.get('name', '(空)')} 学校={resume.get('school', '(空)')} 专业={resume.get('major', '(空)')}")
        print(f"每日上限:{daily_limit} 个")
        return

    today_count = count_today()
    if today_count >= daily_limit:
        print(f"今日已投递 {today_count} 个,达到每日上限 {daily_limit},明天再来吧。")
        sys.exit(0)

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        try:
            for target in targets:
                if today_count >= daily_limit:
                    print(f"已达到每日上限 {daily_limit},停止。")
                    break
                run_target(page, target, resume, args.dry_run)
                today_count += 1
                log_applied(target["url"])
                if today_count < daily_limit and len(targets) > 1:
                    delay = random.uniform(3, 8)
                    print(f"  限速等待 {delay:.1f} 秒…")
                    time.sleep(delay)
        except KeyboardInterrupt:
            print("\n已手动中断,进度已记录。")
        finally:
            browser.close()

    print("\n完成。请到各平台确认投递结果,并回「投递工作台」标记状态。")


if __name__ == "__main__":
    main()

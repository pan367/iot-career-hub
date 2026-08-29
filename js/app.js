/* ============ 全局工具与路由 ============ */
window.App = (function () {
  "use strict";

  /* 站点配置:部署后填入 "用户名/仓库名",投稿按钮会自动指向 GitHub Issue 模板 */
  const SITE_CONFIG = { repo: "pan367/iot-career-hub" };

  const todayISO = () => {
    const d = new Date();
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  };

  const lsGet = (key, def) => {
    try {
      const v = localStorage.getItem(key);
      return v === null ? def : JSON.parse(v);
    } catch (e) { return def; }
  };
  const lsSet = (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  };

  /* "2026-09-30" → 距今天数(负数=已过) */
  const daysUntil = (iso) => {
    if (!iso) return Infinity;
    const t = new Date(todayISO()).getTime();
    const d = new Date(iso).getTime();
    return Math.round((d - t) / 86400000);
  };

  /* "2026-09-30" → "9月30日";"2026-08-28" → "08-28" */
  const fmtCN = (iso) => {
    if (!iso) return "";
    const p = iso.split("-");
    return `${parseInt(p[1], 10)}月${parseInt(p[2], 10)}日`;
  };
  const fmtShort = (iso) => (iso || "").slice(5).replace("-", "-");

  const escapeHtml = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const COMPANY_HUES = [174, 205, 262, 20, 330, 96, 40, 288, 8, 150, 232, 60];
  const companyAvatar = (name) => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const hue = COMPANY_HUES[h % COMPANY_HUES.length];
    return `<div class="avatar" style="background:hsl(${hue},45%,46%)">${escapeHtml(name.slice(0, 2))}</div>`;
  };

  /* ---------- Toast ---------- */
  let toastTimer = null;
  const toast = (msg) => {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  };

  /* ---------- 复制(兼容非 https 环境) ---------- */
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (_) {}
      document.body.removeChild(ta);
      return ok;
    }
  };

  /* ---------- 主题 ---------- */
  const initTheme = () => {
    const saved = lsGet("iot-hub-theme", null);
    const dark = saved ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.getElementById("themeIcon").textContent = dark ? "☀️" : "🌙";
  };
  const toggleTheme = () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.getElementById("themeIcon").textContent = dark ? "☀️" : "🌙";
    lsSet("iot-hub-theme", dark ? "dark" : "light");
  };

  /* ---------- 页面切换(hash 路由) ---------- */
  const PAGES = ["jobs", "chengdu", "timeline", "interviews", "roadmap", "apply", "submit"];
  const showPage = (name) => {
    if (!PAGES.includes(name)) name = "jobs";
    document.querySelectorAll(".page").forEach(p =>
      p.classList.toggle("active", p.id === "page-" + name));
    document.querySelectorAll("#navTabs .tab").forEach(t =>
      t.classList.toggle("active", t.dataset.page === name));
    window.scrollTo({ top: 0 });
  };
  const initRouter = () => {
    document.getElementById("navTabs").addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (btn) location.hash = "/" + btn.dataset.page;
    });
    const apply = () => showPage((location.hash || "").replace(/^#\//, ""));
    window.addEventListener("hashchange", apply);
    apply();
  };

  /* ---------- 首页统计 ---------- */
  const updateStats = (jobs) => {
    const active = jobs.filter(j => !(j.deadline && daysUntil(j.deadline) < 0));
    const companies = new Set(active.map(j => j.company)).size;
    const expiring = active.filter(j =>
      j.deadline && daysUntil(j.deadline) >= 0 && daysUntil(j.deadline) <= 7).length;
    const latest = jobs.reduce((m, j) => (j.updated && j.updated > m ? j.updated : m), "1970-01-01");

    document.getElementById("heroStats").innerHTML = `
      <div class="stat-card"><div class="stat-num">${active.length}</div><div class="stat-label">在招岗位/项目</div></div>
      <div class="stat-card"><div class="stat-num">${companies}</div><div class="stat-label">覆盖公司</div></div>
      <div class="stat-card"><div class="stat-num">${expiring}</div><div class="stat-label">7 天内截止</div></div>
      <div class="stat-card"><div class="stat-num">${fmtShort(latest)}</div><div class="stat-label">最近更新</div></div>`;
    document.getElementById("lastUpdated").textContent = latest;
  };

  /* ---------- 页脚投稿按钮:跳转到投稿板块 ---------- */
  const initFooter = () => {
    document.getElementById("submitBtn").addEventListener("click", () => {
      location.hash = "/submit";
    });
  };

  const init = () => {
    initTheme();
    initRouter();
    initFooter();
    document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  };

  return {
    SITE_CONFIG, todayISO, lsGet, lsSet, daysUntil, fmtCN, fmtShort,
    escapeHtml, companyAvatar, toast, copyText, updateStats, init,
  };
})();

App.init();

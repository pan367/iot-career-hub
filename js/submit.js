/* ============ 我要投稿(可运行板块) ============
 * 流程:填表 → 生成 GitHub Issue 预填链接跳转(或复制内容发维护者)
 * 展示:通过 GitHub 公开 API 实时拉取仓库 open issues,标题以【投稿】开头的即网友投稿
 */
(function () {
  "use strict";
  const { escapeHtml, lsGet, lsSet, toast, copyText } = App;

  const REPO = App.SITE_CONFIG.repo; // "pan367/iot-career-hub"
  const DRAFT_KEY = "iot-hub-sub-draft";

  const $ = (id) => document.getElementById(id);
  const FIELDS = ["sfCompany", "sfPosition", "sfType", "sfDirection", "sfCity",
    "sfSalary", "sfDeadline", "sfDegree", "sfPlat", "sfUrl", "sfNote", "sfSource"];

  /* ---------- 表单草稿持久化(防误关页面丢内容) ---------- */
  function saveDraft() {
    const draft = {};
    FIELDS.forEach(f => { draft[f] = $(f).value; });
    lsSet(DRAFT_KEY, draft);
  }
  function restoreDraft() {
    const d = lsGet(DRAFT_KEY, null);
    if (!d) return;
    FIELDS.forEach(f => { if (d[f]) $(f).value = d[f]; });
  }

  /* ---------- 组装投稿文本(GitHub body 与微信分享共用) ---------- */
  function buildText() {
    const v = (id) => $(id).value.trim();
    return [
      `**公司名称**: ${v("sfCompany")}`,
      `**岗位名称**: ${v("sfPosition")}`,
      `**类型**: ${v("sfType")}`,
      `**技术方向**: ${v("sfDirection")}`,
      `**工作城市**: ${v("sfCity")}`,
      `**薪资范围**: ${v("sfSalary") || "(未填)"}`,
      `**截止日期**: ${v("sfDeadline") || "招满即止/滚动/未知"}`,
      `**招聘对象**: ${v("sfDegree") || "(未填)"}`,
      `**信息来源平台**: ${v("sfPlat")}`,
      `**投递链接**: ${v("sfUrl")}`,
      `**备注**: ${v("sfNote") || "(无)"}`,
      `**信息来源**: ${v("sfSource")}`,
    ].join("\n");
  }

  function validate() {
    const need = [
      ["sfCompany", "公司名称"], ["sfPosition", "岗位名称"], ["sfCity", "工作城市"],
      ["sfUrl", "投递链接"], ["sfSource", "信息来源"],
    ];
    for (const [id, label] of need) {
      if (!$(id).value.trim()) {
        $(id).focus();
        toast(`请填写「${label}」`);
        return false;
      }
    }
    const url = $("sfUrl").value.trim();
    if (!/^https?:\/\/.+/.test(url)) {
      $("sfUrl").focus();
      toast("投递链接需以 http(s):// 开头");
      return false;
    }
    return true;
  }

  /* ---------- 提交 → GitHub Issue 预填 ---------- */
  function submitToGitHub() {
    const title = `【投稿】${$("sfCompany").value.trim()} - ${$("sfPosition").value.trim()}`;
    const url = `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(buildText())}`;
    window.open(url, "_blank");
  }

  /* ---------- 拉取最新投稿(open issues,标题以【投稿】开头) ---------- */
  async function loadIssues() {
    const box = $("issueList");
    if (!REPO) {
      box.innerHTML = `<p class="issue-loading">未配置仓库,无法拉取投稿列表。</p>`;
      return;
    }
    try {
      const resp = await fetch(`https://api.github.com/repos/${REPO}/issues?state=open&per_page=20&sort=created&direction=desc`, {
        headers: { "Accept": "application/vnd.github+json" },
      });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const issues = await resp.json();
      const subs = issues.filter(i => !i.pull_request && i.title.startsWith("【投稿】"));

      if (!subs.length) {
        box.innerHTML = `<p class="issue-loading">还没有网友投稿,来做第一个吧!</p>`;
        return;
      }
      box.innerHTML = subs.map(i => `
        <div class="issue-card">
          <div class="issue-head">
            <span class="issue-title">${escapeHtml(i.title)}</span>
            <span class="stage-chip current">待审核</span>
          </div>
          <div class="issue-meta">#${i.number} · ${escapeHtml((i.created_at || "").slice(0, 10))} · by ${escapeHtml(i.user && i.user.login ? i.user.login : "匿名")}</div>
          <a class="issue-link" href="${escapeHtml(i.html_url)}" target="_blank" rel="noopener">查看详情 ↗</a>
        </div>`).join("");
    } catch (e) {
      box.innerHTML = `<p class="issue-loading">投稿列表加载失败(GitHub 访问不稳定或限流)。
        <a href="https://github.com/${REPO}/issues?q=is%3Aissue+is%3Aopen+%E3%80%90%E6%8A%95%E7%A8%BF%E3%80%91" target="_blank" rel="noopener">点此到 GitHub 查看 ↗</a></p>`;
    }
  }

  /* ---------- 绑定 ---------- */
  FIELDS.forEach(f => $(f).addEventListener("input", saveDraft));
  restoreDraft();

  $("subForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    saveDraft();
    submitToGitHub();
    toast("已打开 GitHub 投稿页,确认提交即可");
  });

  $("sfCopy").addEventListener("click", async () => {
    if (!validate()) return;
    const text = `【岗位投稿】\n${$("sfCompany").value.trim()} - ${$("sfPosition").value.trim()}\n\n${buildText().replace(/\*\*/g, "")}`;
    const ok = await copyText(text);
    toast(ok ? "已复制,发给维护者微信即可上架" : "复制失败,请手动复制");
  });

  loadIssues();
})();

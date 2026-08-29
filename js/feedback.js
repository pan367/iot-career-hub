/* ============ 反馈与建议板块 ============
 * 流程:填表 → 生成 GitHub Issue 预填链接跳转(或复制内容发维护者)
 * 展示:通过 GitHub 公开 API 实时拉取仓库 open issues,标题以【反馈】开头的反馈列表
 */
(function () {
  "use strict";
  const { escapeHtml, lsGet, lsSet, toast, copyText } = App;

  const REPO = App.SITE_CONFIG.repo; // "pan367/iot-career-hub"
  const DRAFT_KEY = "iot-hub-fb-draft";

  const $ = (id) => document.getElementById(id);

  /* 草稿持久化 */
  ["fbType", "fbContact", "fbContent"].forEach(id => {
    $(id).addEventListener("input", () => {
      lsSet(DRAFT_KEY, { type: $("fbType").value, contact: $("fbContact").value, content: $("fbContent").value });
    });
  });
  const d = lsGet(DRAFT_KEY, null);
  if (d) {
    if (d.type) $("fbType").value = d.type;
    if (d.contact) $("fbContact").value = d.contact;
    if (d.content) $("fbContent").value = d.content;
  }

  const buildText = () => [
    `**反馈类型**: ${$("fbType").value}`,
    `**联系方式**: ${$("fbContact").value.trim() || "(未填)"}`,
    `**反馈内容**:`,
    $("fbContent").value.trim(),
  ].join("\n");

  function validate() {
    if (!$("fbContent").value.trim()) {
      $("fbContent").focus();
      toast("请填写反馈内容");
      return false;
    }
    return true;
  }

  $("fbForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    const title = `【反馈】${$("fbType").value}${$("fbContact").value.trim() ? " - " + $("fbContact").value.trim() : ""}`;
    const url = `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(buildText())}`;
    window.open(url, "_blank");
    toast("已打开 GitHub 反馈页,确认提交即可");
  });

  $("fbCopy").addEventListener("click", async () => {
    if (!validate()) return;
    const ok = await copyText(`【反馈】${$("fbType").value}\n${$("fbContent").value.trim()}\n联系方式:${$("fbContact").value.trim() || "未填"}`);
    toast(ok ? "已复制,发给维护者微信即可" : "复制失败,请手动复制");
  });

  /* 拉取最新反馈 */
  (async function loadFeedbacks() {
    const box = $("fbList");
    if (!REPO) {
      box.innerHTML = `<p class="issue-loading">未配置仓库,无法拉取反馈列表。</p>`;
      return;
    }
    try {
      const resp = await fetch(`https://api.github.com/repos/${REPO}/issues?state=open&per_page=20&sort=created&direction=desc`, {
        headers: { "Accept": "application/vnd.github+json" },
      });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const issues = await resp.json();
      const subs = issues.filter(i => !i.pull_request && i.title.startsWith("【反馈】"));

      if (!subs.length) {
        box.innerHTML = `<p class="issue-loading">还没有人反馈,来说第一条吧!</p>`;
        return;
      }
      box.innerHTML = subs.map(i => `
        <div class="issue-card">
          <div class="issue-head">
            <span class="issue-title">${escapeHtml(i.title)}</span>
            <span class="stage-chip current">待处理</span>
          </div>
          <div class="issue-meta">#${i.number} · ${escapeHtml((i.created_at || "").slice(0, 10))} · by ${escapeHtml(i.user && i.user.login ? i.user.login : "匿名")}</div>
          <a class="issue-link" href="${escapeHtml(i.html_url)}" target="_blank" rel="noopener">查看详情 ↗</a>
        </div>`).join("");
    } catch (err) {
      box.innerHTML = `<p class="issue-loading">反馈列表加载失败(GitHub 访问不稳定或限流)。
        <a href="https://github.com/${REPO}/issues?q=is%3Aissue+is%3Aopen+%E3%80%90%E5%8F%8D%E9%A6%88%E3%80%91" target="_blank" rel="noopener">点此到 GitHub 查看 ↗</a></p>`;
    }
  })();
})();

/* ============ 学历匹配板块 ============
 * 选择学历(本科/硕士/博士)→ 用 App.classifyDegree 归类各岗位 degree 自由文本
 * → 展示可投岗位;选择存 localStorage(iot-hub-degree),与岗位看板学历筛选联动。
 */
(function () {
  "use strict";
  const { escapeHtml, lsGet, lsSet, classifyDegree } = App;

  const DATA = window.JOBS_DATA || [];
  const DEG_K = "iot-hub-degree";
  const DEGREES = ["本科", "硕士", "博士"];

  let myDegree = lsGet(DEG_K, "本科");
  if (!DEGREES.includes(myDegree)) myDegree = "本科";

  const matched = (job) => classifyDegree(job.degree)[myDegree];

  function degreeBadge(job) {
    const set = classifyDegree(job.degree);
    const parts = DEGREES.filter(d => set[d]);
    const label = parts.length === 3 ? "学历不限" : parts.join("/");
    return `<span class="badge b-deg">🎓 ${escapeHtml(label)}</span>`;
  }

  function render() {
    const list = DATA.filter(matched);
    document.getElementById("degList").innerHTML = list.map(j =>
      App.jobCard(j).replace(
        '<span class="badge b-dir">',
        degreeBadge(j) + '<span class="badge b-dir">'
      )
    ).join("");
    document.getElementById("degEmpty").hidden = list.length > 0;
    document.getElementById("degCount").textContent =
      `「${myDegree}」可投 ${list.length} 条 / 共 ${DATA.length} 条`;
  }

  function bind() {
    document.getElementById("degSelect").addEventListener("click", (e) => {
      const card = e.target.closest("[data-deg]");
      if (!card) return;
      myDegree = card.dataset.deg;
      lsSet(DEG_K, myDegree);
      document.querySelectorAll(".deg-card").forEach(c =>
        c.classList.toggle("on", c.dataset.deg === myDegree));
      render();
      /* 通知岗位看板同会话联动更新 */
      window.dispatchEvent(new CustomEvent("iot:degree", { detail: myDegree }));
    });
  }

  /* 初始高亮已存选择 */
  document.querySelectorAll(".deg-card").forEach(c =>
    c.classList.toggle("on", c.dataset.deg === myDegree));

  bind();
  render();
})();

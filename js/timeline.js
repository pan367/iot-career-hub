/* ============ 秋招时间线 ============ */
(function () {
  "use strict";
  const { escapeHtml, companyAvatar, todayISO } = App;

  const DATA = window.TIMELINE_DATA || [];

  function stageStatus(s) {
    if (s.status) return s.status;
    const today = todayISO();
    if (s.end && today > s.end) return "done";
    if (s.date && today >= s.date && (!s.end || today <= s.end)) return "current";
    return "upcoming";
  }

  const CHIP_TEXT = { done: "已结束", current: "进行中", upcoming: "未开始" };

  function companyBlock(c) {
    const stages = c.stages.map(s => {
      const st = stageStatus(s);
      const date = s.end ? `${App.fmtCN(s.date)} ~ ${App.fmtCN(s.end)}` : (s.date ? App.fmtCN(s.date) : "时间以官方为准");
      return `
      <div class="stage ${st}">
        <span class="stage-dot"></span>
        <div class="stage-row">
          <span class="stage-name">${escapeHtml(s.name)}</span>
          <span class="stage-date">${date}</span>
          <span class="stage-chip ${st}">${CHIP_TEXT[st]}</span>
        </div>
        ${s.note ? `<div class="stage-note">${escapeHtml(s.note)}</div>` : ""}
      </div>`;
    }).join("");

    return `
    <div class="tl-company">
      <div class="tl-head">
        ${companyAvatar(c.company)}
        <span class="tl-company-name">${escapeHtml(c.company)}
          <a href="${escapeHtml(c.url)}" target="_blank" rel="noopener">官方投递入口 ↗</a>
        </span>
      </div>
      <div class="stages">${stages}</div>
    </div>`;
  }

  /* 首个有日期的阶段越早的公司排前面(投递早的先看) */
  const sorted = [...DATA].sort((a, b) => {
    const da = (a.stages.find(s => s.date) || {}).date || "9999";
    const db = (b.stages.find(s => s.date) || {}).date || "9999";
    return da.localeCompare(db);
  });

  document.getElementById("timelineList").innerHTML = sorted.map(companyBlock).join("");
})();

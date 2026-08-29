/* ============ 面经与笔试资源(手风琴版) ============ */
(function () {
  "use strict";
  const { escapeHtml } = App;

  const TOPICS = window.EXAM_TOPICS || [];
  const INTERVIEWS = window.INTERVIEW_DATA || [];

  const topicHtml = (t, idx) => `
    <div class="topic-card accordion${idx === 0 ? " open" : ""}">
      <button class="acc-head" aria-expanded="${idx === 0}" data-acc="${idx}">
        <span class="acc-icon">${t.icon || "📘"}</span>
        <span class="acc-title">${escapeHtml(t.topic)}</span>
        <span class="acc-count">${t.items.length} 个知识点</span>
        <span class="acc-arrow">▾</span>
      </button>
      <div class="acc-body">
        ${t.items.map(kp => `
        <div class="kp-item">
          <div class="kp-name">${escapeHtml(kp.name)}</div>
          <p class="kp-desc">${escapeHtml(kp.desc)}</p>
          ${kp.links && kp.links.length ? `
          <div class="kp-links">
            ${kp.links.map(l => `<a class="btn" href="${escapeHtml(l.u)}" target="_blank" rel="noopener">📖 ${escapeHtml(l.t)}</a>`).join("")}
          </div>` : ""}
        </div>`).join("")}
      </div>
    </div>`;

  document.getElementById("topicGrid").innerHTML = TOPICS.map(topicHtml).join("");

  /* 手风琴:点击标题展开/收起,同一时刻只开一个 */
  document.getElementById("topicGrid").addEventListener("click", (e) => {
    const head = e.target.closest(".acc-head");
    if (!head) return;
    const idx = head.dataset.acc;
    const cards = document.querySelectorAll(".topic-card.accordion");
    cards.forEach((c, i) => {
      const open = String(i) === idx && !c.classList.contains("open");
      c.classList.toggle("open", open);
      const h = c.querySelector(".acc-head");
      if (h) h.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.getElementById("interviewList").innerHTML = INTERVIEWS.map(v => `
    <div class="interview-card">
      <div class="interview-head">
        <span class="interview-company">${escapeHtml(v.company)}</span>
        <span class="badge b-dir">${escapeHtml(v.position)}</span>
        <span class="badge b-type">${escapeHtml(v.rounds)}</span>
      </div>
      <p class="interview-points">${escapeHtml(v.points)}</p>
      <a class="interview-src" href="${escapeHtml(v.source)}" target="_blank" rel="noopener">查看原帖 ↗</a>
    </div>`).join("");
})();

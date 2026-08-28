/* ============ 面经与笔试资源 ============ */
(function () {
  "use strict";
  const { escapeHtml } = App;

  const TOPICS = window.EXAM_TOPICS || [];
  const INTERVIEWS = window.INTERVIEW_DATA || [];

  document.getElementById("topicGrid").innerHTML = TOPICS.map(t => `
    <div class="topic-card">
      <div class="topic-title">${escapeHtml(t.topic)}</div>
      <ul>${t.points.map(p => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
    </div>`).join("");

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

/* ============ 学习路线与技能准备 ============ */
(function () {
  "use strict";
  const { escapeHtml, lsGet, lsSet } = App;

  const DATA = window.ROADMAP_DATA || [];
  const KEY = "iot-hub-checklist";
  let done = lsGet(KEY, {});

  const itemKey = (dirId, idx) => `${dirId}::${idx}`;

  function updateProgress(dirId) {
    const card = document.querySelector(`[data-dir="${dirId}"]`);
    if (!card) return;
    const boxes = card.querySelectorAll("input[type=checkbox]");
    const checked = card.querySelectorAll("input[type=checkbox]:checked").length;
    const pct = boxes.length ? Math.round((checked / boxes.length) * 100) : 0;
    card.querySelector(".progress-bar").style.width = pct + "%";
    card.querySelector(".road-pct").textContent = pct + "%";
  }

  const cardHtml = (dir) => `
    <div class="road-card" data-dir="${dir.id}">
      <div class="road-head">
        <span class="road-icon">${dir.icon || "📘"}</span>
        <span class="road-name">${escapeHtml(dir.name)}</span>
        <span class="road-pct">0%</span>
      </div>
      <div class="progress"><div class="progress-bar"></div></div>
      <ul class="road-items">
        ${dir.items.map((it, i) => `
        <li class="road-item">
          <label>
            <input type="checkbox" data-key="${itemKey(dir.id, i)}">
            <span>${escapeHtml(it.name)}</span>
          </label>
          ${it.res && it.res.length ? `
          <div class="road-res">
            ${it.res.filter(r => r.u).map(r =>
              `<a href="${escapeHtml(r.u)}" target="_blank" rel="noopener">📖 ${escapeHtml(r.t)}</a>`).join("")}
            ${it.res.filter(r => !r.u).map(r =>
              `<span class="badge">${escapeHtml(r.t)}</span>`).join("")}
          </div>` : ""}
        </li>`).join("")}
      </ul>
    </div>`;

  const container = document.getElementById("roadmapList");
  container.innerHTML = DATA.map(cardHtml).join("");

  container.querySelectorAll("input[type=checkbox]").forEach(box => {
    if (done[box.dataset.key]) box.checked = true;
    box.addEventListener("change", () => {
      if (box.checked) done[box.dataset.key] = true;
      else delete done[box.dataset.key];
      lsSet(KEY, done);
      updateProgress(box.closest(".road-card").dataset.dir);
    });
  });

  DATA.forEach(d => updateProgress(d.id));
})();

/* ============ 岗位看板 ============ */
(function () {
  "use strict";
  const { escapeHtml, companyAvatar, daysUntil, fmtCN, fmtShort, lsGet, lsSet, toast, copyText } = App;

  const DATA = window.JOBS_DATA || [];
  const FAV_KEY = "iot-hub-favs";
  let favs = lsGet(FAV_KEY, []);

  const state = {
    q: "", type: "all", direction: "all", city: "all",
    sort: "deadline", hideExpired: false, favOnly: false,
  };

  const isExpired = (j) => j.deadline && daysUntil(j.deadline) < 0;

  function deadlineInfo(j) {
    if (!j.deadline) return { cls: "rolling", label: "招满即止 / 滚动招聘" };
    const d = daysUntil(j.deadline);
    if (d < 0) return { cls: "expired", label: "已截止" };
    if (d === 0) return { cls: "urgent", label: "今天截止!" };
    if (d <= 3) return { cls: "urgent", label: `${d} 天后截止` };
    if (d <= 7) return { cls: "soon", label: `${d} 天后截止` };
    return { cls: "ok", label: `${fmtCN(j.deadline)}截止` };
  }

  function jobCard(j) {
    const dl = deadlineInfo(j);
    const expired = isExpired(j);
    const on = favs.includes(j.id);

    return `
    <article class="job-card${expired ? " expired" : ""}">
      <div class="job-head">
        ${companyAvatar(j.company)}
        <div class="job-title-wrap">
          <div class="job-company">${escapeHtml(j.company)}</div>
          <div class="badges">
            <span class="badge b-type">${escapeHtml(j.type)}</span>
            <span class="badge b-dir">${escapeHtml(j.direction)}</span>
          </div>
        </div>
        <button class="star${on ? " on" : ""}" data-fav="${j.id}" title="收藏">★</button>
      </div>
      <div class="job-position">${escapeHtml(j.position)}</div>
      <div class="job-meta">
        ${j.salary ? `<span>💰 ${escapeHtml(j.salary)}</span>` : ""}
        <span>📍 ${escapeHtml(j.city)}</span>
        <span>🎓 ${escapeHtml(j.degree)}</span>
      </div>
      <p class="job-note">${escapeHtml(j.note)}</p>
      <div class="job-foot">
        <span class="dl-badge ${dl.cls}">${dl.label}</span>
        <div class="job-actions">
          <button class="btn" data-copy="${escapeHtml(j.id)}" title="复制为群聊分享文案">复制</button>
          <a class="btn btn-primary" href="${escapeHtml(j.url)}" target="_blank" rel="noopener">去投递 ↗</a>
        </div>
      </div>
      <div class="updated">信息更新于 ${fmtShort(j.updated)}</div>
    </article>`;
  }

  function applyFilter() {
    let list = DATA.filter(j => {
      if (state.type !== "all" && j.type !== state.type) return false;
      if (state.direction !== "all" && j.direction !== state.direction) return false;
      if (state.city !== "all" && j.city.split("/").map(s => s.trim()).indexOf(state.city) === -1) return false;
      if (state.favOnly && !favs.includes(j.id)) return false;
      if (state.hideExpired && isExpired(j)) return false;
      if (state.q) {
        const hay = (j.company + j.position + j.note + j.direction + j.city).toLowerCase();
        if (!hay.includes(state.q.toLowerCase())) return false;
      }
      return true;
    });

    if (state.sort === "deadline") {
      list.sort((a, b) => {
        const da = a.deadline ? daysUntil(a.deadline) : Infinity;
        const db = b.deadline ? daysUntil(b.deadline) : Infinity;
        if (da < 0 && db < 0) return da - db;
        if (da < 0) return 1;
        if (db < 0) return -1;
        return da - db;
      });
    } else {
      list.sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
    }
    return list;
  }

  function render() {
    const list = applyFilter();
    document.getElementById("jobsList").innerHTML = list.map(jobCard).join("");
    document.getElementById("jobsEmpty").hidden = list.length > 0;
    document.getElementById("jobsCount").textContent =
      `共 ${DATA.length} 条信息,当前展示 ${list.length} 条`;
  }

  function buildOptions() {
    const directions = [...new Set(DATA.map(j => j.direction))];
    const cities = [...new Set(DATA.flatMap(j => j.city.split("/").map(s => s.trim())))].sort();
    document.getElementById("fDirection").innerHTML =
      `<option value="all">全部方向</option>` +
      directions.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("");
    document.getElementById("fCity").innerHTML =
      `<option value="all">全部城市</option>` +
      cities.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  }

  function bindEvents() {
    document.getElementById("fSearch").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
    document.getElementById("fType").addEventListener("change", e => { state.type = e.target.value; render(); });
    document.getElementById("fDirection").addEventListener("change", e => { state.direction = e.target.value; render(); });
    document.getElementById("fCity").addEventListener("change", e => { state.city = e.target.value; render(); });
    document.getElementById("fSort").addEventListener("change", e => { state.sort = e.target.value; render(); });
    document.getElementById("fHideExpired").addEventListener("change", e => { state.hideExpired = e.target.checked; render(); });
    document.getElementById("fFavOnly").addEventListener("change", e => { state.favOnly = e.target.checked; render(); });

    const listEl = document.getElementById("jobsList");
    listEl.addEventListener("click", async (e) => {
      const star = e.target.closest("[data-fav]");
      if (star) {
        const id = star.dataset.fav;
        favs = favs.includes(id) ? favs.filter(f => f !== id) : favs.concat(id);
        lsSet(FAV_KEY, favs);
        star.classList.toggle("on", favs.includes(id));
        if (state.favOnly) render();
        return;
      }
      const cp = e.target.closest("[data-copy]");
      if (cp) {
        const job = DATA.find(j => j.id === cp.dataset.copy);
        const ok = await copyText([
          `【${job.company}】${job.position}`,
          `类型:${job.type} | 方向:${job.direction} | 城市:${job.city}`,
          `截止:${deadlineInfo(job).label}`,
          `投递:${job.url}`,
          `—— 来自「IoT 求职雷达」`,
        ].join("\n"));
        toast(ok ? "已复制分享文案,去粘贴给同学吧" : "复制失败,请手动复制");
      }
    });
  }

  buildOptions();
  bindEvents();
  render();
  App.updateStats(DATA);

  /* 供成都专场复用同一卡片渲染与交互 */
  App.jobCard = jobCard;
})();

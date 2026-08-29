/* ============ 成都专场 ============ */
(function () {
  "use strict";
  const { escapeHtml, daysUntil, fmtCN } = App;

  /* 复用岗位看板的卡片渲染:由 jobs.js 暴露到 App.jobCard */
  const DATA = (window.JOBS_DATA || []).filter(j => j.city.split("/").map(s => s.trim()).includes("成都"));

  const state = { q: "", type: "all", direction: "all", hideExpired: false };

  const isExpired = (j) => j.deadline && daysUntil(j.deadline) < 0;

  function applyFilter() {
    let list = DATA.filter(j => {
      if (state.type !== "all" && j.type !== state.type) return false;
      if (state.direction !== "all" && j.direction !== state.direction) return false;
      if (state.hideExpired && isExpired(j)) return false;
      if (state.q) {
        const hay = (j.company + j.position + j.note + j.direction).toLowerCase();
        if (!hay.includes(state.q.toLowerCase())) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      const da = a.deadline ? daysUntil(a.deadline) : Infinity;
      const db = b.deadline ? daysUntil(b.deadline) : Infinity;
      if (da < 0 && db < 0) return da - db;
      if (da < 0) return 1;
      if (db < 0) return -1;
      return da - db;
    });
    return list;
  }

  function render() {
    const list = applyFilter();
    document.getElementById("chengduList").innerHTML =
      list.map(j => App.jobCard(j)).join("");
    document.getElementById("chengduEmpty").hidden = list.length > 0;
    document.getElementById("cdCount").textContent =
      `成都地区共 ${DATA.length} 条信息,当前展示 ${list.length} 条`;
  }

  function buildStats() {
    const active = DATA.filter(j => !isExpired(j));
    const companies = new Set(active.map(j => j.company.replace(/\(.*?\)/g, "").trim())).size;
    document.getElementById("chengduStats").innerHTML = `
      <div class="stat-card"><div class="stat-num">${active.length}</div><div class="stat-label">在招岗位</div></div>
      <div class="stat-card"><div class="stat-num">${companies}</div><div class="stat-label">在蓉招聘单位</div></div>`;
  }

  function buildOptions() {
    const directions = [...new Set(DATA.map(j => j.direction))];
    document.getElementById("cdDirection").innerHTML =
      `<option value="all">全部方向</option>` +
      directions.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("");
  }

  function bindEvents() {
    document.getElementById("cdSearch").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
    document.getElementById("cdType").addEventListener("change", e => { state.type = e.target.value; render(); });
    document.getElementById("cdDirection").addEventListener("change", e => { state.direction = e.target.value; render(); });
    document.getElementById("cdHideExpired").addEventListener("change", e => { state.hideExpired = e.target.checked; render(); });

    /* 收藏/复制与岗位看板共用 localStorage 与逻辑 */
    document.getElementById("chengduList").addEventListener("click", async (e) => {
      const star = e.target.closest("[data-fav]");
      if (star) {
        const FAV_KEY = "iot-hub-favs";
        let favs = App.lsGet(FAV_KEY, []);
        const id = star.dataset.fav;
        favs = favs.includes(id) ? favs.filter(f => f !== id) : favs.concat(id);
        App.lsSet(FAV_KEY, favs);
        star.classList.toggle("on", favs.includes(id));
        return;
      }
      const cp = e.target.closest("[data-copy]");
      if (cp) {
        const job = (window.JOBS_DATA || []).find(j => j.id === cp.dataset.copy);
        const dl = job.deadline
          ? (daysUntil(job.deadline) < 0 ? "已截止" : `${fmtCN(job.deadline)}截止`)
          : "招满即止 / 滚动招聘";
        const ok = await App.copyText([
          `【${job.company}】${job.position}`,
          `类型:${job.type} | 方向:${job.direction} | 城市:${job.city}`,
          `截止:${dl}`,
          `投递:${job.url}`,
          `—— 来自「IoT 求职雷达」`,
        ].join("\n"));
        App.toast(ok ? "已复制分享文案,去粘贴给同学吧" : "复制失败,请手动复制");
      }
    });
  }

  buildStats();
  buildOptions();
  bindEvents();
  render();
})();

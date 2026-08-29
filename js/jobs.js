/* ============ 岗位看板 ============ */
(function () {
  "use strict";
  const { escapeHtml, companyAvatar, daysUntil, fmtCN, fmtShort, lsGet, lsSet, toast, copyText } = App;

  const DATA = window.JOBS_DATA || [];
  const FAV_KEY = "iot-hub-favs";
  let favs = lsGet(FAV_KEY, []);

  const state = {
    q: "", type: "all", direction: "all", city: "all", degree: "all",
    ctype: "all", verifiedOnly: false, safeOnly: true,
    sort: "deadline", hideExpired: false, favOnly: false,
  };

  /* 学历筛选默认值:与「学历匹配」板块联动(localStorage) */
  (function initDegree() {
    const saved = lsGet("iot-hub-degree", "all");
    state.degree = ["本科", "硕士", "博士"].includes(saved) ? saved : "all";
    const sel = document.getElementById("fDegree");
    if (sel && state.degree !== "all") sel.value = state.degree;
    /* 同会话内学历板块切换时实时联动 */
    window.addEventListener("iot:degree", (e) => {
      state.degree = e.detail;
      const sel2 = document.getElementById("fDegree");
      if (sel2) sel2.value = e.detail;
      render();
    });
  })();

  const isExpired = (j) => j.deadline && daysUntil(j.deadline) < 0;

  const ctInfo = (j) => window.getCompanyType ? window.getCompanyType(j.company) : { type: "其他", verified: false, risky: false };

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
            ${ctInfo(j).verified ? `<span class="badge b-ok">✓ 知名企业</span>` : ""}
            ${ctInfo(j).risky ? `<span class="badge b-risky">⚠ 谨慎核实</span>` : ""}
            <span class="badge b-plat">📥 ${escapeHtml(j.platform || "官网收录")}</span>
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
          <button class="btn" data-opt="${escapeHtml(j.id)}" title="按此岗位方向优化简历">简历优化</button>
          <button class="btn" data-plat="${escapeHtml(j.id)}" title="在智联/BOSS/牛客/实习僧搜索该公司">🔎 平台搜</button>
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
      if (state.degree !== "all" && !App.degreeMatched(j.degree, state.degree)) return false;
      const ct = window.getCompanyType ? window.getCompanyType(j.company) : { type: "其他", verified: false, risky: false };
      if (state.ctype !== "all" && ct.type !== state.ctype) return false;
      if (state.verifiedOnly && !ct.verified) return false;
      if (state.safeOnly && ct.risky) return false;
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
    const ctypes = window.COMPANY_TYPES ? [...new Set(Object.values(window.COMPANY_TYPES).map(c => c.type))].sort() : [];
    document.getElementById("fDirection").innerHTML =
      `<option value="all">全部方向</option>` +
      directions.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("");
    document.getElementById("fCity").innerHTML =
      `<option value="all">全部城市</option>` +
      cities().map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
    document.getElementById("fCtype").innerHTML =
      `<option value="all">全部公司类型</option>` +
      ctypes.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
  }
  const cities = () => [...new Set(DATA.flatMap(j => j.city.split("/").map(s => s.trim())))].sort();

  function bindEvents() {
    document.getElementById("fSearch").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
    document.getElementById("fType").addEventListener("change", e => { state.type = e.target.value; render(); });
    document.getElementById("fDirection").addEventListener("change", e => { state.direction = e.target.value; render(); });
    document.getElementById("fCity").addEventListener("change", e => { state.city = e.target.value; render(); });
    document.getElementById("fDegree").addEventListener("change", e => {
      state.degree = e.target.value;
      lsSet("iot-hub-degree", state.degree === "all" ? null : state.degree);
      render();
    });
    document.getElementById("fCtype").addEventListener("change", e => { state.ctype = e.target.value; render(); });
    document.getElementById("fVerified").addEventListener("change", e => { state.verifiedOnly = e.target.checked; render(); });
    document.getElementById("fSafe").addEventListener("change", e => { state.safeOnly = e.target.checked; render(); });
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
        return;
      }
      const opt = e.target.closest("[data-opt]");
      if (opt) {
        const job = DATA.find(j => j.id === opt.dataset.opt);
        const dirMap = { "嵌入式软件": "embedded", "硬件": "hardware", "物联网平台": "iot", "驱动": "driver", "测试": "test", "算法": "algorithm" };
        location.hash = "/resume?dir=" + (dirMap[job.direction] || "embedded");
        return;
      }
      const plat = e.target.closest("[data-plat]");
      if (plat) {
        const job = DATA.find(j => j.id === plat.dataset.plat);
        const kw = encodeURIComponent(job.company.replace(/\s*\(.*?\)/g, ""));
        const urls = [
          `https://sou.zhaopin.com/?kw=${kw}`,
          `https://www.zhipin.com/web/geek/job?query=${kw}`,
          `https://www.nowcoder.com/search?type=post&query=${kw}`,
          `https://www.shixiseng.com/interns?k=${kw}`,
        ];
        urls.forEach(u => window.open(u, "_blank"));
        toast("已在智联/BOSS/牛客/实习僧打开该公司搜索页");
      }
    });
  }

  buildOptions();
  bindEvents();
  render();
  App.updateStats(DATA);

  /* 动态模式:云端数据到达后重渲染看板与统计 */
  window.addEventListener("iot:jobs-dynamic", () => {
    buildOptions();
    render();
    App.updateStats(DATA);
  });

  /* 供成都专场复用同一卡片渲染与交互 */
  App.jobCard = jobCard;
})();

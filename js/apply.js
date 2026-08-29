/* ============ 投递工作台 ============
 * 功能:简历信息库(localStorage) / 投递清单状态跟踪 / 一键打开投递页 /
 *      批量打开待投递 / 一键生成投递摘要(复制到平台求职信/备注栏)
 * 完全离线可用:所有状态存 localStorage。
 */
(function () {
  "use strict";
  const { escapeHtml, lsGet, lsSet, toast, copyText, fmtShort } = App;

  const JOBS = window.JOBS_DATA || [];
  const ST_K = "iot-hub-apply-status";   // { jobId: "todo|applied|written|interview|offer|dropped" }
  const RS_K = "iot-hub-resume";         // 简历信息

  const STEPS = {
    todo:      { label: "待投递",  cls: "upcoming", order: 0 },
    applied:   { label: "已投递",  cls: "current",  order: 1 },
    written:   { label: "笔试中",  cls: "current",  order: 2 },
    interview: { label: "面试中",  cls: "current",  order: 3 },
    offer:     { label: "已拿Offer", cls: "done",   order: 4 },
    dropped:   { label: "已放弃",  cls: "done",     order: 4 },
  };

  let status = lsGet(ST_K, {});
  const state = { q: "", filter: "all" };

  const setStatus = (id, st) => {
    status[id] = st;
    lsSet(ST_K, status);
  };

  /* ---------- 简历信息库 ---------- */
  const resumeFields = ["apName", "apPhone", "apEmail", "apSchool", "apMajor", "apGrad", "apSkills", "apSummary"];
  function saveResume() {
    const r = {};
    resumeFields.forEach(f => { r[f] = document.getElementById(f).value; });
    lsSet(RS_K, r);
    toast("简历信息已保存(存于本机浏览器)");
  }
  function loadResume() {
    const r = lsGet(RS_K, null);
    if (!r) return;
    resumeFields.forEach(f => {
      if (r[f] !== undefined) document.getElementById(f).value = r[f];
    });
  }
  function getResume() {
    const r = {};
    resumeFields.forEach(f => { r[f] = document.getElementById(f).value.trim(); });
    return r;
  }

  /* ---------- 生成投递摘要(求职信/备注) ---------- */
  function buildSummary(job) {
    const r = getResume();
    const lines = [];
    const who = [r.apName, r.apSchool, r.apMajor, r.apGrad ? r.apGrad + " 届" : ""].filter(Boolean).join(" · ");
    if (who) lines.push(`您好,我是${who}。`);
    if (r.apSkills) lines.push(`技能:${r.apSkills}`);
    if (r.apSummary) lines.push(r.apSummary);
    lines.push(`我关注到贵司「${job.position}」一职(工作地点:${job.city}),方向与我的专业背景高度契合,希望有机会参与面试。`);
    if (r.apPhone) lines.push(`联系方式:${r.apPhone}${r.apEmail ? " / " + r.apEmail : ""}`);
    lines.push(`(本简历信息由「IoT 求职雷达」投递工作台生成,可自行修改后使用)`);
    return lines.join("\n");
  }

  /* ---------- 渲染清单 ---------- */
  function applyList() {
    let list = JOBS.filter(j => {
      if (state.q) {
        const hay = (j.company + j.position + j.city).toLowerCase();
        if (!hay.includes(state.q.toLowerCase())) return false;
      }
      if (state.filter !== "all" && (status[j.id] || "todo") !== state.filter) return false;
      return true;
    });
    list.sort((a, b) => {
      const oa = STEPS[status[a.id] || "todo"].order;
      const ob = STEPS[status[b.id] || "todo"].order;
      return oa - ob || (a.company || "").localeCompare(b.company || "", "zh");
    });
    return list;
  }

  function cardHtml(j) {
    const st = status[j.id] || "todo";
    const step = STEPS[st];
    return `
    <article class="job-card">
      <div class="job-head">
        ${App.companyAvatar(j.company)}
        <div class="job-title-wrap">
          <div class="job-company">${escapeHtml(j.company)}</div>
          <div class="badges">
            <span class="badge b-type">${escapeHtml(j.type)}</span>
            <span class="badge b-dir">${escapeHtml(j.direction)}</span>
            <span class="stage-chip ${step.cls}">${step.label}</span>
          </div>
        </div>
      </div>
      <div class="job-position">${escapeHtml(j.position)}</div>
      <div class="job-meta"><span>📍 ${escapeHtml(j.city)}</span>${j.deadline ? `<span>⏰ 截止 ${escapeHtml(j.deadline)}</span>` : ""}</div>
      <div class="apply-ops">
        ${Object.entries(STEPS).map(([k, v]) =>
          `<button class="btn st-btn${st === k ? " on" : ""}" data-st="${k}" data-id="${escapeHtml(j.id)}">${v.label}</button>`).join("")}
      </div>
      <div class="job-foot">
        <a class="btn btn-primary" href="${escapeHtml(j.url)}" target="_blank" rel="noopener">打开投递页 ↗</a>
        <button class="btn" data-sum="${escapeHtml(j.id)}">生成摘要</button>
      </div>
    </article>`;
  }

  function render() {
    const list = applyList();
    document.getElementById("applyList").innerHTML = list.map(cardHtml).join("");
    document.getElementById("apCount").textContent =
      `共 ${JOBS.length} 条岗位,当前展示 ${list.length} 条`;
    renderStats();
  }

  function renderStats() {
    const counts = { todo: 0, applied: 0, written: 0, interview: 0, offer: 0, dropped: 0 };
    JOBS.forEach(j => { counts[status[j.id] || "todo"]++; });
    const done = counts.offer + counts.dropped;
    const progressed = counts.applied + counts.written + counts.interview + counts.offer;
    const pct = JOBS.length ? Math.round((progressed / JOBS.length) * 100) : 0;

    document.getElementById("applyStats").innerHTML = `
      <div class="stat-card"><div class="stat-num">${counts.todo}</div><div class="stat-label">待投递</div></div>
      <div class="stat-card"><div class="stat-num">${counts.applied}</div><div class="stat-label">已投递</div></div>
      <div class="stat-card"><div class="stat-num">${counts.interview}</div><div class="stat-label">面试中</div></div>
      <div class="stat-card"><div class="stat-num">${counts.offer}</div><div class="stat-label">Offer</div></div>
      <div class="stat-card"><div class="stat-num">${done}</div><div class="stat-label">已结束</div></div>`;
    document.getElementById("applyBar").style.width = pct + "%";
    document.getElementById("applyBarText").textContent =
      `已推进 ${progressed}/${JOBS.length} 条(${pct}%)${counts.interview ? `,面试中 ${counts.interview} 家,加油!` : ""}`;
  }

  /* ---------- 事件 ---------- */
  function bind() {
    document.getElementById("apSave").addEventListener("click", saveResume);
    document.getElementById("apClear").addEventListener("click", () => {
      resumeFields.forEach(f => { document.getElementById(f).value = ""; });
      lsSet(RS_K, {});
      toast("简历信息已清空");
    });

    document.getElementById("apSearch").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
    document.getElementById("apFilter").addEventListener("change", e => { state.filter = e.target.value; render(); });

    document.getElementById("apOpenAll").addEventListener("click", () => {
      const todos = JOBS.filter(j => (status[j.id] || "todo") === "todo" && j.url);
      if (!todos.length) { toast("没有待投递的岗位了"); return; }
      todos.forEach(j => window.open(j.url, "_blank"));
      toast(`已打开 ${todos.length} 个投递页,投递后记得回来标记状态`);
    });

    document.getElementById("apReset").addEventListener("click", () => {
      if (!confirm("确定重置全部投递状态?")) return;
      status = {};
      lsSet(ST_K, status);
      render();
      toast("已重置全部状态");
    });

    document.getElementById("applyList").addEventListener("click", async (e) => {
      const stBtn = e.target.closest("[data-st]");
      if (stBtn) {
        setStatus(stBtn.dataset.id, stBtn.dataset.st);
        render();
        return;
      }
      const sumBtn = e.target.closest("[data-sum]");
      if (sumBtn) {
        const job = JOBS.find(j => j.id === sumBtn.dataset.sum);
        const r = getResume();
        if (!r.apName && !r.apSchool) {
          toast("请先在「简历信息库」填写姓名或学校");
          return;
        }
        const ok = await copyText(buildSummary(job));
        toast(ok ? "投递摘要已复制,去平台求职信栏粘贴吧" : "复制失败,请手动复制");
      }
    });
  }

  loadResume();
  bind();
  render();
})();

/* ============ 简历工坊 ============
 * 功能:在线编辑简历 → 实时 A4 预览 → 打印/另存 PDF;
 *      一键体检打分(完整性/格式/量化/关键词);
 *      按岗位方向优化(补关键词/自我评价模板/项目重排/匹配报告)。
 * 数据存 localStorage(iot-hub-resume-doc),输入即自动保存,完全离线可用。
 */
(function () {
  "use strict";
  const { escapeHtml, lsGet, lsSet, toast } = App;

  const DIRECTIONS = window.RESUME_DIRECTIONS || [];
  const DOC_K = "iot-hub-resume-doc";
  const WORK_K = "iot-hub-resume"; // 投递工作台简历信息库(联动预填)
  const DIR_MAP = { "嵌入式软件": "embedded", "硬件": "hardware", "物联网平台": "iot", "驱动": "driver", "测试": "test", "算法": "algorithm" };

  const emptyDoc = () => ({
    basic: { name: "", phone: "", email: "", city: "", intent: "" },
    edu: [], skills: "", projects: [], exp: [], honors: "", summary: "",
  });

  let doc = lsGet(DOC_K, null) || emptyDoc();
  let dirId = "embedded";
  const $ = (id) => document.getElementById(id);

  /* ================= 数据联动:投递工作台 → 工坊(仅当工坊为空) ================= */
  function prefillFromWorkbench() {
    if (doc.basic.name || doc.edu.length) return; // 已有内容不覆盖
    const w = lsGet(WORK_K, null);
    if (!w) return;
    const b = doc.basic;
    b.name = w.apName || "";
    b.phone = w.apPhone || "";
    b.email = w.apEmail || "";
    if (w.apSchool || w.apMajor) {
      doc.edu.push({ school: w.apSchool || "", major: w.apMajor || "", degree: "", start: "", end: "", courses: "" });
    }
    doc.skills = w.apSkills || "";
    doc.summary = w.apSummary || "";
    save();
    renderAll();
  }

  /* ================= 保存 ================= */
  function save() { lsSet(DOC_K, doc); }

  /* ================= 表单渲染(教育/项目/实践 动态行) ================= */
  function renderEdu() {
    $("rEdu").innerHTML = doc.edu.map((e, i) => `
      <div class="resume-row" data-i="${i}">
        <input class="re-school" placeholder="学校" value="${escapeHtml(e.school)}">
        <input class="re-major" placeholder="专业" value="${escapeHtml(e.major)}">
        <input class="re-degree" placeholder="学历" value="${escapeHtml(e.degree)}">
        <input class="re-start" placeholder="起(2023.09)" value="${escapeHtml(e.start)}">
        <input class="re-end" placeholder="止(2027.06)" value="${escapeHtml(e.end)}">
        <input class="re-courses" placeholder="主修课程(可选)" value="${escapeHtml(e.courses)}">
        <button class="btn re-del" data-i="${i}">删除</button>
      </div>`).join("");
  }
  function renderProjects() {
    $("rProjects").innerHTML = doc.projects.map((p, i) => `
      <div class="resume-row" data-i="${i}">
        <input class="rp-name" placeholder="项目名称" value="${escapeHtml(p.name)}">
        <input class="rp-role" placeholder="担任角色" value="${escapeHtml(p.role)}">
        <input class="rp-start" placeholder="起" value="${escapeHtml(p.start)}">
        <input class="rp-end" placeholder="止" value="${escapeHtml(p.end)}">
        <input class="rp-tech" placeholder="技术栈(逗号分隔)" value="${escapeHtml(p.tech)}">
        <textarea class="rp-desc" rows="2" placeholder="项目描述:做了什么、怎么做的、结果如何(尽量量化)">${escapeHtml(p.desc)}</textarea>
        <button class="btn re-del" data-i="${i}">删除</button>
      </div>`).join("");
  }
  function renderExp() {
    $("rExp").innerHTML = doc.exp.map((e, i) => `
      <div class="resume-row" data-i="${i}">
        <input class="re-org" placeholder="组织/单位" value="${escapeHtml(e.org)}">
        <input class="re-role" placeholder="角色" value="${escapeHtml(e.role)}">
        <input class="re-start" placeholder="起" value="${escapeHtml(e.start)}">
        <input class="re-end" placeholder="止" value="${escapeHtml(e.end)}">
        <textarea class="re-desc" rows="2" placeholder="做了什么(尽量量化)">${escapeHtml(e.desc)}</textarea>
        <button class="btn re-del" data-i="${i}">删除</button>
      </div>`).join("");
  }

  function renderLists() { renderEdu(); renderProjects(); renderExp(); }

  /* ================= 预览(A4 纸张) ================= */
  function section(title, body) {
    return `<div class="paper-section"><h5>${title}</h5>${body}</div>`;
  }
  function renderPreview() {
    const b = doc.basic;
    let html = `<div class="paper-head">
        <div class="paper-name">${escapeHtml(b.name) || "你的姓名"}</div>
        <div class="paper-contact">${[b.phone, b.email, b.city].filter(Boolean).map(escapeHtml).join(" · ")}</div>
        ${b.intent ? `<div class="paper-intent">求职意向:${escapeHtml(b.intent)}</div>` : ""}
      </div>`;

    if (doc.edu.length) {
      html += section("教育背景", doc.edu.map(e => `
        <div class="paper-item">
          <div class="pi-head"><b>${escapeHtml(e.school) || "学校"}</b><span>${escapeHtml(e.degree)}</span><span>${escapeHtml(e.start)}${e.start && e.end ? " ~ " : ""}${escapeHtml(e.end)}</span></div>
          <div class="pi-sub">${escapeHtml(e.major)}${e.courses ? `<span class="pi-courses">主修:${escapeHtml(e.courses)}</span>` : ""}</div>
        </div>`).join(""));
    }
    if (doc.skills.trim()) {
      const chips = doc.skills.split(/[,，、;；]/).map(s => s.trim()).filter(Boolean);
      html += section("专业技能", `<div class="paper-skills">${chips.map(s => `<span class="ps-chip">${escapeHtml(s)}</span>`).join("")}</div>`);
    }
    if (doc.projects.length) {
      html += section("项目经历", doc.projects.map(p => `
        <div class="paper-item">
          <div class="pi-head"><b>${escapeHtml(p.name) || "项目"}</b><span>${escapeHtml(p.role)}</span><span>${escapeHtml(p.start)}${p.start && p.end ? " ~ " : ""}${escapeHtml(p.end)}</span></div>
          ${p.tech ? `<div class="pi-sub">技术栈:${escapeHtml(p.tech)}</div>` : ""}
          ${p.desc ? `<div class="pi-desc">${escapeHtml(p.desc)}</div>` : ""}
        </div>`).join(""));
    }
    if (doc.exp.length) {
      html += section("实践经历", doc.exp.map(e => `
        <div class="paper-item">
          <div class="pi-head"><b>${escapeHtml(e.org) || "单位"}</b><span>${escapeHtml(e.role)}</span><span>${escapeHtml(e.start)}${e.start && e.end ? " ~ " : ""}${escapeHtml(e.end)}</span></div>
          ${e.desc ? `<div class="pi-desc">${escapeHtml(e.desc)}</div>` : ""}
        </div>`).join(""));
    }
    if (doc.honors.trim()) html += section("证书奖项", `<div class="pi-desc">${escapeHtml(doc.honors)}</div>`);
    if (doc.summary.trim()) html += section("自我评价", `<div class="pi-desc">${escapeHtml(doc.summary)}</div>`);

    $("rPaper").innerHTML = html;
  }

  /* ================= 一键体检 ================= */
  function runCheck() {
    const report = [];
    let score = 0;
    const add = (label, pass, advice, pts, weight) => {
      report.push({ label, pass, advice });
      if (pass) score += weight;
    };
    const b = doc.basic;

    // 1. 基本信息完整性(15)
    const miss = [["name", "姓名"], ["phone", "电话"], ["email", "邮箱"], ["intent", "求职意向"]].filter(([k]) => !b[k]).map(x => x[1]);
    add("基本信息完整", miss.length === 0, miss.length ? `缺少:${miss.join("、")}。HR 第一眼就看联系方式,务必补全。` : "姓名/电话/邮箱/求职意向齐全。", 0, 15);

    // 2. 联系方式格式(10)
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email || "");
    const phoneOk = /^1\d{10}$/.test((b.phone || "").replace(/[\s-]/g, ""));
    add("联系方式格式", emailOk && phoneOk, !emailOk ? "邮箱格式不像有效邮箱(需包含 @ 和域名)。" : "手机号建议 11 位数字(1 开头)。", 0, 10);

    // 3. 教育经历(10)
    const eduOk = doc.edu.length > 0 && doc.edu.every(e => e.school && e.major);
    add("教育经历", eduOk, doc.edu.length === 0 ? "教育经历是校招简历必备项,请至少填写一条。" : "教育经历中有些行缺少学校或专业。", 0, 10);

    // 4. 项目经历数量(20)
    const pn = doc.projects.length;
    add("项目经历", pn >= 2, pn === 0 ? "完全没有项目经历!这是校招最大减分项,至少写 1-2 个课程设计/竞赛/实习项目。" : pn === 1 ? "只有 1 个项目,建议补充到 2-3 个(课程设计、竞赛、实验室项目都算)。" : `${pn} 个项目,数量达标。`, 0, 20);

    // 5. 技能数量(10)
    const sk = doc.skills.split(/[,，、;；]/).map(s => s.trim()).filter(Boolean);
    add("技能标签", sk.length >= 3, sk.length === 0 ? "技能栏为空,请至少写 3 项与目标岗位相关的技能。" : `当前 ${sk.length} 项,建议 6-10 项并突出与岗位相关的。`, 0, 10);

    // 6. 自我评价(10)
    const sumLen = (doc.summary || "").trim().length;
    add("自我评价", sumLen >= 30, sumLen === 0 ? "自我评价为空。用 2-3 句话概括'技能 + 项目 + 性格亮点'。" : `当前 ${sumLen} 字,建议 60-120 字,避免空话套话。`, 0, 10);

    // 7. 量化成果(15)
    const allDesc = doc.projects.map(p => (p.desc || "") + (p.tech || "")).join("") + doc.exp.map(e => e.desc || "").join("");
    const quantOk = /\d/.test(allDesc);
    add("量化成果", quantOk, quantOk ? "描述中含数字,HR 能直观看到你的产出规模。" : "项目/实践描述中没看到数字。用'数据量/耗时/提升百分比/用户数'量化,如:并发 200 台设备、延迟降低 40%。", 0, 15);

    // 8. 关键词匹配(10)
    const dir = DIRECTIONS.find(d => d.id === dirId);
    const kw = dir ? dir.keywords : [];
    const hit = kw.filter(k => norm(allDesc + " " + doc.skills).includes(norm(k)));
    add(`关键词匹配(${dir ? dir.name : ""})`, hit.length >= 5, hit.length ? `命中 ${hit.length} 个关键词:${hit.slice(0, 8).join("/")}。建议把未命中但相关的关键词自然写进技能与项目。` : `几乎没命中「${dir ? dir.name : ""}」方向关键词,先用'一键补关键词'再手动润色。`, 0, 10);

    // 渲染
    $("rReport").innerHTML = `
      <div class="check-summary ${score >= 70 ? "ok" : score >= 50 ? "warn" : "bad"}">
        体检得分:<b>${score}/100</b>${score >= 70 ? " 👍 简历可用,继续打磨细节" : score >= 50 ? " 有提升空间,按建议修改" : " 建议按下方建议逐项修改"}
      </div>
      <ul class="check-list">
        ${report.map(r => `<li class="${r.pass ? "pass" : "fail"}">
          <span class="ck-ico">${r.pass ? "✅" : "⚠️"}</span>
          <div><b>${escapeHtml(r.label)}</b><p>${escapeHtml(r.advice)}</p></div>
        </li>`).join("")}
      </ul>`;
    toast(`体检完成:${score}/100`);
  }

  /* ================= 按岗位方向优化 ================= */
  const norm = (s) => (s || "").toLowerCase();

  function curDir() { return DIRECTIONS.find(d => d.id === dirId) || DIRECTIONS[0]; }

  function fillDirOptions() {
    $("rdDir").innerHTML = DIRECTIONS.map(d =>
      `<option value="${d.id}"${d.id === dirId ? " selected" : ""}>${d.icon} ${d.name}</option>`).join("");
    updateDirNote();
  }
  function updateDirNote() {
    const d = curDir();
    $("rdNote").innerHTML = `<b>${d.icon} ${escapeHtml(d.name)}方向优化建议:</b><p>${escapeHtml(d.summaryNote)}</p><p>项目侧重点:${escapeHtml(d.projectFocus)}</p>`;
  }

  function addKeywords() {
    const d = curDir();
    const cur = doc.skills.split(/[,，、;；]/).map(s => s.trim()).filter(Boolean);
    const addList = d.skills.filter(s => !cur.some(c => norm(c) === norm(s)));
    if (!addList.length) { toast("这些技能已经在简历里了"); return; }
    doc.skills = cur.concat(addList).join(", ");
    $("rSkills").value = doc.skills;
    save(); renderLists(); renderPreview();
    toast(`已补充 ${addList.length} 项「${d.name}」方向技能`);
  }

  function fillSelfEval() {
    const d = curDir();
    if (!confirm(`用「${d.name}」方向的自我评价模板覆盖当前内容?\n\n${d.selfEval}`)) return;
    doc.summary = d.selfEval;
    $("rSummary").value = d.selfEval;
    save(); renderPreview();
    toast("已填入方向自我评价模板,可再微调");
  }

  function reorderProjects() {
    const d = curDir();
    const kw = d.keywords;
    doc.projects.forEach(p => {
      p._score = kw.filter(k => norm((p.desc || "") + " " + (p.tech || "")).includes(norm(k))).length;
    });
    doc.projects.sort((a, b) => (b._score || 0) - (a._score || 0));
    doc.projects.forEach(p => delete p._score);
    save(); renderLists(); renderPreview();
    toast("已按与岗位方向的匹配度重排项目");
  }

  function showReport() {
    const d = curDir();
    if (!doc.projects.length) { $("rdReportBox").innerHTML = `<p class="issue-loading">还没有项目经历,先添加再生成匹配报告。</p>`; return; }
    const kw = d.keywords;
    const rows = doc.projects.map((p, i) => {
      const hit = kw.filter(k => norm((p.desc || "") + " " + (p.tech || "")).includes(norm(k)));
      const miss = kw.slice(0, 12).filter(k => !norm((p.desc || "") + " " + (p.tech || "")).includes(norm(k)));
      return `<div class="match-row">
        <div class="pi-head"><b>${i + 1}. ${escapeHtml(p.name) || "项目"}</b><span>命中 ${hit.length} 个关键词</span></div>
        ${hit.length ? `<div class="match-hit">已命中:${hit.slice(0, 10).map(k => `<span class="ps-chip">${escapeHtml(k)}</span>`).join("")}</div>` : `<div class="match-miss">未命中任何方向关键词,建议补充相关技术描述</div>`}
        ${hit.length ? `<div class="match-miss">建议补充:${miss.slice(0, 5).map(k => `<span class="ps-chip">${escapeHtml(k)}</span>`).join("")}</div>` : ""}
      </div>`;
    }).join("");
    $("rdReportBox").innerHTML = `
      <div class="match-title">📊 「${escapeHtml(d.name)}」方向匹配报告</div>
      ${rows}`;
  }

  /* ================= 事件绑定 ================= */
  const BASIC_MAP = { rName: "name", rPhone: "phone", rEmail: "email", rCity: "city", rIntent: "intent" };
  function bind() {
    // 基本信息
    Object.entries(BASIC_MAP).forEach(([id, k]) => {
      $(id).addEventListener("input", () => { doc.basic[k] = $(id).value; save(); renderPreview(); });
    });
    // 技能/证书/自我评价
    $("rSkills").addEventListener("input", () => { doc.skills = $("rSkills").value; save(); renderPreview(); });
    $("rHonors").addEventListener("input", () => { doc.honors = $("rHonors").value; save(); renderPreview(); });
    $("rSummary").addEventListener("input", () => { doc.summary = $("rSummary").value; save(); renderPreview(); });

    // 教育经历(输入委托 + 增删)
    $("rEdu").addEventListener("input", (e) => {
      const row = e.target.closest(".resume-row"); if (!row) return;
      const i = +row.dataset.i; const cls = e.target.className;
      const map = { "re-school": "school", "re-major": "major", "re-degree": "degree", "re-start": "start", "re-end": "end", "re-courses": "courses" };
      if (map[cls]) { doc.edu[i][map[cls]] = e.target.value; save(); renderPreview(); }
    });
    $("rEdu").addEventListener("click", (e) => {
      const del = e.target.closest(".re-del"); if (!del) return;
      doc.edu.splice(+del.dataset.i, 1); save(); renderLists(); renderPreview();
    });
    $("rEduAdd").addEventListener("click", () => { doc.edu.push({ school: "", major: "", degree: "", start: "", end: "", courses: "" }); renderLists(); });

    // 项目经历
    $("rProjects").addEventListener("input", (e) => {
      const row = e.target.closest(".resume-row"); if (!row) return;
      const i = +row.dataset.i; const cls = e.target.className;
      const map = { "rp-name": "name", "rp-role": "role", "rp-start": "start", "rp-end": "end", "rp-tech": "tech", "rp-desc": "desc" };
      if (map[cls]) { doc.projects[i][map[cls]] = e.target.value; save(); renderPreview(); }
    });
    $("rProjects").addEventListener("click", (e) => {
      const del = e.target.closest(".re-del"); if (!del) return;
      doc.projects.splice(+del.dataset.i, 1); save(); renderLists(); renderPreview();
    });
    $("rProjAdd").addEventListener("click", () => { doc.projects.push({ name: "", role: "", start: "", end: "", tech: "", desc: "" }); renderLists(); });

    // 实践经历
    $("rExp").addEventListener("input", (e) => {
      const row = e.target.closest(".resume-row"); if (!row) return;
      const i = +row.dataset.i; const cls = e.target.className;
      const map = { "re-org": "org", "re-role": "role", "re-start": "start", "re-end": "end", "re-desc": "desc" };
      if (map[cls]) { doc.exp[i][map[cls]] = e.target.value; save(); renderPreview(); }
    });
    $("rExp").addEventListener("click", (e) => {
      const del = e.target.closest(".re-del"); if (!del) return;
      doc.exp.splice(+del.dataset.i, 1); save(); renderLists(); renderPreview();
    });
    $("rExpAdd").addEventListener("click", () => { doc.exp.push({ org: "", role: "", start: "", end: "", desc: "" }); renderLists(); });

    // 打印
    $("rPrint").addEventListener("click", () => window.print());
    // 体检
    $("rCheck").addEventListener("click", runCheck);

    // 方向优化
    $("rdDir").addEventListener("change", (e) => {
      dirId = e.target.value;
      history.replaceState(null, "", "#/resume?dir=" + dirId);
      updateDirNote();
      $("rdReportBox").innerHTML = "";
    });
    $("rdKeywords").addEventListener("click", addKeywords);
    $("rdSelfEval").addEventListener("click", fillSelfEval);
    $("rdReorder").addEventListener("click", reorderProjects);
    $("rdReport").addEventListener("click", showReport);
  }

  function renderAll() {
    Object.entries(BASIC_MAP).forEach(([id, k]) => { $(id).value = doc.basic[k]; });
    $("rSkills").value = doc.skills;
    $("rHonors").value = doc.honors;
    $("rSummary").value = doc.summary;
    renderLists();
    renderPreview();
  }

  /* ================= 简历上传识别(PDF/DOCX → 正则提取 → 填充表单) ================= */
  const uploadState = document.getElementById("uploadState");
  const setUploadState = (msg, isErr) => {
    uploadState.textContent = msg;
    uploadState.style.color = isErr ? "var(--danger)" : "var(--text-3)";
  };

  /* 正则提取器 */
  function extractInfo(text) {
    const out = {};
    const phone = text.match(/1[3-9]\d{9}/);
    if (phone) out.phone = phone[0];
    const email = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (email) out.email = email[0];
    const school = text.match(/[\u4e00-\u9fa5]{2,12}(大学|学院|学校)(?![\u4e00-\u9fa5])/);
    if (school) out.school = school[0];
    const majorList = ["物联网工程", "嵌入式", "计算机科学", "软件工程", "电子信息", "通信工程", "自动化", "电气工程", "人工智能", "网络工程", "微电子", "机械电子", "信息工程", "电子科学"];
    const major = majorList.find(m => text.includes(m));
    if (major) out.major = major;
    /* 技能关键词 */
    const skillList = ["C/C++", "C语言", "Python", "STM32", "FreeRTOS", "RTOS", "MQTT", "Linux", "嵌入式Linux", "ESP32", "单片机", "Keil", "DMA", "UART", "I2C", "SPI", "Zigbee", "BLE", "LoRa", "NB-IoT", "Java", "MySQL", "PCB", "立创EDA", "Altium", "PyTorch", "TensorFlow", "OpenCV", "Node.js", "Git", "Docker", "ROS", "MATLAB"];
    const skills = skillList.filter(s => text.includes(s));
    if (skills.length) out.skills = skills.join(", ");
    /* 姓名:常见前缀模式 */
    const namePatterns = [
      text.match(/姓名[:：\s]*([\u4e00-\u9fa5]{2,4})/),
      text.match(/name[:：\s]*([A-Za-z\s]{2,20})/i),
    ];
    for (const m of namePatterns) {
      if (m && m[1]) { out.name = m[1].trim(); break; }
    }
    return out;
  }

  async function parsePdf(file) {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(it => it.str).join(" ") + "\n";
    }
    return text;
  }
  async function parseDocx(file) {
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value;
  }

  function fillFromResume(info) {
    if (info.name) { doc.basic.name = info.name; $("rName").value = info.name; }
    if (info.phone) { doc.basic.phone = info.phone; $("rPhone").value = info.phone; }
    if (info.email) { doc.basic.email = info.email; $("rEmail").value = info.email; }
    if (info.school || info.major) {
      /* 已有教育行则补全,否则新建 */
      if (doc.edu.length) {
        if (info.school) doc.edu[0].school = info.school;
        if (info.major) doc.edu[0].major = info.major;
      } else {
        doc.edu.push({ school: info.school || "", major: info.major || "", degree: "", start: "", end: "", courses: "" });
      }
    }
    if (info.skills) { doc.skills = info.skills; $("rSkills").value = info.skills; }
    save();
    renderLists();
    renderPreview();
  }

  function bindUpload() {
    document.getElementById("resumeFile").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const ext = file.name.split(".").pop().toLowerCase();
      setUploadState("正在解析…");
      try {
        const text = ext === "pdf" ? await parsePdf(file) : ext === "docx" ? await parseDocx(file) : null;
        if (!text) { setUploadState("不支持的格式,仅支持 PDF/DOCX", true); return; }
        if (text.trim().length < 30) { setUploadState("未能识别到文字(可能是扫描件/图片版),请手动填写", true); return; }
        const info = extractInfo(text);
        fillFromResume(info);
        setUploadState(`识别完成:${Object.keys(info).length} 项已填充,请人工核对`);
        toast("简历已识别并填充,请核对信息");
      } catch (err) {
        setUploadState("解析失败:" + err.message, true);
      }
    });
  }
  bindUpload();

  /* ================= 初始化(支持 #/resume?dir=xxx 直达) ================= */
  (function init() {
    const m = (location.hash || "").match(/dir=([a-z]+)/);
    if (m && DIRECTIONS.some(d => d.id === m[1])) dirId = m[1];
    fillDirOptions();
    bind();
    renderAll();
    prefillFromWorkbench();
  })();
})();

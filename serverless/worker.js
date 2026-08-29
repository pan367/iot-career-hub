/**
 * IoT 求职雷达 — 动态后端(Cloudflare Worker + KV)
 *
 * 功能:
 *  - GET  /api/jobs?type=&city=&direction=&degree=&ctype=  岗位列表(动态数据,支持过滤)
 *  - GET  /api/jobs/:id                                    单个岗位
 *  - POST /api/jobs                                        新增岗位(需管理密钥)
 *  - PUT  /api/jobs/:id                                    更新岗位(需管理密钥)
 *  - DELETE /api/jobs/:id                                  删除岗位(需管理密钥)
 *  - GET  /api/updated                                     最后更新时间
 *  - POST /api/visit                                       记录访问(访问统计)
 *  - GET  /api/stats                                       站点统计(岗位数/访问数)
 *  - GET  /api/submissions / POST /api/submissions         投稿(需管理密钥写入/读取)
 *  - GET  /api/feedbacks   / POST /api/feedbacks           反馈
 *  - scheduled() 定时任务:每天 05:00 / 12:00(北京时间)更新 updated 时间戳
 *
 * 部署后前端配置 SITE_CONFIG.apiUrl 即切换到动态模式(岗位从本 API 实时读取)。
 * 安全:写操作需要 Authorization: Bearer <ADMIN_KEY>(wrangler secret 配置)。
 */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });

const KV_JOBS = "jobs";
const KV_UPDATED = "updated";
const KV_VISITS = "visits";
const KV_SUBS = "submissions";
const KV_FB = "feedbacks";

function beijingNow() {
  const d = new Date(Date.now() + 8 * 3600 * 1000);
  return d.toISOString().slice(0, 16).replace("T", " ");
}

function okAuth(request, env) {
  const auth = request.headers.get("Authorization") || "";
  return auth === `Bearer ${env.ADMIN_KEY}`;
}

async function readKV(env, key, def) {
  const v = await env.IOT_HUB.get(key);
  return v ? JSON.parse(v) : def;
}
async function writeKV(env, key, val) {
  await env.IOT_HUB.put(key, JSON.stringify(val));
}

async function handleApi(request, env, url) {
  const path = url.pathname.replace(/^\/api/, "").replace(/\/+$/, "") || "/";
  const method = request.method;

  /* CORS 预检 */
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  /* ---- 岗位列表(公开读) ---- */
  if (method === "GET" && (path === "/jobs" || path === "/jobs/")) {
    let jobs = await readKV(env, KV_JOBS, []);
    const q = url.searchParams;
    const type = q.get("type");
    const city = q.get("city");
    const direction = q.get("direction");
    const degree = q.get("degree");
    const ctype = q.get("ctype");
    const kw = (q.get("kw") || "").toLowerCase();
    if (type) jobs = jobs.filter(j => j.type === type);
    if (direction) jobs = jobs.filter(j => j.direction === direction);
    if (city) jobs = jobs.filter(j => (j.city || "").split("/").map(s => s.trim()).includes(city));
    if (degree) {
      /* 学历匹配(与前端 classifyDegree 语义一致:含本→本科、含硕→硕士、含博→博士、无学历词→不限) */
      jobs = jobs.filter(j => {
        const t = j.degree || "";
        if (t.includes("本科及以上")) return true;
        if (t.includes("硕士及以上")) return ["硕士", "博士"].includes(degree);
        const hasWord = /(本|硕|博)/.test(t);
        if (!hasWord) return true; /* 在校生/仅年份等 → 不限 */
        if (degree === "本科") return t.includes("本");
        if (degree === "硕士") return t.includes("硕");
        if (degree === "博士") return t.includes("博");
        return true;
      });
    }
    if (ctype) {
      /* 公司类型:需前端提供映射表,worker 侧用岗位数据中的 companyType 字段(可选) */
      jobs = jobs.filter(j => (j.companyType || "") === ctype);
    }
    if (kw) jobs = jobs.filter(j => (j.company + j.position + (j.note || "")).toLowerCase().includes(kw));
    return json({ ok: true, total: jobs.length, jobs });
  }

  /* ---- 单个岗位(公开读) ---- */
  if (method === "GET" && path.startsWith("/jobs/")) {
    const id = path.split("/")[2];
    const jobs = await readKV(env, KV_JOBS, []);
    const job = jobs.find(j => j.id === id);
    return job ? json({ ok: true, job }) : json({ ok: false, error: "not found" }, 404);
  }

  /* ---- 新增岗位(管理) ---- */
  if (method === "POST" && path === "/jobs") {
    if (!okAuth(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
    const body = await request.json();
    if (!body.id || !body.company || !body.position || !body.url) {
      return json({ ok: false, error: "缺少必填字段(id/company/position/url)" }, 400);
    }
    const jobs = await readKV(env, KV_JOBS, []);
    if (jobs.some(j => j.id === body.id)) {
      return json({ ok: false, error: "id 已存在" }, 409);
    }
    jobs.push({ ...body, updated: beijingNow().slice(0, 10) });
    await writeKV(env, KV_JOBS, jobs);
    return json({ ok: true, id: body.id });
  }

  /* ---- 更新岗位(管理) ---- */
  if (method === "PUT" && path.startsWith("/jobs/")) {
    if (!okAuth(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
    const id = path.split("/")[2];
    const body = await request.json();
    const jobs = await readKV(env, KV_JOBS, []);
    const idx = jobs.findIndex(j => j.id === id);
    if (idx < 0) return json({ ok: false, error: "not found" }, 404);
    jobs[idx] = { ...jobs[idx], ...body, id };
    await writeKV(env, KV_JOBS, jobs);
    return json({ ok: true, id });
  }

  /* ---- 删除岗位(管理) ---- */
  if (method === "DELETE" && path.startsWith("/jobs/")) {
    if (!okAuth(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
    const id = path.split("/")[2];
    const jobs = await readKV(env, KV_JOBS, []);
    const next = jobs.filter(j => j.id !== id);
    await writeKV(env, KV_JOBS, next);
    return json({ ok: true, deleted: jobs.length - next.length });
  }

  /* ---- 更新时间 ---- */
  if (method === "GET" && path === "/updated") {
    const at = (await env.IOT_HUB.get(KV_UPDATED)) || "1970-01-01 00:00";
    return json({ ok: true, at });
  }

  /* ---- 访问统计 ---- */
  if (method === "POST" && path === "/visit") {
    const n = parseInt((await env.IOT_HUB.get(KV_VISITS)) || "0", 10) + 1;
    await env.IOT_HUB.put(KV_VISITS, String(n));
    return json({ ok: true, visits: n });
  }
  if (method === "GET" && path === "/stats") {
    const jobs = await readKV(env, KV_JOBS, []);
    const visits = parseInt((await env.IOT_HUB.get(KV_VISITS)) || "0", 10);
    const updated = (await env.IOT_HUB.get(KV_UPDATED)) || "1970-01-01 00:00";
    return json({ ok: true, jobs: jobs.length, visits, updated });
  }

  /* ---- 投稿(读公开,写需管理密钥;同时仍支持 GitHub Issue 通道) ---- */
  if (method === "GET" && path === "/submissions") {
    return json({ ok: true, submissions: await readKV(env, KV_SUBS, []) });
  }
  if (method === "POST" && path === "/submissions") {
    const body = await request.json();
    if (!body.company || !body.position) return json({ ok: false, error: "缺少公司/岗位" }, 400);
    const list = await readKV(env, KV_SUBS, []);
    list.unshift({ ...body, at: beijingNow() });
    await writeKV(env, KV_SUBS, list.slice(0, 200));
    return json({ ok: true });
  }

  /* ---- 反馈(同上) ---- */
  if (method === "GET" && path === "/feedbacks") {
    return json({ ok: true, feedbacks: await readKV(env, KV_FB, []) });
  }
  if (method === "POST" && path === "/feedbacks") {
    const body = await request.json();
    if (!body.content) return json({ ok: false, error: "缺少内容" }, 400);
    const list = await readKV(env, KV_FB, []);
    list.unshift({ ...body, at: beijingNow() });
    await writeKV(env, KV_FB, list.slice(0, 200));
    return json({ ok: true });
  }

  return json({ ok: false, error: "not found" }, 404);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) {
      return handleApi(request, env, url);
    }
    /* 非 API 请求:提示前端入口 */
    return json({ ok: true, service: "iot-career-hub-api", docs: "/api/stats" });
  },

  /**
   * 定时任务:每天 05:00 / 12:00(北京时间)由 wrangler.toml cron 触发,
   * 更新真实时间戳(保证"最后自动更新"真实),并做基础数据校验。
   */
  async scheduled(event, env, ctx) {
    const now = beijingNow();
    await env.IOT_HUB.put(KV_UPDATED, now);
    const jobs = await readKV(env, KV_JOBS, []);
    const problems = [];
    const ids = jobs.map(j => j.id);
    new Set(ids).forEach(id => {
      if (ids.filter(x => x === id).length > 1) problems.push(`重复 id:${id}`);
    });
    jobs.forEach(j => {
      if (!j.url || !/^https?:\/\//.test(j.url)) problems.push(`非法链接:${j.id}`);
    });
    await env.IOT_HUB.put("last-cron", JSON.stringify({ at: now, jobs: jobs.length, problems }));
  },
};

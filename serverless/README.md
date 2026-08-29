# 动态化部署指南(Cloudflare Workers + KV,免费)

GitHub Pages 是纯静态托管,无法运行后端。本目录提供**完整可用的动态后端**(Cloudflare Worker 单文件),部署后网站获得:

- **真正的后端 API**:岗位数据存在 KV 数据库,通过 API 实时读写(不再依赖改代码提交)
- **管理接口**:维护者用密钥在线增删改岗位(无需 git)
- **定时任务**:每天 05:00 / 12:00(北京时间)自动更新真实时间戳并校验数据
- **访问统计**、**投稿/反馈在线存储**
- 前端配置 `SITE_CONFIG.apiUrl` 后自动切换为动态模式(岗位从 API 实时拉取);未配置时继续使用静态数据(双模式兜底)

## 部署步骤(免费,约 5 分钟,无需信用卡)

前置:注册 [Cloudflare](https://dash.cloudflare.com/sign-up)(免费)。

```bash
# 1. 安装 wrangler CLI
npm install -g wrangler
# 或: npx wrangler@latest ...

# 2. 登录 Cloudflare
wrangler login

# 3. 进入本目录
cd serverless

# 4. 创建 KV 命名空间,把输出的 id 填入 wrangler.toml 的 REPLACE_WITH_KV_ID(两处)
wrangler kv namespace create IOT_HUB

# 5. 配置管理密钥(部署后用于管理岗位,妥善保存)
wrangler secret put ADMIN_KEY

# 6. 部署 Worker
wrangler deploy
```

部署成功后会得到 API 地址,形如 `https://iot-career-hub-api.<你的子域>.workers.dev`。

## 导入初始岗位数据

把静态数据导入 KV(首次执行一次,之后全部走 API 管理):

```bash
# 用管理密钥调用 API(Windows PowerShell / Git Bash 示例)
curl -X POST https://iot-career-hub-api.你的子域.workers.dev/api/jobs \
  -H "Authorization: Bearer 你的ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id":"huawei-2027","company":"华为","position":"2027届应届生招聘","type":"校招","direction":"综合","city":"全国多地","degree":"2027年毕业的本硕博","url":"https://career.huawei.com/cn/campus-recruitment","note":"...","updated":"2026-09-01"}'
```

> 批量导入:可写个小脚本循环调用 API;或由维护者从 `data/jobs.js` 转成 JSON 数组后调用(格式见 `/api/jobs` 返回)。

## 启用动态模式(前端)

编辑仓库根目录 `index.html`,在 `<head>` 或 `data/jobs.js` 之前加入:

```html
<script>window.SITE_CONFIG = { apiUrl: "https://iot-career-hub-api.你的子域.workers.dev" };</script>
```

保存并推送后,网站岗位数据即从 API 实时读取;维护者用 `POST/PUT/DELETE /api/jobs` 增删改岗位,用户刷新即见(数据存 KV,不再需要改代码)。

## 管理接口速查

| 操作 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 岗位列表 | GET | /api/jobs?type=&city=&direction=&degree=&ctype=&kw= | 支持过滤 |
| 单个岗位 | GET | /api/jobs/:id | |
| 新增岗位 | POST | /api/jobs | Bearer ADMIN_KEY |
| 更新岗位 | PUT | /api/jobs/:id | Bearer ADMIN_KEY |
| 删除岗位 | DELETE | /api/jobs/:id | Bearer ADMIN_KEY |
| 更新时间 | GET | /api/updated | 定时任务自动维护 |
| 访问统计 | GET | /api/stats | 岗位数/访问数/更新时间 |
| 投稿 | GET/POST | /api/submissions | 读公开,写需密钥 |
| 反馈 | GET/POST | /api/feedbacks | 读公开,写需密钥 |

## 回退说明

- 动态模式故障时(API 不可达),前端自动回退到静态数据(GitHub Pages 数据),网站永不空白。
- 想完全关掉动态模式:删掉 `window.SITE_CONFIG` 那行即可。

## 其他动态平台备选

- **Vercel/Netlify**:把 `serverless/worker.js` 改造成 Serverless Function 亦可,原理相同;免费额度够用。
- **本地自托管**:Node 服务器 + SQLite(需要服务器/域名,成本高于上述方案)。

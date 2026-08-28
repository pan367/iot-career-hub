/* 秋招时间线数据
 * 字段说明:
 *   company 公司名   url 官方投递入口
 *   stages  节点数组:name 节点名 / date 开始日期(ISO) / end 结束日期(可选)
 *           status  可手动覆盖状态:"done"|"current"|"upcoming"(不填则按今天日期自动判断)
 *           note    补充说明(可选)
 * 注意:日期尽量用 ISO 格式,自动状态判断才生效;没查到确切日期就留 null 并写 note。
 */
window.TIMELINE_DATA = [
  {
    company: "大疆创新",
    url: "https://careers.dji.com/zh-CN/campus",
    stages: [
      { name: "网申开启(招满即止)", date: "2026-06-25", note: "不设截止,招满即止;仅可投1个志愿" },
      { name: "面试(线上为主)", date: "2026-08-20", end: "2026-10-15" },
      { name: "Offer 发放", date: "2026-09-15", end: "2026-10-31", note: "时间预估,以官方通知为准" }
    ]
  },
  {
    company: "乐鑫科技",
    url: "https://www.espressif.com/zh-hans/join-us/careers",
    stages: [
      { name: "'领跑者计划'校招启动", date: "2026-07-06" },
      { name: "网申投递(滚动)", date: "2026-07-06", note: "官网选1个职位投递" }
    ]
  },
  {
    company: "中兴通讯",
    url: "https://job.zte.com.cn/",
    stages: [
      { name: "'未来领军'计划启动", date: "2026-06-29", note: "入选可获蓝剑/SSP Offer" },
      { name: "全国宣讲 + 普通校招", date: "2026-09-01", note: "9月1日天津大学等多校宣讲" }
    ]
  },
  {
    company: "蔚来 NIO",
    url: "https://campus.nio.com/",
    stages: [
      { name: "技术提前批", date: "2026-07-15", end: "2026-08-14", note: "芯片/AI算法/智驾/座舱等方向" },
      { name: "2027届秋招正式启动", date: "2026-08-27" },
      { name: "面试 / 录用", date: "2026-09-01", end: "2026-11-30", note: "以官方通知为准" }
    ]
  },
  {
    company: "小米",
    url: "https://campus.hr.xiaomi.com/",
    stages: [
      { name: "网申开启", date: "2026-08-10" },
      { name: "笔试 / 面试(先投先筛)", date: "2026-08-10", end: "2026-12-31" },
      { name: "网申截止", date: "2026-12-31" },
      { name: "Offer 滚动发放", date: "2026-10-01", end: "2026-12-31" }
    ]
  },
  {
    company: "华为",
    url: "https://career.huawei.com/cn/campus-recruitment",
    stages: [
      { name: "2027届应届生招聘启动", date: "2026-08-15" },
      { name: "宣讲会陆续开展", date: "2026-08-27", note: "官网已发布宣讲日程表" },
      { name: "面试 / 录用", date: "2026-09-01", end: "2026-11-30", note: "无统一截止,建议尽早" }
    ]
  },
  {
    company: "荣耀 HONOR",
    url: "https://www.honor.com/cn/career/",
    stages: [
      { name: "全球校招正式启动", date: "2026-08-18", note: "岗位招满即关,越早越好" }
    ]
  },
  {
    company: "比亚迪",
    url: "https://job.byd.com/",
    stages: [
      { name: "2027届全球校招启动", date: "2026-08-19", note: "仅面向2027届应届生;博士批先行" }
    ]
  },
  {
    company: "OPPO",
    url: "https://careers.oppo.com/campus",
    stages: [
      { name: "简历投递开启", date: "2026-07-01", note: "7月开启(以官网为准)" },
      { name: "正式面试", date: "2026-08-10" }
    ]
  },
  {
    company: "vivo",
    url: "https://hr.vivo.com/",
    stages: [
      { name: "秋季校招全面启动", date: "2026-07-01", note: "7月启动(以官网为准);蓝极星计划同步" },
      { name: "Offer 发放", date: "2026-10-15", note: "预计10月中旬起" }
    ]
  },
  {
    company: "海康威视",
    url: "https://campushr.hikvision.com/",
    stages: [
      { name: "网申开启(滚动面试)", status: "current", note: "早投递早面试早拿Offer;最多2志愿×2部门" }
    ]
  },
  {
    company: "汇川技术",
    url: "https://recruit.inovance.com/#/jobs",
    stages: [
      { name: "首批岗位开放", date: "2026-07-27" },
      { name: "投递截止(约)", date: "2026-10-11", note: "来自高校就业网,以官网为准" }
    ]
  },
  {
    company: "大华股份",
    url: "https://job.dahuatech.com/",
    stages: [
      { name: "2027届全球校招启动", status: "current", note: "10大类岗位滚动招聘" }
    ]
  },
  {
    company: "涂鸦智能",
    url: "https://job.tuya.com/",
    stages: [
      { name: "2027届校招开启", status: "current", note: "流程:网申→AI面试→线上面试→Offer" }
    ]
  }
];

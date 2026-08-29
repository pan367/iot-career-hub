/* 公司类型与信用映射表
 * 用途:岗位看板/成都专场/学历匹配的「公司类型」筛选与「知名企业」开关
 * 字段:
 *   type     公司类型(芯片/模组/物联网平台/智能硬件/汽车电子/白电家电/互联网/通信运营商/工业自动化/科研院所/其他)
 *   verified 知名企业标签:上市公司 / 世界500强 / 专精特新 / 独角兽 / 国资背景等(人工核实标注)
 *   risky    谨慎核实标记:收到用户举报或公开风险信息、维护者核验后标注,显示「谨慎核实」徽章
 * 说明:不存在权威的"无良公司"黑名单 API,本站采用 正面信用标签 + 用户举报(反馈板块) + 维护者人工审核 机制。
 */
window.COMPANY_TYPES = {
  /* ---- 芯片 / 半导体 ---- */
  "华为":            { type: "通信运营商", verified: true },
  "全志科技":         { type: "芯片", verified: true },
  "兆易创新":         { type: "芯片", verified: true },
  "紫光展锐":         { type: "芯片", verified: true },
  "恒玄科技":         { type: "芯片", verified: true },
  "平头哥半导体":      { type: "芯片", verified: true },
  "乐鑫科技":         { type: "芯片", verified: true },
  "瑞芯微电子":       { type: "芯片", verified: true },
  /* ---- 模组 / 终端 ---- */
  "移远通信":         { type: "模组", verified: true },
  "广和通":          { type: "模组", verified: true },
  "美格智能":         { type: "模组", verified: true },
  "有方科技":         { type: "模组", verified: true },
  "移为通信":         { type: "模组", verified: true },
  "高新兴":          { type: "模组", verified: true },
  "海能达":          { type: "模组", verified: true },
  /* ---- 物联网平台 ---- */
  "涂鸦智能":         { type: "物联网平台", verified: true },
  "萤石(EZVIZ)":     { type: "物联网平台", verified: true },
  "卡奥斯 COSMOPlat": { type: "物联网平台", verified: true },
  "树根互联":         { type: "物联网平台", verified: true },
  "中移物联网":        { type: "物联网平台", verified: true },
  "中国移动(成都)产业研究院": { type: "物联网平台", verified: true },
  /* ---- 智能硬件 ---- */
  "大疆创新":         { type: "智能硬件", verified: true },
  "石头科技":         { type: "智能硬件", verified: true },
  "科沃斯":          { type: "智能硬件", verified: true },
  "影石 Insta360":    { type: "智能硬件", verified: true },
  "极米科技":         { type: "智能硬件", verified: true },
  "纵横股份 JOUAV":   { type: "智能硬件", verified: true },
  /* ---- 汽车电子 ---- */
  "小鹏汽车":         { type: "汽车电子", verified: true },
  "蔚来 NIO":        { type: "汽车电子", verified: true },
  "比亚迪":          { type: "汽车电子", verified: true },
  "博世中国":         { type: "汽车电子", verified: true },
  "经纬恒润":         { type: "汽车电子", verified: true },
  "德赛西威":         { type: "汽车电子", verified: true },
  "均胜电子":         { type: "汽车电子", verified: true },
  /* ---- 白电 / 智能家电 ---- */
  "海尔智家":         { type: "白电家电", verified: true },
  "格力电器":         { type: "白电家电", verified: true },
  "海信集团":         { type: "白电家电", verified: true },
  "TCL 科技":        { type: "白电家电", verified: true },
  "长虹控股":         { type: "白电家电", verified: true },
  "奥克斯集团":        { type: "白电家电", verified: true },
  "美的集团":         { type: "白电家电", verified: true },
  /* ---- 互联网 ---- */
  "腾讯":            { type: "互联网", verified: true },
  "字节跳动":         { type: "互联网", verified: true },
  "网易":            { type: "互联网", verified: true },
  "美团":            { type: "互联网", verified: true },
  "京东":            { type: "互联网", verified: true },
  "科大讯飞":         { type: "互联网", verified: true },
  "小米":            { type: "互联网", verified: true },
  "OPPO":           { type: "互联网", verified: true },
  "vivo":           { type: "互联网", verified: true },
  "荣耀 HONOR":      { type: "互联网", verified: true },
  /* ---- 通信运营商 ---- */
  "中兴通讯":         { type: "通信运营商", verified: true },
  /* ---- 工业自动化 ---- */
  "汇川技术":         { type: "工业自动化", verified: true },
  "正泰集团":         { type: "工业自动化", verified: true },
  "华鲲振宇":         { type: "工业自动化", verified: false },
  /* ---- 安防 ---- */
  "海康威视":         { type: "安防监控", verified: true },
  "大华股份":         { type: "安防监控", verified: true },
  /* ---- 科研院所 ---- */
  "中国电科10所":      { type: "科研院所", verified: true },
  "中国电科29所":      { type: "科研院所", verified: true },
  "中国电科30所 / 中国网安": { type: "科研院所", verified: true },
  /* ---- 其他 / 本地企业 ---- */
  "秦川物联":         { type: "物联网平台", verified: true },
};

/* 辅助:按公司名取类型(找不到返回"其他") */
window.getCompanyType = function (name) {
  const hit = window.COMPANY_TYPES[name];
  return hit ? hit : { type: "其他", verified: false, risky: false };
};

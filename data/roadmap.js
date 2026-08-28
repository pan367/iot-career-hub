/* 学习路线数据
 * 字段说明:
 *   id     方向唯一标识(用于保存勾选进度)
 *   icon   emoji 图标   name 方向名
 *   items  知识点数组:name 知识点 / res 推荐资料[{t:标题, u:链接(可省略)}]
 * 有公开稳定链接的资料才填 u;书名类资料不填 u(只展示标签)。
 */
window.ROADMAP_DATA = [
  {
    id: "embedded",
    icon: "⚙️",
    name: "嵌入式软件开发(主赛道)",
    items: [
      { name: "C 语言进阶:指针 / 内存管理 / 关键字", res: [{ t: "《C 和指针》" }, { t: "《C 陷阱与缺陷》" }] },
      { name: "STM32 外设:GPIO / 中断 / 串口 / DMA / 定时器", res: [{ t: "正点原子教程", u: "https://www.openedv.com/" }, { t: "野火电子文档", u: "https://embedfire.com/" }] },
      { name: "FreeRTOS:任务 / 队列 / 信号量", res: [{ t: "FreeRTOS 官方文档", u: "https://www.freertos.org/" }] },
      { name: "Linux 基础与 Makefile", res: [{ t: "菜鸟教程 Linux", u: "https://www.runoob.com/linux/linux-tutorial.html" }] },
      { name: "做一个完整 IoT 项目:传感器采集 → 本地显示 → MQTT 上云", res: [{ t: "面试最能打的是项目", }] }
    ]
  },
  {
    id: "protocol",
    icon: "📡",
    name: "通信协议与组网",
    items: [
      { name: "MQTT:QoS / 遗嘱消息 / 保留消息", res: [{ t: "MQTT 协议官网", u: "https://mqtt.org/" }, { t: "EMQX 中文教程", u: "https://www.emqx.com/zh" }] },
      { name: "TCP/IP 基础与 Socket 编程", res: [{ t: "《图解 TCP/IP》" }] },
      { name: "WiFi + ESP32 开发", res: [{ t: "乐鑫官方文档", u: "https://docs.espressif.com/" }] },
      { name: "BLE 低功耗蓝牙", res: [] },
      { name: "NB-IoT / LoRa 广域网技术", res: [] }
    ]
  },
  {
    id: "cloud",
    icon: "☁️",
    name: "IoT 云平台",
    items: [
      { name: "MQTT Broker:EMQX / Mosquitto 搭建", res: [{ t: "EMQX 下载与文档", u: "https://www.emqx.io/zh" }] },
      { name: "中国移动 OneNET 平台接入", res: [{ t: "OneNET 开放平台", u: "https://open.iot.10086.cn/" }] },
      { name: "阿里云物联网平台", res: [{ t: "官方文档", u: "https://help.aliyun.com/product/30574.html" }] },
      { name: "物模型 / 规则引擎 / OTA 概念", res: [] }
    ]
  },
  {
    id: "hardware",
    icon: "🔌",
    name: "硬件与 PCB(加分项)",
    items: [
      { name: "电路基础与常用元器件", res: [] },
      { name: "立创 EDA 画双层板并打样", res: [{ t: "立创 EDA", u: "https://lceda.cn/" }] },
      { name: "焊接调试:万用表 / 示波器 / 逻辑分析仪", res: [] }
    ]
  },
  {
    id: "backend",
    icon: "🖥️",
    name: "上位机 / 后端(拓宽面)",
    items: [
      { name: "Python 基础与 PyQt / Tkinter 上位机", res: [] },
      { name: "Node.js 或 Java Web 后端", res: [] },
      { name: "MySQL / Redis / InfluxDB 时序数据库", res: [] }
    ]
  },
  {
    id: "algorithm",
    icon: "🧮",
    name: "算法与八股(笔试硬门槛)",
    items: [
      { name: "LeetCode 热题 100:链表 / 树 / DP 优先", res: [{ t: "力扣中国", u: "https://leetcode.cn/" }] },
      { name: "牛客笔试真题 + 模拟面试", res: [{ t: "牛客网", u: "https://www.nowcoder.com/" }] },
      { name: "《剑指 Offer》专项突破", res: [] }
    ]
  }
];

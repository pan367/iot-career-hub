/* 简历工坊 — 岗位方向优化规则
 * 每个方向配置:
 *   id/name/icon     方向标识与展示
 *   keywords         该方向高频关键词(用于匹配度计算、一键补充到技能)
 *   skills           建议写入简历的技能清单(一键采纳)
 *   projectFocus     项目经历侧重点建议
 *   selfEval         自我评价模板(一键填入)
 *   summaryNote      对该方向简历的整体建议
 */
window.RESUME_DIRECTIONS = [
  {
    id: "embedded",
    name: "嵌入式软件",
    icon: "⚙️",
    keywords: ["C/C++", "C语言", "STM32", "FreeRTOS", "RTOS", "UART", "I2C", "SPI", "DMA", "定时器", "中断", "看门狗", "嵌入式Linux", "驱动", "Makefile", "MQTT", "ESP32", "单片机", "Keil", "串口", "低功耗"],
    skills: ["C/C++", "STM32", "FreeRTOS", "UART/I2C/SPI", "DMA", "MQTT", "嵌入式Linux", "Git"],
    projectFocus: "项目描述突出:芯片与开发环境(如 STM32F4 + Keil)、外设使用(UART/DMA/定时器)、RTOS 任务划分、通信协议(MQTT/串口)、稳定性处理(看门狗/断线重连)。",
    selfEval: "熟悉 C/C++ 与 STM32 开发,掌握 FreeRTOS 任务调度与内存管理;独立完成过传感器采集 + MQTT 上云的完整项目,具备从驱动到协议栈的嵌入式软件开发能力,追求代码规范与调试效率。",
    summaryNote: "嵌入式岗位最看重:底层功底(C 指针/内存)+ 实际项目(芯片/外设/RTOS 写清楚)+ 调试能力。建议项目经历放最前,每个项目写清'芯片+工具链+外设+协议'四要素。"
  },
  {
    id: "hardware",
    name: "硬件",
    icon: "🔌",
    keywords: ["原理图", "PCB", "立创EDA", "Altium", "万用表", "示波器", "焊接", "电源", "信号完整性", "EMC", "MOSFET", "运放", "LDO", "DC-DC", "BOM", "Layout", "调试", "阻抗"],
    skills: ["原理图设计", "PCB Layout", "立创EDA", "Altium Designer", "示波器", "万用表", "焊接调试", "电源设计"],
    projectFocus: "项目描述突出:画了什么板(几层、多少器件)、用什么工具(立创EDA/AD)、调试中解决过什么信号/电源问题、是否有打样与量产意识(BOM/成本)。",
    selfEval: "具备硬件原理图与 PCB 设计能力,熟悉立创EDA/Altium 工具链与常用仪器调试;独立完成过从原理图到打样焊接的完整硬件项目,重视电源设计与信号质量。",
    summaryNote: "硬件岗位看重:项目里真画过板子并调试通过(附实物/波形更好)、对常用芯片与接口的熟悉度、仪器使用熟练度。技能栏务必写清 EDA 工具与仪器。"
  },
  {
    id: "iot",
    name: "物联网平台",
    icon: "☁️",
    keywords: ["MQTT", "HTTP", "RESTful", "Node.js", "Python", "Java", "MySQL", "Redis", "OneNET", "阿里云", "EMQX", "物模型", "规则引擎", "TLS", "WebSocket", "JSON", "API", "Linux", "Docker"],
    skills: ["MQTT", "HTTP/RESTful", "Node.js/Python", "MySQL", "EMQX", "物联网云平台", "Linux", "Docker"],
    projectFocus: "项目描述突出:设备如何接入云平台(协议/认证/物模型)、服务端架构(Broker/数据库/API)、数据处理链路、并发与可靠性(消息重试/离线缓存)。",
    selfEval: "熟悉 MQTT 等物联网协议与主流云平台接入流程,掌握 Node.js/Python 服务端开发与 MySQL 数据存储;完成过设备端到云端的完整数据链路项目,理解物模型与规则引擎。",
    summaryNote: "平台岗看重:端-云链路完整性(设备协议→Broker→数据库→API)、数据库与后端基本功、对物模型/规则引擎的理解。项目里把'数据怎么流转'讲清楚。"
  },
  {
    id: "driver",
    name: "驱动 / 底层",
    icon: "🐧",
    keywords: ["Linux", "驱动", "字符设备", "file_operations", "设备树", "内核", "模块", "ioctl", "中断", "GPIO", "I2C", "SPI", "platform", "DTS", "交叉编译", "U-Boot", "烧录"],
    skills: ["嵌入式Linux", "字符设备驱动", "设备树", "内核模块", "platform总线", "中断处理", "交叉编译", "I2C/SPI 驱动"],
    projectFocus: "项目描述突出:驱动框架(字符设备/misc/platform)、与硬件的交互(寄存器/中断)、设备树配置、应用层与内核层交互(ioctl/读写)、遇到的问题(竞态/阻塞)。",
    selfEval: "熟悉嵌入式 Linux 驱动开发流程,掌握字符设备驱动框架、设备树与 platform 总线机制;独立实现过 GPIO/传感器等外设驱动,理解内核与应用层交互与并发保护。",
    summaryNote: "驱动岗技术栈集中(内核/设备树/总线),面试深挖细节;项目务必写清'驱动框架 + 硬件接口 + 中断/同步'三层,并准备好被追问内核 API 原理。"
  },
  {
    id: "test",
    name: "测试 / 质量",
    icon: "🧪",
    keywords: ["测试用例", "自动化", "Python", "pytest", "Selenium", "接口测试", "Postman", "缺陷", "回归", "CI/CD", "Jira", "性能测试", "白盒", "黑盒", "覆盖率"],
    skills: ["测试用例设计", "Python/pytest", "接口测试", "Postman", "自动化脚本", "缺陷管理", "Linux 基础"],
    projectFocus: "实践描述突出:测试方法(等价类/边界值)、自动化脚本编写、发现的典型缺陷、测试报告与覆盖率、对质量的思考。",
    selfEval: "熟悉黑盒/白盒测试方法与用例设计,掌握 Python + pytest 编写接口与回归自动化脚本;习惯从用户视角找问题,注重缺陷复现与测试报告质量。",
    summaryNote: "测试岗看重用例设计思路与自动化能力;简历里可写'测过什么、怎么测、发现什么问题',比罗列工具更打动人。"
  },
  {
    id: "algorithm",
    name: "算法",
    icon: "🧮",
    keywords: ["Python", "PyTorch", "TensorFlow", "机器学习", "深度学习", "OpenCV", "CNN", "NLP", "数据处理", "pandas", "numpy", "特征工程", "模型评估", "A/B测试", "推理"],
    skills: ["Python", "PyTorch", "pandas/numpy", "机器学习", "OpenCV", "数据处理", "特征工程", "模型评估"],
    projectFocus: "项目描述突出:任务定义与数据(来源/规模/预处理)、模型选型与训练(框架/指标)、效果提升(量化对比:准确率提升 X%)、部署与推理性能。",
    selfEval: "熟悉 Python 与 PyTorch,掌握机器学习/深度学习常见模型与训练流程;完成过从数据清洗、特征工程到模型评估的完整实践,注重指标量化与可复现实验。",
    summaryNote: "算法岗竞争最激烈:项目必须带量化指标(提升 X%、F1 多少)、讲清数据处理与模型选型理由;数理基础(线代/概率)是笔试硬门槛。"
  }
];

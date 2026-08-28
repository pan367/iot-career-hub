/* 面经与笔试数据
 * EXAM_TOPICS:高频考点速查表(topic + points)
 * INTERVIEW_DATA:面经精选,source 必须是真实可查的原帖链接
 */
window.EXAM_TOPICS = [
  {
    topic: "C 语言(笔试核心)",
    points: ["指针与数组、二级指针、函数指针", "volatile / static / const 关键字辨析", "内存分区:堆、栈、全局区、常量区", "大小端判断与字节序转换", "结构体对齐与 sizeof 计算", "宏定义的坑与 do{}while(0)"]
  },
  {
    topic: "RTOS(FreeRTOS)",
    points: ["任务状态机与调度策略", "信号量 / 互斥锁 / 队列 / 事件组", "优先级反转与优先级继承", "上下文切换的原理", "FreeRTOS 常用 API 与任务通信实战"]
  },
  {
    topic: "单片机 / STM32",
    points: ["中断与 NVIC 优先级分组", "DMA、定时器、PWM、ADC", "UART / I2C / SPI 时序与区别", "时钟树与低功耗模式", "从上电到 main 的启动流程"]
  },
  {
    topic: "Linux",
    points: ["常用命令与 Shell 脚本", "进程与线程、fork / vfork", "IPC:管道、共享内存、消息队列、信号", "字符设备驱动框架", "交叉编译、Makefile / CMake"]
  },
  {
    topic: "计算机网络",
    points: ["TCP 三次握手 / 四次挥手", "TCP 与 UDP 区别及 IoT 场景选型", "MQTT 协议与 QoS 0/1/2", "Socket 编程流程(bind/listen/accept)", "物联网公司面试几乎必问网络!"]
  },
  {
    topic: "物联网通信技术",
    points: ["WiFi / BLE / NB-IoT / LoRa / Zigbee 对比选型", "BLE 广播、连接参数与功耗", "NB-IoT 窄带特性与 PS 时代", "MQTT + TLS 接入云平台全流程", "4G Cat.1 模组 AT 指令开发"]
  },
  {
    topic: "数据结构与算法",
    points: ["链表:反转、判环、合并有序", "栈与队列互实现", "哈希表原理与冲突解决", "排序算法复杂度与稳定性", "二叉树遍历(递归 + 非递归)"]
  },
  {
    topic: "ARM 体系结构",
    points: ["RISC 特点与常见指令集", "五级流水线", "中断向量表与异常处理", "Thumb / ARM 状态切换", "启动文件:堆栈初始化、向量表重定位"]
  }
];

window.INTERVIEW_DATA = [
  {
    company: "大疆",
    position: "嵌入式",
    rounds: "笔试 + 面试",
    points: "笔试:选择题考 C 语言与计算机基础,编程题约 2 道(牛客平台,核心代码模式,实现功能函数即可);面试涉及 RISC 指令集、五级流水线、IoT 设备对处理器性能/功耗的权衡。",
    source: "https://zhuanlan.zhihu.com/p/721138116"
  },
  {
    company: "字节跳动",
    position: "嵌入式软件",
    rounds: "一面约60分钟",
    points: "全流程约 60 分钟,无手撕代码环节;基础八股与项目深挖并重;校招与社招难度差距不大,可参考其节奏安排复习。",
    source: "https://www.nowcoder.com/discuss/659471224992497664"
  },
  {
    company: "某物联网公司",
    position: "嵌入式",
    rounds: "技术面",
    points: "物联网公司非常看重计算机网络,问了很多网络问题;有传感器采集 + MQTT 通信这类完整 IoT 项目经历是明显加分项——项目一定要自己讲得清每个细节。",
    source: "https://www.nowcoder.com/discuss/353158977510907904"
  },
  {
    company: "通用高频题",
    position: "嵌入式软件",
    rounds: "各轮通用",
    points: "经典追问:什么是嵌入式?进程与线程通信方式有哪些?PC 程序移植到嵌入式系统要注意什么?栈向哪边增长?——提前准备,面试稳一半。",
    source: "https://www.nowcoder.com/discuss/640575239738437632"
  },
  {
    company: "多公司汇总",
    position: "嵌入式",
    rounds: "全流程",
    points: "超全面嵌入式秋招面经总结:一面普遍问网络相关知识;按公司分类整理,投哪家之前定向复习对应篇目,效率最高。",
    source: "https://www.nowcoder.com/discuss/457541438146904064"
  },
  {
    company: "面经入口",
    position: "牛客·嵌入式面经专区",
    rounds: "汇总",
    points: "牛客嵌入式面经话题专区,2027 届各家面经持续更新中(含大疆笔试题回忆),建议收藏每周刷一次。",
    source: "https://www.nowcoder.com/creation/subject/0698117c38394d3fb898603d2efc8e75"
  },
  {
    company: "备考指南",
    position: "嵌入式笔试面试指南",
    rounds: "笔试 + 面试",
    points: "牛客博客专栏:嵌入式软件工程师笔试面试指南,系统性梳理 C/C++、虚函数、容器与数据结构等专题,适合作为长线复习目录。",
    source: "https://blog.nowcoder.net/embeddedlinux/95701"
  }
];

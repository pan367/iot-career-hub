/* 面经与笔试数据
 * EXAM_TOPICS:高频考点速查表(手风琴展开)
 *   topic: 考点名 / icon: emoji / items: 知识点数组
 *   items[].name: 知识点名 / desc: 详细描述(考点是什么、常怎么考、易错点)
 *   items[].links: 学习链接 [{t: 标题, u: URL}],优先官方文档与已验证的稳定教程
 * INTERVIEW_DATA:面经精选,source 必须是真实可查的原帖链接
 */
window.EXAM_TOPICS = [
  {
    topic: "C 语言(笔试核心)",
    icon: "📘",
    items: [
      {
        name: "指针与数组、函数指针",
        desc: "笔试出现频率最高的一组题:数组名与指针的区别、指针数组 vs 数组指针、二级指针传参、函数指针与回调。常考形式是给一段代码问输出或是否报错,尤其注意 sizeof(数组名) 与 sizeof(指针) 的区别、指针加减的步长(指向类型大小)。面试常追问:如何用指针实现字符串反转、函数指针怎么声明。",
        links: [
          { t: "菜鸟教程 C 语言", u: "https://www.runoob.com/cprogramming/c-tutorial.html" },
          { t: "牛客 C 面经", u: "https://www.nowcoder.com/" }
        ]
      },
      {
        name: "volatile / static / const 关键字",
        desc: "嵌入式笔试必问的三大关键字:volatile 告诉编译器变量可能被外部(中断/硬件寄存器)修改,禁止优化;static 修饰局部变量(生命周期)、全局变量(作用域限定)、函数(内部链接);const 修饰只读变量。常考:volatile 和 const 能否同时用(能,如只读寄存器)、static 变量初始化几次、const 指针与指针 const 的区分。",
        links: [
          { t: "菜鸟教程 C 语言", u: "https://www.runoob.com/cprogramming/c-tutorial.html" }
        ]
      },
      {
        name: "内存分区:堆、栈、全局区、常量区",
        desc: "程序内存布局是嵌入式岗的高频题:栈(局部变量、自动释放、向下增长)、堆(malloc/new 手动管理)、全局/静态区、常量区(字符串字面量)、代码区。常考:局部变量未初始化是随机值、全局变量默认 0、字符串常量能否修改、栈溢出原因(递归太深/大数组)。面试常追问栈帧结构。",
        links: [
          { t: "菜鸟教程 C 语言", u: "https://www.runoob.com/cprogramming/c-tutorial.html" }
        ]
      },
      {
        name: "大小端判断与字节序转换",
        desc: "大小端是物联网开发(尤其通信协议解析、MCU 与上位机交互)必考:小端=低字节存低地址(主流 x86/ARM 默认),大端相反。常考:写代码判断本机大小端(union 或指针取首字节)、手动实现 htons/ntohs、结构体直接按字节发送的坑(对齐+字节序)。",
        links: [
          { t: "菜鸟教程 C 语言", u: "https://www.runoob.com/cprogramming/c-tutorial.html" }
        ]
      },
      {
        name: "结构体对齐与 sizeof 计算",
        desc: "高频计算题:结构体成员按最大对齐数对齐,计算 sizeof 时要考虑填充字节。常考:成员顺序影响结构体大小(重排可省内存)、#pragma pack(n) 的作用、位域、空结构体大小。易错点:结构体数组大小、嵌套结构体的对齐取各成员最大对齐值。",
        links: [
          { t: "菜鸟教程 C 语言", u: "https://www.runoob.com/cprogramming/c-tutorial.html" }
        ]
      },
      {
        name: "宏定义的坑与 do{}while(0)",
        desc: "宏不是函数:不会类型检查、参数有副作用风险、多语句需 do{}while(0) 包裹。常考:写一个求平方的宏(#define SQR(x) ((x)*(x)) 的括号问题)、交换两数宏、宏与函数/内联的区别、# 与 ## 运算符、宏定义头文件保护。",
        links: [
          { t: "菜鸟教程 C 语言", u: "https://www.runoob.com/cprogramming/c-tutorial.html" }
        ]
      }
    ]
  },
  {
    topic: "RTOS(FreeRTOS)",
    icon: "⚙️",
    items: [
      {
        name: "任务状态机与调度策略",
        desc: "FreeRTOS 任务有运行/就绪/阻塞/挂起状态,调度器按优先级抢占 + 同优先级时间片轮转。常考:任务状态怎么切换、vTaskDelay 与 vTaskDelayUntil 区别、空闲任务的作用、任务栈大小选择。笔试常让画出状态转移图或分析某个 API 调用后的状态变化。",
        links: [
          { t: "FreeRTOS 官方文档", u: "https://www.freertos.org/" }
        ]
      },
      {
        name: "信号量 / 互斥锁 / 队列 / 事件组",
        desc: "任务间通信四件套:二值信号量(同步)、计数信号量(资源计数)、互斥锁(带优先级继承,保护共享资源)、队列(数据传递,带拷贝)、事件组(多事件组合)。常考:信号量与互斥锁的区别、队列发送/接收 API(xQueueSend/xQueueReceive)、死锁的产生条件。",
        links: [
          { t: "FreeRTOS 官方文档", u: "https://www.freertos.org/" }
        ]
      },
      {
        name: "优先级反转与优先级继承",
        desc: "经典面试题:低优先级任务持有锁、高优先级任务等待,中优先级任务抢占 CPU 导致高优先级任务被'饿死'。FreeRTOS 的互斥锁通过优先级继承(暂时提升持锁者优先级)缓解。常考:解释反转过程、为什么二值信号量不能防反转、继承的局限(仍可能死锁)。",
        links: [
          { t: "FreeRTOS 官方文档", u: "https://www.freertos.org/" }
        ]
      },
      {
        name: "上下文切换的原理",
        desc: "RTOS 核心机制:PendSV 异常触发上下文切换,保存当前任务寄存器(PSP、R4-R11、xPSR、PC、LR)到任务栈,恢复下一个任务的上下文。常考:为什么用 PendSV 而非直接切换(中断安全)、任务栈的作用、切换开销来源。能画出切换流程基本就能过这题。",
        links: [
          { t: "FreeRTOS 官方文档", u: "https://www.freertos.org/" }
        ]
      },
      {
        name: "FreeRTOS 项目实战要点",
        desc: "面试官常问项目里的 RTOS 使用:任务划分原则(高频率短任务/事件驱动)、栈大小估算、看门狗任务、消息队列解耦传感器数据流。建议动手做:多任务采集 + 队列上报 + 互斥锁保护 LCD,能讲清每个 API 为什么用。",
        links: [
          { t: "正点原子 FreeRTOS 教程", u: "https://www.openedv.com/" },
          { t: "野火 FreeRTOS 文档", u: "https://embedfire.com/" }
        ]
      }
    ]
  },
  {
    topic: "单片机 / STM32",
    icon: "🧩",
    items: [
      {
        name: "中断与 NVIC 优先级分组",
        desc: "STM32 用 NVIC 管理中断:抢占优先级(可嵌套)与子优先级(同抢占下排序),分组规则(PRIGROUP)。常考:中断服务函数里能否调用 printf/延时(不能,要快进快出)、中断与主循环的数据共享(volatile+关中断)、外部中断 EXTI 配置流程。",
        links: [
          { t: "正点原子 STM32 教程", u: "https://www.openedv.com/" },
          { t: "野火 STM32 文档", u: "https://embedfire.com/" }
        ]
      },
      {
        name: "DMA、定时器、PWM、ADC",
        desc: "外设高频考点:DMA 让外设与内存直接搬运数据(串口收发、ADC 采样),不占 CPU;定时器可做延时/计数/PWM 输出/输入捕获;ADC 多通道扫描 + DMA。常考:定时器 PWM 频率与占空比计算(预分频/重载值)、ADC 采样时间与精度、DMA 传输完成中断。",
        links: [
          { t: "正点原子 STM32 教程", u: "https://www.openedv.com/" },
          { t: "野火 STM32 文档", u: "https://embedfire.com/" }
        ]
      },
      {
        name: "UART / I2C / SPI 时序与区别",
        desc: "三大通信协议必考:I2C 两线(SCL/SDA)半双工、有应答位、支持多设备寻址;SPI 四线(SCK/MOSI/MISO/CS)全双工、高速、片选选设备;UART 异步(无时钟线)、靠波特率同步、需约定数据格式。常考:画时序图、I2C 起始/停止条件、SPI 四种模式(CPOL/CPHA)、波特率误差影响。",
        links: [
          { t: "正点原子 STM32 教程", u: "https://www.openedv.com/" },
          { t: "野火 STM32 文档", u: "https://embedfire.com/" }
        ]
      },
      {
        name: "时钟树与低功耗模式",
        desc: "STM32 时钟树:HSI/HSE 经 PLL 倍频给系统时钟,外设总线 APB1/APB2 分频。低功耗:睡眠(内核停)、停止(外设停、SRAM 保数据)、待机(几乎全关,靠唤醒源)。常考:为什么外设时钟要单独使能(RCC)、低功耗唤醒方式、物联网设备功耗预算。",
        links: [
          { t: "正点原子 STM32 教程", u: "https://www.openedv.com/" }
        ]
      },
      {
        name: "从上电到 main 的启动流程",
        desc: "经典必背:复位向量 → 取栈顶指针 → 跳 Reset_Handler → 拷贝 data 段、清零 bss 段 → 调用 SystemInit(配时钟)→ main。常考:启动文件里做了什么、.data/.bss/.text 段含义、为什么需要分散加载文件(.sct)、看门狗在启动阶段的处理。",
        links: [
          { t: "正点原子 STM32 教程", u: "https://www.openedv.com/" },
          { t: "野火 STM32 文档", u: "https://embedfire.com/" }
        ]
      }
    ]
  },
  {
    topic: "Linux",
    icon: "🐧",
    items: [
      {
        name: "常用命令与 Shell 脚本",
        desc: "嵌入式 Linux 岗面试必问命令:文件操作(ls/cp/mv/rm/tar)、查看进程(ps/top)、网络(ifconfig/ping/netstat)、权限(chmod/chown)、文本处理(grep/sed/awk)。常考:如何递归查找文件并统计行数、写一个循环批量重命名的脚本、管道与重定向区别。",
        links: [
          { t: "菜鸟教程 Linux", u: "https://www.runoob.com/linux/linux-tutorial.html" },
          { t: "鸟哥的 Linux 私房菜", u: "https://linux.vbird.org/" }
        ]
      },
      {
        name: "进程与线程、fork / vfork",
        desc: "高频八股:进程是资源分配单位、线程是调度单位;fork 创建子进程(写时拷贝)、vfork 共享地址空间;线程用 pthread_create。常考:fork 后变量是否共享、僵尸进程与孤儿进程、线程同步方式(互斥锁/条件变量)、进程与线程的通信区别。",
        links: [
          { t: "鸟哥的 Linux 私房菜", u: "https://linux.vbird.org/" },
          { t: "菜鸟教程 Linux", u: "https://www.runoob.com/linux/linux-tutorial.html" }
        ]
      },
      {
        name: "IPC:管道、共享内存、消息队列、信号",
        desc: "进程间通信四件套:无名管道(父子进程)、有名管道 FIFO、共享内存(最快,需同步)、消息队列(带类型)、信号(signal/kill)。常考:各 IPC 优缺点与适用场景、共享内存为什么要配信号量、socket 也算 IPC 的一种(跨主机)。",
        links: [
          { t: "菜鸟教程 Linux", u: "https://www.runoob.com/linux/linux-tutorial.html" },
          { t: "鸟哥的 Linux 私房菜", u: "https://linux.vbird.org/" }
        ]
      },
      {
        name: "字符设备驱动框架",
        desc: "驱动岗核心考点:file_operations 结构体(memdev 示例)、注册字符设备(register_chrdev)、设备号分配、open/read/write 实现、模块加载(insmod/modprobe)、miscdevice 简易写法。常考:应用层 open 一个设备文件后内核怎么找到驱动、copy_to_user 的作用。",
        links: [
          { t: "正点原子 Linux 教程", u: "https://www.openedv.com/" }
        ]
      },
      {
        name: "交叉编译、Makefile / CMake",
        desc: "嵌入式必备工具链:交叉编译(host 编译、target 运行,arm-linux-gnueabihf-gcc)、Makefile 规则(目标:依赖,命令)、CMake 跨平台生成。常考:交叉编译器前缀含义、写一个最小 Makefile、静态库与动态库编译链接区别、链接库的顺序问题。",
        links: [
          { t: "菜鸟教程 Linux", u: "https://www.runoob.com/linux/linux-tutorial.html" },
          { t: "鸟哥的 Linux 私房菜", u: "https://linux.vbird.org/" }
        ]
      }
    ]
  },
  {
    topic: "计算机网络",
    icon: "🌐",
    items: [
      {
        name: "TCP 三次握手 / 四次挥手",
        desc: "网络第一大考点:三次握手(SYN→SYN+ACK→ACK)建立连接、四次挥手(FIN 半关闭)断开、TIME_WAIT 为什么存在(保证最后一个 ACK 到达、旧报文失效)。常考:为什么不是两次/四次握手、SYN 洪泛攻击原理、挥手时 2MSL 的作用、状态机迁移。",
        links: [
          { t: "菜鸟教程 TCP/IP", u: "https://www.runoob.com/tcpip/tcpip-tutorial.html" }
        ]
      },
      {
        name: "TCP 与 UDP 区别及 IoT 场景选型",
        desc: "TCP 面向连接/可靠/有序/慢,适合文件传输、指令下发;UDP 无连接/不可靠/快,适合音视频、传感器高频上报。物联网里常混用:MQTT over TCP 保证指令可靠,媒体流走 UDP。常考:什么场景选 TCP 什么选 UDP、UDP 如何做可靠性(应用层重传)。",
        links: [
          { t: "菜鸟教程 TCP/IP", u: "https://www.runoob.com/tcpip/tcpip-tutorial.html" }
        ]
      },
      {
        name: "MQTT 协议与 QoS 0/1/2",
        desc: "物联网最常用协议:发布/订阅模型、Broker 中转、主题层级(room/temp)、QoS 0(至多一次)/1(至少一次,可能重复)/2(恰好一次,性能最低)。常考:QoS 选择策略、遗嘱消息(LWT)、保留消息、会话保持(clean session)、与 HTTP 相比为什么省流量。",
        links: [
          { t: "EMQX MQTT 中文教程", u: "https://www.emqx.com/zh/blog/category/mqtt" },
          { t: "MQTT 官方协议", u: "https://mqtt.org/" }
        ]
      },
      {
        name: "Socket 编程流程",
        desc: "必背流程:服务端 socket→bind→listen→accept→recv/send→close;客户端 socket→connect→send/recv。常考:阻塞与非阻塞、TCP 粘包问题及解决(定长/分隔符/包头长度)、SO_REUSEADDR 作用、select/epoll 区别(嵌入式高并发)。",
        links: [
          { t: "菜鸟教程 TCP/IP", u: "https://www.runoob.com/tcpip/tcpip-tutorial.html" }
        ]
      },
      {
        name: "物联网公司面试几乎必问网络!",
        desc: "多家物联网公司面经反馈:网络题占比极高,一面基本都问网络。重点准备:三次握手/挥手、TCP-UDP 选型、MQTT 全流程、IP 地址与子网划分、DNS 解析过程。有 MQTT 上云项目经历的一定要把协议细节讲透。",
        links: [
          { t: "牛客嵌入式面经专区", u: "https://www.nowcoder.com/" }
        ]
      }
    ]
  },
  {
    topic: "物联网通信技术",
    icon: "📡",
    items: [
      {
        name: "WiFi / BLE / NB-IoT / LoRa / Zigbee 对比选型",
        desc: "物联网无线技术对比高频题:WiFi(高速、功耗大、需路由器)、BLE(低功耗、短距、手机直连)、NB-IoT(广覆盖、深覆盖、低速率、运营商网络)、LoRa(自组网、免牌照频段、超远距)、Zigbee(短距低功耗网状网)。常考:选型依据(距离/速率/功耗/成本/场景)。",
        links: [
          { t: "乐鑫官方文档(ESP32)", u: "https://docs.espressif.com/" },
          { t: "EMQX 博客", u: "https://www.emqx.com/zh/blog/category/mqtt" }
        ]
      },
      {
        name: "BLE 广播、连接参数与功耗",
        desc: "BLE 核心机制:广播(advertising)→ 扫描 → 连接(connection);连接参数:连接间隔(connection interval)、从机延迟(slave latency)、超时。常考:广播与连接状态功耗差异、如何用连接参数省电、BLE 与经典蓝牙区别、iBeacon 原理。",
        links: [
          { t: "乐鑫官方文档(ESP32)", u: "https://docs.espressif.com/" }
        ]
      },
      {
        name: "NB-IoT 窄带特性与 PSM/eDRX",
        desc: "NB-IoT 三大特性:覆盖增强(比 GSM 强 20dB)、海量连接、低功耗。省电机制:PSM(终端休眠、网络缓存下行)、eDRX(延长寻呼周期)。常考:NB-IoT 适合什么业务(低频小包上报如智能表计)、上行速率、与 LTE Cat.1 的定位差异。",
        links: [
          { t: "EMQX 博客", u: "https://www.emqx.com/zh/blog/category/mqtt" }
        ]
      },
      {
        name: "MQTT + TLS 接入云平台全流程",
        desc: "常考端到端流程:设备配网 → 建立 TCP → TLS 握手(证书校验)→ MQTT CONNECT(携带 clientId/username/password 或证书)→ 订阅主题 → 发布数据 → 平台物模型解析 → 下行指令。易错点:证书烧录、TLS 开销对低端 MCU 的影响、一机一密与一型一密。",
        links: [
          { t: "EMQX MQTT 中文教程", u: "https://www.emqx.com/zh/blog/category/mqtt" },
          { t: "MQTT 官方协议", u: "https://mqtt.org/" }
        ]
      },
      {
        name: "4G Cat.1 模组 AT 指令开发",
        desc: "物联网量产常用方案:MCU + 4G Cat.1 模组(移远/广和通),通过 AT 指令控制:AT+CGATT(入网)、AT+CIPSTART(建 TCP)、AT+MQTTCONN(连 MQTT)、AT+MQTTSUB/PUB。常考:AT 指令解析流程(URC 异步上报)、模组与 MCU 的 UART 交互、断线重连策略。",
        links: [
          { t: "乐鑫官方文档(ESP32)", u: "https://docs.espressif.com/" }
        ]
      }
    ]
  },
  {
    topic: "数据结构与算法",
    icon: "🧮",
    items: [
      {
        name: "链表:反转、判环、合并有序",
        desc: "手撕代码高频三件套:反转链表(迭代+递归两种写法)、判断环(快慢指针)、合并两个有序链表。常考:时间复杂度分析、边界条件(空链表/单节点)、空间复杂度 O(1) 要求。链表题写错指针顺序是最常见扣分点。",
        links: [
          { t: "OI Wiki", u: "https://oi-wiki.org/" },
          { t: "菜鸟教程 数据结构", u: "https://www.runoob.com/data-structures/data-structures-tutorial.html" }
        ]
      },
      {
        name: "栈与队列互实现",
        desc: "经典应用题:两个栈实现队列(入栈/出栈分摊)、两个队列实现栈。常考:操作复杂度分析(摊还 O(1))、单调栈应用(接雨水/最大矩形)、循环队列判空判满。嵌入式岗还会问:消息队列在 RTOS 中的实现思路。",
        links: [
          { t: "OI Wiki", u: "https://oi-wiki.org/" },
          { t: "菜鸟教程 数据结构", u: "https://www.runoob.com/data-structures/data-structures-tutorial.html" }
        ]
      },
      {
        name: "哈希表原理与冲突解决",
        desc: "常考:哈希函数(取模/位运算)、冲突解决(链地址法/开放定址)、负载因子与扩容、STL unordered_map 底层。面试追问:为什么哈希查找平均 O(1)、最坏情况、一致性哈希(分布式场景)。笔试题:设计 LRU 缓存(哈希+双向链表)。",
        links: [
          { t: "OI Wiki", u: "https://oi-wiki.org/" }
        ]
      },
      {
        name: "排序算法复杂度与稳定性",
        desc: "必背表格:冒泡(稳定 O(n²))、快排(不稳定 O(nlogn) 平均)、归并(稳定 O(nlogn))、堆排(不稳定 O(nlogn))、插入(稳定,近乎有序最快)。常考:手写快排/归并、稳定排序的应用场景(多关键字排序)、快排最坏情况与优化(随机基准/三数取中)。",
        links: [
          { t: "OI Wiki", u: "https://oi-wiki.org/" },
          { t: "菜鸟教程 数据结构", u: "https://www.runoob.com/data-structures/data-structures-tutorial.html" }
        ]
      },
      {
        name: "二叉树遍历(递归 + 非递归)",
        desc: "高频手撕:前/中/后序遍历的递归与迭代(栈模拟)、层序遍历(队列)。常考:由中序+前序还原二叉树、二叉搜索树的性质(中序有序)、深度/高度计算、镜像翻转。嵌入式岗偶尔问堆/优先队列。",
        links: [
          { t: "OI Wiki", u: "https://oi-wiki.org/" },
          { t: "力扣 LeetCode", u: "https://leetcode.cn/" }
        ]
      }
    ]
  },
  {
    topic: "ARM 体系结构",
    icon: "🖥️",
    items: [
      {
        name: "RISC 特点与常见指令集",
        desc: "ARM 是 RISC(精简指令集):指令定长、load/store 架构(只有加载/存储访问内存)、寄存器操作。常考:RISC 与 CISC 区别、ARM 常用指令(MOV/LDR/STR/B/BX/LDMIA)、立即数、条件执行。物联网设备对处理器性能/功耗的权衡是面试常延伸点。",
        links: [
          { t: "正点原子 ARM 教程", u: "https://www.openedv.com/" },
          { t: "野火文档", u: "https://embedfire.com/" }
        ]
      },
      {
        name: "五级流水线",
        desc: "经典五级流水线:取指 IF → 译码 ID → 执行 EX → 访存 MEM → 写回 WB。常考:流水线为什么能提速(指令并行)、冒险(hazard)类型:数据冒险/控制冒险/结构冒险及解决(转发/暂停/分支预测)、流水线深度与功耗关系。",
        links: [
          { t: "正点原子 ARM 教程", u: "https://www.openedv.com/" },
          { t: "野火文档", u: "https://embedfire.com/" }
        ]
      },
      {
        name: "中断向量表与异常处理",
        desc: "ARM 异常机制:复位/未定义指令/SVC/预取中止/数据中止/IRQ/FIQ 等异常向量表。常考:向量表在启动文件中的位置(0x00000000 或重定位)、异常响应流程(保存现场→跳处理函数→恢复)、IRQ 与 FIQ 区别、中断嵌套。",
        links: [
          { t: "正点原子 ARM 教程", u: "https://www.openedv.com/" },
          { t: "野火文档", u: "https://embedfire.com/" }
        ]
      },
      {
        name: "Thumb / ARM 状态切换",
        desc: "Thumb 是 16 位压缩指令集(Thumb-2 混合 32 位),代码密度高、省 flash,性能略低。常考:如何切换状态(BX 指令最低位为 1 切 Thumb)、Cortex-M 只支持 Thumb 的原因、为什么 Cortex-M 没有 ARM 状态。",
        links: [
          { t: "正点原子 ARM 教程", u: "https://www.openedv.com/" }
        ]
      },
      {
        name: "启动文件:堆栈初始化、向量表重定位",
        desc: "启动汇编(startup_xxx.s)考点:初始化 MSP(栈指针)、设置向量表、调用 SystemInit、进入 main。常考:__initial_sp 与堆大小设置、SCB->VTOR 重定位向量表(OTA 升级场景)、看门狗早期喂狗、启动文件里的段属性(AREA)。",
        links: [
          { t: "正点原子 ARM 教程", u: "https://www.openedv.com/" },
          { t: "野火文档", u: "https://embedfire.com/" }
        ]
      }
    ]
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

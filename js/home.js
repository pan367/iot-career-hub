/* ============ 首页(复刻 LŪMEN // ÍNDEX)交互 ============
 * 汉堡菜单:开/关 + 条目错峰入场(cascade in, snap out)
 * 菜单项点击后跳转对应板块并关闭菜单
 */
(function () {
  "use strict";

  const menu = document.getElementById("homeMenu");
  const burger = document.getElementById("homeHamburger");
  if (!menu || !burger) return;

  const items = Array.from(document.querySelectorAll(".hm-item"));
  const wallet = document.getElementById("hmWallet");

  function applyStagger(open) {
    /* 打开时逐条 cascade(150 + i*75ms),关闭时同时 snap out */
    items.forEach((it, i) => {
      it.style.transitionDelay = open ? `${150 + i * 75}ms` : "0ms";
    });
    if (wallet) wallet.style.transitionDelay = open ? "450ms" : "0ms";
  }

  function openMenu() {
    applyStagger(true);
    menu.classList.remove("closed");
    menu.classList.add("open");
    burger.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    applyStagger(false);
    menu.classList.remove("open");
    menu.classList.add("closed");
    burger.classList.remove("open");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", () => {
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });

  document.getElementById("hmClose").addEventListener("click", closeMenu);
  document.getElementById("hmBackdrop").addEventListener("click", closeMenu);

  /* 菜单项点击 → hash 跳转 + 关闭(点击目标若非当前页) */
  items.forEach(it => {
    it.addEventListener("click", () => {
      closeMenu();
      /* hash 由 href 自动更新,app.js 路由响应;这里只需关闭菜单 */
    });
  });

  /* 从板块返回首页时确保菜单关闭 */
  window.addEventListener("hashchange", () => {
    if (menu.classList.contains("open")) closeMenu();
  });

  /* 菜单初始为关闭状态 */
  menu.classList.add("closed");

  /* 背景视频失败兜底:加载/播放异常时隐藏视频层,露出黑底网格,避免黑屏 */
  const homeVideo = document.querySelector(".home-video");
  if (homeVideo) {
    const fallback = () => {
      homeVideo.style.display = "none";
      document.querySelector(".home-hero").style.background =
        "radial-gradient(560px 300px at 50% 0%, rgba(175,221,255,.08), transparent 72%)";
    };
    homeVideo.addEventListener("error", fallback);
    /* 部分移动浏览器 autoplay 被拦:尝试手动播放一次 */
    homeVideo.addEventListener("canplay", () => {
      const p = homeVideo.play();
      if (p && p.catch) p.catch(() => { /* 忽略,静音视频一般可自动播放 */ });
    });
    setTimeout(() => {
      if (homeVideo.readyState === 0) fallback(); /* 8 秒未加载出数据则降级 */
    }, 8000);
  }
})();

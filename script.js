/* =========================================================
   Portfolyo — Etkileşimler
   - Mobil menü aç/kapa
   - Bölümlere yumuşak kaydırma
   ========================================================= */

(() => {
  "use strict";

  const MOBILE_QUERY = "(max-width: 720px)";

  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const navList = nav ? nav.querySelector(".nav__list") : null;

  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let toggle = null;
  let generatedToggle = false;
  let lenis = null;

  // Preloader sayfa boyunca kaydırmayı kilitler
  if (document.querySelector("[data-preloader]")) {
    document.documentElement.classList.add("is-loading");

    // Yenilemede önceki kaydırma konumuna dönmeyi engelle
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------
     Mobil menü
     --------------------------------------------------------- */

  /**
   * index.html'de menü butonu bulunmadığı için buton burada
   * oluşturuluyor ve stilleri sayfaya ekleniyor.
   * İleride index.html/style.css'e taşınırsa bu bölüm sadeleşebilir.
   */
  function addToggleStyles() {
    if (document.getElementById("nav-toggle-styles")) return;

    const style = document.createElement("style");
    style.id = "nav-toggle-styles";
    style.textContent = `
      .nav__toggle {
        display: none;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        padding: 0;
        font: inherit;
        font-size: 1.3rem;
        line-height: 1;
        color: var(--text, #e8eef5);
        background: transparent;
        border: 1px solid var(--border, #243040);
        border-radius: 10px;
        cursor: pointer;
        transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
      }

      .nav__toggle:hover,
      .nav__toggle:focus-visible {
        color: var(--accent, #4fd1c5);
        border-color: var(--accent, #4fd1c5);
        background: var(--surface, #151c25);
      }

      @media (max-width: 720px) {
        .nav {
          position: relative;
        }

        .nav__toggle {
          position: absolute;
          top: 6px;
          right: 16px;
          display: inline-flex;
        }

        /* Menü yalnızca JS çalıştığında gizlenir (progressive enhancement) */
        .nav--enhanced .nav__list {
          display: none;
        }

        .nav--enhanced.nav--open .nav__list {
          display: flex;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createToggle() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav__toggle";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Menüyü aç");
    button.textContent = "☰";
    nav.insertBefore(button, navList);
    return button;
  }

  function setMenu(open) {
    if (!nav || !toggle) return;

    nav.classList.toggle("nav--open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");

    if (generatedToggle) {
      toggle.textContent = open ? "✕" : "☰";
    }
  }

  function closeMenu() {
    if (nav && nav.classList.contains("nav--open")) {
      setMenu(false);
    }
  }

  function initMenu() {
    if (!nav || !navList) return;

    addToggleStyles();

    if (!navList.id) {
      navList.id = "primary-menu";
    }

    toggle = nav.querySelector(".nav__toggle");
    generatedToggle = !toggle;

    if (!toggle) {
      toggle = createToggle();
    }

    toggle.setAttribute("aria-controls", navList.id);
    setMenu(false);

    // JS aktif olduğunda mobil menü katlanabilir hale gelir
    nav.classList.add("nav--enhanced");

    toggle.addEventListener("click", () => {
      setMenu(!nav.classList.contains("nav--open"));
    });

    // Menüdeki bir bağlantıya tıklanınca menüyü kapat
    navList.addEventListener("click", (event) => {
      if (event.target.closest?.("a")) {
        closeMenu();
      }
    });

    // Menü dışına tıklanınca kapat
    document.addEventListener("click", (event) => {
      if (!mobileQuery.matches || !nav.classList.contains("nav--open")) return;
      if (!nav.contains(event.target)) {
        closeMenu();
      }
    });

    // Escape ile kapat ve odağı butona geri ver
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("nav--open")) {
        closeMenu();
        toggle.focus();
      }
    });

    // Masaüstü/mobil geçişinde menü durumunu sıfırla
    const syncViewport = () => setMenu(false);
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncViewport);
    } else {
      mobileQuery.addListener(syncViewport);
    }
  }

  /* ---------------------------------------------------------
     Yumuşak kaydırma
     --------------------------------------------------------- */

  function getHeaderOffset() {
    return header ? header.getBoundingClientRect().height + 12 : 12;
  }

  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        let target;
        try {
          target = document.querySelector(hash);
        } catch {
          return; // Geçersiz seçici — varsayılan davranışa bırak
        }

        if (!target) return;

        event.preventDefault();

        // Menü açıksa önce kapat: başlık yüksekliği küçülsün
        closeMenu();

        const top = Math.max(
          0,
          window.scrollY + target.getBoundingClientRect().top - getHeaderOffset()
        );

        if (lenis) {
          lenis.scrollTo(top, { immediate: reducedMotion.matches });
        } else {
          window.scrollTo({
            top,
            behavior: reducedMotion.matches ? "auto" : "smooth",
          });
        }

        if (history.pushState) {
          history.pushState(null, "", hash);
        } else {
          window.location.hash = hash;
        }

        // Klavye kullanıcıları için odağı hedef bölüme taşı
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------------------------------------------------------
     Lenis + ScrollTrigger
     --------------------------------------------------------- */

  function initSmoothScrolling() {
    const LenisConstructor = window.Lenis;
    if (!LenisConstructor || reducedMotion.matches) return;

    lenis = new LenisConstructor({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const gsapLib = window.gsap;
    const scrollTriggerLib = window.ScrollTrigger;

    if (gsapLib && scrollTriggerLib) {
      // Lenis kaydırmasını ScrollTrigger ile senkronize et
      lenis.on("scroll", scrollTriggerLib.update);
      gsapLib.ticker.add((time) => lenis.raf(time * 1000));
      gsapLib.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* ---------------------------------------------------------
     Kaydırma animasyonları
     --------------------------------------------------------- */

  function splitHeading(heading) {
    const words = heading.textContent.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];

    heading.textContent = "";
    heading.classList.add("heading--split");
    const inners = [];

    words.forEach((word, index) => {
      if (index > 0) {
        heading.appendChild(document.createTextNode(" "));
      }

      const mask = document.createElement("span");
      mask.className = "word-mask";

      const inner = document.createElement("span");
      inner.className = "word-inner";
      inner.textContent = word;

      mask.appendChild(inner);
      heading.appendChild(mask);
      inners.push(inner);
    });

    return inners;
  }

  function initHeroScrollAnimation(gsapLib) {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const state = { progress: 0 };

    const bind = (controller) => {
      if (!controller || typeof controller.setScrollProgress !== "function") return;
      if (controller.scrollBound) return;

      controller.scrollBound = true;

      gsapLib.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
        onUpdate: () => controller.setScrollProgress(state.progress),
      });
    };

    // hero3d.js bu betikten önce veya sonra yüklenebilir
    if (window.hero3D) {
      bind(window.hero3D);
    }

    window.addEventListener(
      "hero3d:ready",
      (event) => bind(event.detail),
      { once: true }
    );
  }

  function refreshScrollTriggers(scrollTriggerLib) {
    const refresh = () => scrollTriggerLib.refresh();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    window.addEventListener("load", refresh, { once: true });
  }

  function initScrollAnimations() {
    const gsapLib = window.gsap;
    const scrollTriggerLib = window.ScrollTrigger;

    if (!gsapLib || !scrollTriggerLib || reducedMotion.matches) return;

    gsapLib.registerPlugin(scrollTriggerLib);

    // Bölüm başlıkları: kelime kelime, maskenin altından yukarı
    document
      .querySelectorAll("main .section > h1, main .section > h2")
      .forEach((heading) => {
        const words = splitHeading(heading);
        if (!words.length) return;

        gsapLib.fromTo(
          words,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

    // Paragraflar: fade + y:40
    document.querySelectorAll("main .section p").forEach((paragraph) => {
      gsapLib.from(paragraph, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: paragraph,
          start: "top 88%",
          once: true,
        },
      });
    });

    initHeroScrollAnimation(gsapLib);
    refreshScrollTriggers(scrollTriggerLib);
  }

  /* ---------------------------------------------------------
     Özel imleç + magnetic butonlar
     --------------------------------------------------------- */

  function initCustomCursor() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    // Dokunmatik cihazlarda ve hareket azaltma tercihinde imleç kapalı
    if (!finePointer.matches || reducedMotion.matches) return;

    const dot = document.createElement("div");
    dot.className = "cursor__dot";
    dot.setAttribute("aria-hidden", "true");

    const ring = document.createElement("div");
    ring.className = "cursor__ring";
    ring.setAttribute("aria-hidden", "true");

    document.body.append(dot, ring);
    document.documentElement.classList.add("has-custom-cursor");

    const magnetics = Array.from(
      document.querySelectorAll(".button, button")
    ).map((element) => {
      element.classList.add("is-magnetic");
      return { element, x: 0, y: 0 };
    });

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPosition = { x: pointer.x, y: pointer.y };
    const ringPosition = { x: pointer.x, y: pointer.y };

    const MAX_PULL = 15;
    const ACTIVATION_DISTANCE = 90;
    const DOT_EASING = 0.55;
    const RING_EASING = 0.16;

    let visible = false;
    let frameId = 0;

    function updateMagnets() {
      magnetics.forEach((item) => {
        const rect = item.element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        // Rect, uygulanan transform'u da içerir; taban merkeze geri dön
        const centerX = rect.left + rect.width / 2 - item.x;
        const centerY = rect.top + rect.height / 2 - item.y;
        const deltaX = pointer.x - centerX;
        const deltaY = pointer.y - centerY;
        const distance = Math.hypot(deltaX, deltaY);
        const activation =
          Math.max(rect.width, rect.height) / 2 + ACTIVATION_DISTANCE;

        let targetX = 0;
        let targetY = 0;

        if (distance < activation) {
          const strength = 1 - distance / activation;
          targetX = deltaX * 0.35 * strength;
          targetY = deltaY * 0.35 * strength;

          const magnitude = Math.hypot(targetX, targetY);
          if (magnitude > MAX_PULL) {
            targetX = (targetX / magnitude) * MAX_PULL;
            targetY = (targetY / magnitude) * MAX_PULL;
          }
        }

        item.x += (targetX - item.x) * 0.18;
        item.y += (targetY - item.y) * 0.18;

        item.element.style.transform =
          `translate3d(${item.x}px, ${item.y}px, 0)`;
      });
    }

    function render() {
      dotPosition.x += (pointer.x - dotPosition.x) * DOT_EASING;
      dotPosition.y += (pointer.y - dotPosition.y) * DOT_EASING;
      ringPosition.x += (pointer.x - ringPosition.x) * RING_EASING;
      ringPosition.y += (pointer.y - ringPosition.y) * RING_EASING;

      dot.style.transform = `translate3d(${dotPosition.x}px, ${dotPosition.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0) translate(-50%, -50%)`;

      updateMagnets();

      frameId = requestAnimationFrame(render);
    }

    function start() {
      if (frameId) return;
      frameId = requestAnimationFrame(render);
    }

    function stop() {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function hide() {
      if (!visible) return;

      visible = false;
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible", "is-hover");
      stop();

      magnetics.forEach((item) => {
        item.x = 0;
        item.y = 0;
        item.element.style.transform = "";
      });
    }

    function onPointerMove(event) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!visible) {
        // İlk harekette imleci zıplatmadan göster
        dotPosition.x = pointer.x;
        dotPosition.y = pointer.y;
        ringPosition.x = pointer.x;
        ringPosition.y = pointer.y;

        visible = true;
        dot.classList.add("is-visible");
        ring.classList.add("is-visible");
        start();
      }

      const target = event.target;
      const interactive =
        target instanceof Element ? target.closest("a, button") : null;
      ring.classList.toggle("is-hover", Boolean(interactive));
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) hide();
    });
  }

  /* ---------------------------------------------------------
     Proje önizlemesi (imleci takip eden gradient kutu)
     --------------------------------------------------------- */

  function initProjectPreview() {
    const list = document.querySelector("[data-project-list]");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!list || !finePointer.matches || reducedMotion.matches) return;

    const preview = document.createElement("div");
    preview.className = "project-preview";
    preview.setAttribute("aria-hidden", "true");

    const media = document.createElement("div");
    media.className = "project-preview__media";
    preview.appendChild(media);
    document.body.appendChild(preview);

    const pointer = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };

    const OFFSET = 32;
    const EDGE = 16;
    const EASING = 0.14;

    let visible = false;
    let frameId = 0;

    function getTarget() {
      const width = preview.offsetWidth;
      const height = preview.offsetHeight;

      let x = pointer.x + OFFSET;
      if (x + width > window.innerWidth - EDGE) {
        x = pointer.x - width - OFFSET;
      }

      let y = pointer.y - height / 2;
      const maxY = window.innerHeight - height - EDGE;
      y = Math.max(EDGE, Math.min(y, Math.max(EDGE, maxY)));

      return { x, y };
    }

    function render() {
      const target = getTarget();

      position.x += (target.x - position.x) * EASING;
      position.y += (target.y - position.y) * EASING;

      preview.style.transform =
        `translate3d(${position.x}px, ${position.y}px, 0)`;

      frameId = requestAnimationFrame(render);
    }

    function start() {
      if (frameId) return;
      frameId = requestAnimationFrame(render);
    }

    function stop() {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function show(row) {
      if (preview.dataset.project !== row.dataset.project) {
        preview.dataset.project = row.dataset.project;
      }

      if (visible) return;

      const target = getTarget();
      position.x = target.x;
      position.y = target.y;
      preview.style.transform =
        `translate3d(${position.x}px, ${position.y}px, 0)`;

      visible = true;
      preview.classList.add("is-visible");
      start();
    }

    function hide() {
      if (!visible) return;

      visible = false;
      preview.classList.remove("is-visible");
      stop();
    }

    list.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      const target = event.target;
      const row =
        target instanceof Element
          ? target.closest("[data-project-row]")
          : null;

      if (row && list.contains(row)) {
        show(row);
      } else {
        hide();
      }
    });

    list.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) hide();
    });
  }

  /* ---------------------------------------------------------
     Preloader + hero başlığı
     --------------------------------------------------------- */

  function initHeroTitle() {
    const title = document.querySelector("[data-hero-title]");
    if (!title) return () => {};

    const lines = Array.from(title.querySelectorAll(".hero__line"));
    const chars = [];

    lines.forEach((line) => {
      const text = line.textContent;
      line.textContent = "";

      Array.from(text).forEach((character) => {
        if (character === " ") {
          line.appendChild(document.createTextNode(" "));
          return;
        }

        const mask = document.createElement("span");
        mask.className = "char-mask";

        const inner = document.createElement("span");
        inner.className = "char";
        inner.textContent = character;

        mask.appendChild(inner);
        line.appendChild(mask);
        chars.push(inner);
      });
    });

    let played = false;

    return function play() {
      if (played) return;
      played = true;

      // Hareket azaltma tercihinde başlık doğrudan görünür
      if (reducedMotion.matches) {
        chars.forEach((char) => {
          char.style.transform = "none";
        });
        return;
      }

      const gsapLib = window.gsap;

      if (gsapLib) {
        gsapLib.fromTo(
          chars,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 1.05,
            ease: "power4.out",
            stagger: 0.045,
            delay: 0.15,
            overwrite: true,
          }
        );
      } else {
        // GSAP yüklenemezse Web Animations API ile aynı etki
        chars.forEach((char, index) => {
          char.animate(
            [
              { transform: "translate3d(0, 118%, 0)" },
              { transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration: 900,
              delay: 150 + index * 45,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "both",
            }
          );
        });
      }
    };
  }

  function initPreloader(playHeroTitle) {
    const preloader = document.querySelector("[data-preloader]");
    const countEl = document.querySelector("[data-preloader-count]");
    const bar = document.querySelector("[data-preloader-bar]");

    const playTitle =
      typeof playHeroTitle === "function" ? playHeroTitle : () => {};

    if (!preloader) {
      document.documentElement.classList.remove("is-loading");
      playTitle();
      return;
    }

    let value = -1;
    let finished = false;
    let loadWaitTimer = 0;

    function setValue(next) {
      const clamped = Math.max(0, Math.min(100, Math.round(next)));
      if (clamped === value) return;

      value = clamped;
      if (countEl) countEl.textContent = String(clamped);
      if (bar) bar.style.transform = `scaleX(${clamped / 100})`;
    }

    function finish() {
      if (finished) return;
      finished = true;

      window.clearTimeout(loadWaitTimer);
      document.documentElement.classList.remove("is-loading");

      preloader.classList.add("is-done");
      playTitle();

      const remove = () => {
        if (preloader.isConnected) preloader.remove();
      };

      preloader.addEventListener("transitionend", (event) => {
        if (event.target === preloader && event.propertyName === "transform") {
          remove();
        }
      });

      // transitionend gelmezse (ör. reduced motion) temizle
      window.setTimeout(remove, 1400);
    }

    // Sayaç bittiğinde sayfanın yüklenmesini bekle (en fazla 1,2 sn)
    function whenLoaded() {
      if (document.readyState === "complete") {
        finish();
        return;
      }

      window.addEventListener("load", finish, { once: true });
      loadWaitTimer = window.setTimeout(finish, 1200);
    }

    if (reducedMotion.matches) {
      setValue(100);
      window.setTimeout(finish, 200);
      return;
    }

    const DURATION = 1700;
    let startTime = 0;

    function tick(now) {
      if (!startTime) startTime = now;

      const progress = Math.min(1, (now - startTime) / DURATION);
      // Sona yaklaştıkça yavaşlayan sayaç
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * 100);

      if (progress < 1) {
        requestAnimationFrame(tick);
        return;
      }

      setValue(100);
      whenLoaded();
    }

    requestAnimationFrame(tick);
  }

  const playHeroTitle = initHeroTitle();

  // Preloader önce başlatılır: sonraki bir başlatma hata verse bile
  // sayaç tamamlanıp perde kalkar.
  initPreloader(playHeroTitle);

  initMenu();
  initSmoothScrolling();
  initSmoothScroll();
  initScrollAnimations();
  initCustomCursor();
  initProjectPreview();
})();

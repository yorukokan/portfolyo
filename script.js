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

        window.scrollTo({
          top,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });

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

  initMenu();
  initSmoothScroll();
})();

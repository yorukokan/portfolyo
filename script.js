/* ==========================================================================
   Okan Yörük — High-FPS Scroll Choreography, Wavy Canvases & Custom Cursor
   ========================================================================== */

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------------
     1. Lenis Yumuşak Kaydırma + Kaydırma Hızı (Velocity)
     ------------------------------------------------------------------------ */
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  function initSmoothScroll() {
    if (reducedMotion.matches || typeof window.Lenis !== "function") return;

    const lenis = new window.Lenis({
      lerp: 0.095,
      smoothWheel: true,
    });

    lenis.on("scroll", (e) => {
      scrollVelocity = e.velocity || 0;
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  window.addEventListener(
    "scroll",
    () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollVelocity = dy * 0.22;
    },
    { passive: true }
  );

  /* ------------------------------------------------------------------------
     2. Özel İmleç (Parlayan Beyaz Nokta + Hover'da 48px İnce Çember)
     ------------------------------------------------------------------------ */
  function initCustomCursor() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const cursor = document.querySelector("[data-cursor]");
    if (!finePointer.matches || !(cursor instanceof HTMLElement)) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    let visible = false;

    window.addEventListener(
      "pointermove",
      (event) => {
        target.x = event.clientX;
        target.y = event.clientY;

        if (!visible) {
          visible = true;
          pos.x = target.x;
          pos.y = target.y;
          cursor.classList.add("is-visible");
        }

        const el = event.target;
        const isRingTarget =
          el instanceof Element
            ? el.closest(".wavy-work, [data-cursor-ring], a, button")
            : null;
        cursor.classList.toggle("is-ring", Boolean(isRingTarget));
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => {
      visible = false;
      cursor.classList.remove("is-visible");
    });

    function renderCursor() {
      pos.x += (target.x - pos.x) * 0.28;
      pos.y += (target.y - pos.y) * 0.28;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  /* ------------------------------------------------------------------------
     3. Yatay Kaydırılan Projeler + Yüksek Performanslı Wavy Kanvaslar
        (Yalnızca #selected-works ekranda görünürken çizilir -> Sıfır gereksiz CPU yükü!)
     ------------------------------------------------------------------------ */
  function initWorksAndWavyCanvases() {
    const section = document.getElementById("selected-works");
    const track = document.querySelector("[data-works-track]");
    const canvases = Array.from(document.querySelectorAll("[data-wavy-canvas]"));
    if (!section || !(track instanceof HTMLElement) || !canvases.length) return;

    const W = 760;
    const H = 460;
    const PAD_Y = 20;
    const INNER_H = H - PAD_Y * 2;

    function createSourceArtwork(key, externalImg) {
      const off = document.createElement("canvas");
      off.width = W;
      off.height = INNER_H;
      const ctx = off.getContext("2d");
      if (!ctx) return off;

      if (externalImg) {
        ctx.drawImage(externalImg, 0, 0, W, INNER_H);
        return off;
      }

      if (key === "ipo") {
        ctx.fillStyle = "#F4F4F2";
        ctx.fillRect(0, 0, W, INNER_H);

        const topCards = [
          { bg: "#141417", title: "ARACI KURUM #1", sub: "Teminat Blokajı" },
          { bg: "#1E222B", title: "ARACI KURUM #2", sub: "Lot Dağıtım" },
          { bg: "#E8EAE6", title: "SUPABASE DB", sub: "İlişkisel Şema", darkText: true },
          { bg: "#222630", title: "PORTFÖY #3", sub: "Konsolide Nakit" },
          { bg: "#141417", title: "REST API", sub: "Node.js + Express" },
        ];
        const tw = (W - 36) / 5;
        topCards.forEach((c, idx) => {
          const x = 6 + idx * (tw + 6);
          ctx.fillStyle = c.bg;
          ctx.fillRect(x, 6, tw, 82);
          ctx.fillStyle = c.darkText ? "#18181B" : "#F0F2F0";
          ctx.font = "600 9px Inter, sans-serif";
          ctx.fillText(c.title, x + 10, 26);
          ctx.fillStyle = c.darkText ? "#52525B" : "#9CA3AF";
          ctx.font = "400 8px Inter, sans-serif";
          ctx.fillText(c.sub, x + 10, 42);
        });

        ctx.fillStyle = "#121215";
        ctx.fillRect(6, 94, 340, 224);
        ctx.fillStyle = "#D4A373";
        ctx.fillRect(18, 108, 128, 92);
        ctx.fillStyle = "#F0F2F0";
        ctx.font = "600 18px Inter, sans-serif";
        ctx.fillText("HALKA ARZ", 164, 152);
        ctx.fillText("× PORTFÖY", 164, 174);
        ctx.font = "400 9px Inter, sans-serif";
        ctx.fillStyle = "#9CA3AF";
        ctx.fillText("Node.js · Supabase · PostgreSQL", 18, 286);
        ctx.fillText("Çoklu Hesap Talep & Lot Motoru", 18, 300);

        ctx.fillStyle = "#F7F7F5";
        ctx.fillRect(352, 94, 402, 224);
        ctx.fillStyle = "#141417";
        ctx.font = "600 16px Inter, sans-serif";
        ctx.fillText("THE ARCHITECTURE", 374, 212);
        ctx.strokeStyle = "rgba(20, 20, 23, 0.24)";
        ctx.font = "600 17px Inter, sans-serif";
        ctx.strokeText("MULTI-ACCOUNT LEDGER", 374, 236);
        ctx.strokeText("LOT DISTRIBUTION ENGINE", 374, 258);
        ctx.strokeText("PROFIT PROJECTIONS 2026", 374, 280);

        const bw = (W - 30) / 4;
        for (let i = 0; i < 4; i++) {
          const bx = 6 + i * (bw + 6);
          ctx.fillStyle = i % 2 === 0 ? "#1C1D22" : "#E5E7EB";
          ctx.fillRect(bx, 324, bw, 88);
          ctx.fillStyle = i % 2 === 0 ? "#F0F2F0" : "#141417";
          ctx.font = "500 10px Inter, sans-serif";
          ctx.fillText(
            ["BLOKAJ HESABI", "NET MALİYET", "TAVAN SERİSİ", "KONSOLİDE NAKİT"][i],
            bx + 12,
            352
          );
        }
      } else if (key === "emotion") {
        ctx.fillStyle = "#A31D36";
        ctx.fillRect(0, 0, W, INNER_H);

        ctx.fillStyle = "#08080B";
        ctx.fillRect(54, 38, W - 108, INNER_H - 76);

        ctx.fillStyle = "#A1A5B0";
        ctx.fillRect(W / 2 - 20, INNER_H / 2 - 26, 40, 52);
        ctx.strokeStyle = "#27272A";
        ctx.strokeRect(W / 2 - 80, INNER_H / 2 - 64, 160, 128);

        ctx.fillStyle = "#F0F2F0";
        ctx.font = "400 11px Inter, sans-serif";
        ctx.fillText("PYTORCH CNN · FER-2013", 82, 72);
        ctx.fillStyle = "#71717A";
        ctx.fillText("OPENCV + FASTAPI + FLUTTER", W - 246, 72);
        ctx.fillText("REAL-TIME FACIAL EMOTION INFERENCE", 82, INNER_H - 58);
      } else if (key === "bookan") {
        ctx.fillStyle = "#3E2D24";
        ctx.fillRect(0, 0, W, INNER_H);

        ctx.fillStyle = "#F4F1EA";
        ctx.fillRect(42, 34, W - 84, INNER_H - 68);

        ctx.fillStyle = "#263532";
        ctx.fillRect(42, 82, 330, INNER_H - 116);
        ctx.fillStyle = "#D4A373";
        ctx.beginPath();
        ctx.arc(140, 175, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#F4F1EA";
        ctx.font = "500 14px Inter, sans-serif";
        ctx.fillText("Dijital Kütüphane & Alıntı Ağı", 72, 260);
        ctx.font = "400 11px Inter, sans-serif";
        ctx.fillStyle = "#A7B3B0";
        ctx.fillText("Flutter (Mobil & Web) · Google Books API", 72, 282);

        ctx.fillStyle = "#1E1D22";
        ctx.font = "600 13px Inter, sans-serif";
        ctx.fillText("BOOKAN PLATFORM", 342, 64);
        ctx.fillStyle = "#698296";
        ctx.fillRect(436, 108, 168, 198);
        ctx.fillStyle = "#F4F1EA";
        ctx.font = "500 11px Inter, sans-serif";
        ctx.fillText("ISBN & Katalog", 456, 200);
        ctx.fillText("Senkronizasyonu", 456, 218);
      } else if (key === "turksat") {
        ctx.fillStyle = "#7C4D30";
        ctx.fillRect(0, 0, W, INNER_H);

        ctx.fillStyle = "#20473F";
        ctx.fillRect(28, 28, 410, INNER_H - 56);

        ctx.fillStyle = "#E8C5B0";
        ctx.fillRect(438, 28, W - 466, INNER_H - 56);

        ctx.fillStyle = "#F0F2F0";
        ctx.font = "500 20px Inter, sans-serif";
        ctx.fillText("TÜRKSAT A.Ş.", 62, 92);
        ctx.font = "400 13px Inter, sans-serif";
        ctx.fillStyle = "#A7C7BE";
        ctx.fillText("Sistem ve Ağ Yönetimi Müdürlüğü", 62, 118);
        ctx.fillText("Active Directory (AD DS) · DNS · DHCP · GPO", 62, 168);
        ctx.fillText("En Az Yetki Prensibi (PoLP) & RBAC Denetimi", 62, 192);
        ctx.fillText("Linux & Windows Server Otomasyonu", 62, 216);
      } else {
        ctx.fillStyle = "#16161A";
        ctx.fillRect(0, 0, W, INNER_H);

        ctx.strokeStyle = "rgba(240, 242, 240, 0.14)";
        ctx.strokeRect(28, 28, 340, INNER_H - 56);
        ctx.strokeRect(390, 28, 342, INNER_H - 56);

        ctx.fillStyle = "#F0F2F0";
        ctx.font = "500 16px Inter, sans-serif";
        ctx.fillText("Python TCP / UDP Soket", 54, 78);
        ctx.fillText("Qt & C++ Envanter Sistemi", 416, 78);

        ctx.fillStyle = "#8E8E95";
        ctx.font = "400 12px Inter, sans-serif";
        ctx.fillText("Multithreaded İstemci-Sunucu Mimarisi", 54, 110);
        ctx.fillText("SQLite İlişkisel CRUD & Raporlama", 416, 110);

        ctx.strokeStyle = "#F0F2F0";
        ctx.beginPath();
        for (let x = 54; x < 340; x += 4) {
          const y = 240 + Math.sin(x * 0.06) * 28;
          if (x === 54) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        for (let r = 0; r < 4; r++) {
          ctx.fillStyle = r === 0 ? "rgba(240,242,240,0.16)" : "rgba(240,242,240,0.06)";
          ctx.fillRect(416, 160 + r * 44, 290, 34);
        }
      }

      return off;
    }

    const items = canvases
      .map((canvas) => {
        if (!(canvas instanceof HTMLCanvasElement)) return null;
        const key = canvas.getAttribute("data-wavy-canvas") || "ipo";
        const imgSrc = canvas.getAttribute("data-img-src") || "";
        const ctx = canvas.getContext("2d");

        const state = {
          canvas,
          ctx,
          key,
          source: createSourceArtwork(key, null),
          hovered: false,
          hoverAmp: 0,
        };

        if (imgSrc) {
          const img = new Image();
          img.onload = () => {
            state.source = createSourceArtwork(key, img);
            drawSingleCard(state, 0, 0);
          };
          img.src = imgSrc;
        }

        const parentCard = canvas.closest(".wavy-work");
        if (parentCard) {
          parentCard.addEventListener("pointerenter", () => {
            state.hovered = true;
          });
          parentCard.addEventListener("pointerleave", () => {
            state.hovered = false;
          });
        }

        return state;
      })
      .filter(Boolean);

    function drawSingleCard(item, idx, tick) {
      if (!item || !item.ctx) return;
      const { ctx, source, hovered } = item;
      const targetHoverAmp = hovered ? 5.5 : 0;
      item.hoverAmp += (targetHoverAmp - item.hoverAmp) * 0.12;

      const velAmp = Math.min(9, Math.abs(scrollVelocity) * 0.45);
      const baseAmp = 6.5 + item.hoverAmp + velAmp;

      ctx.clearRect(0, 0, W, H);

      const stripW = 8; // 8px strips -> 2x faster with identical smooth curve
      for (let x = 0; x < W; x += stripW) {
        const u = x / W;
        const waveY =
          Math.sin(u * Math.PI * 2.0 + tick + idx * 1.2) * baseAmp +
          Math.cos(u * Math.PI * 1.1 - tick * 0.7) * (baseAmp * 0.32);

        ctx.drawImage(
          source,
          x,
          0,
          stripW,
          INNER_H,
          x,
          PAD_Y + waveY,
          stripW,
          INNER_H
        );
      }
    }

    // Initial static draw so cards are ready before scrolling into view
    items.forEach((item, idx) => drawSingleCard(item, idx, 0));

    let worksVisible = false;
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          worksVisible = entries[0]?.isIntersecting || false;
        },
        { rootMargin: "200px 0px" }
      );
      obs.observe(section);
    } else {
      worksVisible = true;
    }

    function updateHorizontalPosition() {
      if (!worksVisible) return;
      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(
        1,
        section.offsetHeight - window.innerHeight
      );
      const scrolled = Math.min(scrollableDistance, Math.max(0, -rect.top));
      const progress = scrolled / scrollableDistance;

      const maxTranslate = Math.max(
        0,
        track.scrollWidth - window.innerWidth * 0.78
      );
      const tx = -progress * maxTranslate;
      track.style.transform = `translate3d(${tx}px, 0, 0)`;
    }

    window.addEventListener("scroll", updateHorizontalPosition, {
      passive: true,
    });
    window.addEventListener("resize", updateHorizontalPosition);

    let tick = 0;
    function loopWavy() {
      if (worksVisible && !reducedMotion.matches) {
        tick += 0.035;
        items.forEach((item, idx) => drawSingleCard(item, idx, tick));
      }
      requestAnimationFrame(loopWavy);
    }
    requestAnimationFrame(loopWavy);
  }

  /* ------------------------------------------------------------------------
     4. Proje Kartına Tıklanınca Açılan Detay Çekmecesi
     ------------------------------------------------------------------------ */
  function initProjectModal() {
    const modal = document.querySelector("[data-project-modal]");
    const yearEl = document.querySelector("[data-modal-year]");
    const titleEl = document.querySelector("[data-modal-title]");
    const stackEl = document.querySelector("[data-modal-stack]");
    const listEl = document.querySelector("[data-modal-list]");
    const closeBtns = document.querySelectorAll("[data-modal-close]");
    const cards = document.querySelectorAll("[data-work-item]");

    if (!(modal instanceof HTMLElement)) return;

    const DETAILS = {
      ipo: {
        year: "2026",
        title: "Çoklu Portföy & Halka Arz Talep Yönetim Sistemi",
        stack: "Node.js · Express.js · Supabase · PostgreSQL · REST API",
        points: [
          "Farklı aracı kurumlar ve birden fazla yatırımcı hesabı üzerinden iletilen halka arz taleplerinin, teminat blokajlarının ve lot dağıtımlarının merkezi yönetim altyapısı geliştirildi.",
          "Arka yüz mimarisi Node.js ile kurgulanarak Supabase/PostgreSQL üzerinde ilişkisel veri modelleri (hesaplar, hisse kodları, dağıtım oranları) ve güvenli kimlik doğrulama katmanı yapılandırıldı.",
          "Halka arz sonuçları doğrultusunda hesap bazlı net maliyet, kâr/zarar projeksiyonları ve konsolide nakit durumunu hesaplayan analitik uç noktalar entegre edildi.",
        ],
      },
      emotion: {
        year: "Şubat – Haziran 2026",
        title: "Duygu Durumu Analizi ile Kişiselleştirilmiş Öneri Uygulaması",
        stack: "Flutter · FastAPI · Python · PyTorch · OpenCV · PostgreSQL · Firebase",
        points: [
          "Evrişimli Sinir Ağları (CNN) tabanlı model FER-2013 veri setiyle PyTorch üzerinde eğitildi; OpenCV ile anlık yüz ifadesi ve duygu tespiti sağlandı.",
          "Tespit edilen duygu durumuna göre kullanıcıya dinamik beslenme/aktivite önerileri sunan karar algoritması geliştirilerek FastAPI ve PostgreSQL ile entegre edildi.",
        ],
      },
      bookan: {
        year: "2025",
        title: "Bookan — Sosyal Kitap Keşif Platformu (Mobil & Web)",
        stack: "Flutter · Dart · PHP · MySQL/PostgreSQL · Firebase · Google Books API",
        points: [
          "Kullanıcıların dijital kütüphane ve okuma listeleri yönetebildiği, alıntı paylaşabildiği çapraz platform (Mobil & Web) servis mimarisi geliştirildi.",
          "Google Books API entegrasyonu ile zenginleştirilmiş katalog sorgulama, kullanıcı doğrulama ve gerçek zamanlı etkileşim altyapısı tasarlandı.",
        ],
      },
      turksat: {
        year: "Eylül 2026 – Günümüz",
        title: "Türksat A.Ş. — Sistem ve Ağ Yönetimi Müdürlüğü",
        stack: "Active Directory (AD DS) · DNS/DHCP · GPO · PoLP/RBAC · Linux & Windows Server · PowerShell & Bash",
        points: [
          "Kurumsal etki alanı altyapısında Active Directory (AD DS), DNS, DHCP ve GPO mimarilerinin yönetimi, yedekliliği ve güvenliği süreçlerinde görev alma.",
          "En Az Yetki Prensibi (PoLP) çerçevesinde yetki devri (delegation of control), rol tabanlı erişim kontrolü (RBAC) ve sistem denetimi pratiklerinin yürütülmesi.",
          "Linux ve Windows tabanlı kurumsal sunucu ortamlarında otomasyon scriptleri (PowerShell, Bash) ve ağ izleme süreçlerine katkı sağlama.",
        ],
      },
      systems: {
        year: "Teknik Çalışmalar",
        title: "TCP/UDP Soket Mimarisi & Qt C++ Envanter Otomasyonu",
        stack: "Python · Soket Programlama · TCP/UDP · C++ · Qt Widgets · SQLite",
        points: [
          "Bağlantı yönelimli (TCP) ve bağlantısız (UDP) modellerin soket seviyesinde başarım farklarını inceleyen çok iş parçacıklı (multithreaded) haberleşme uygulaması geliştirildi.",
          "Qt & C++ ile ilişkisel veritabanı bağdaştırıcısıyla (SQLite) CRUD operasyonlarını, veri doğrulama ve dinamik raporlama süreçlerini yöneten masaüstü mimarisi tasarlandı.",
        ],
      },
    };

    function openModal(key) {
      const info = DETAILS[key];
      if (!info) return;
      if (yearEl) yearEl.textContent = info.year;
      if (titleEl) titleEl.textContent = info.title;
      if (stackEl) stackEl.textContent = info.stack;
      if (listEl) {
        listEl.innerHTML = "";
        info.points.forEach((p) => {
          const li = document.createElement("li");
          li.textContent = p;
          listEl.appendChild(li);
        });
      }
      modal.hidden = false;
    }

    function closeModal() {
      modal.hidden = true;
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const key = card.getAttribute("data-work-item");
        if (key) openModal(key);
      });
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const key = card.getAttribute("data-work-item");
          if (key) openModal(key);
        }
      });
    });

    closeBtns.forEach((btn) => btn.addEventListener("click", closeModal));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  initSmoothScroll();
  initCustomCursor();
  initWorksAndWavyCanvases();
  initProjectModal();
})();

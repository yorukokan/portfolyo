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
        const iw = externalImg.naturalWidth || W;
        const ih = externalImg.naturalHeight || INNER_H;
        const imgAspect = iw / Math.max(1, ih);

        if (imgAspect < 1.25) {
          // Dikey / Kare Mobil Ekran Kolajlarını (ör. ai-mood-recommendation.png)
          // Oranlarını Bozmadan Sol Mimari Panel + Sağda Mobil Ekranlar Olarak Çerçeveler
          const grad = ctx.createLinearGradient(0, 0, W, INNER_H);
          grad.addColorStop(0, "#191014");
          grad.addColorStop(0.5, "#0D111A");
          grad.addColorStop(1, "#131722");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, INNER_H);

          // Sol Üst Rozet
          ctx.fillStyle = "#261614";
          ctx.strokeStyle = "rgba(249, 115, 22, 0.55)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(24, 24, 210, 26, 13);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#FB923C";
          ctx.font = "600 9.5px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText("AI DUYGU & BESLENME ANALİZİ", 40, 41);

          // Sol Başlık
          ctx.fillStyle = "#F8FAFC";
          ctx.font = "700 24px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText("Ruh halini analiz et,", 24, 88);
          ctx.fillText("doğru öneriyi al.", 24, 118);

          ctx.fillStyle = "#94A3B8";
          ctx.font = "400 11px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText("FER-2013 CNN yüz analizi ve kullanıcı", 24, 150);
          ctx.fillText("emoji seçimini hibrit karar matrisinde", 24, 168);
          ctx.fillText("birleştiren Flutter & FastAPI mimarisi.", 24, 186);

          // Sol Alt 2 Modül Kartı (01, 02)
          const cards = [
            { num: "01", color: "#FB923C", title: "Hibrit Karar Matrisi", sub: "CNN yüz analizi + Emoji doğrulama" },
            { num: "02", color: "#38BDF8", title: "FastAPI & PostgreSQL", sub: "Stres ve duyguya özel besin/aktivite" },
          ];
          cards.forEach((c, idx) => {
            const cy = 212 + idx * 94;
            ctx.fillStyle = "rgba(22, 27, 39, 0.92)";
            ctx.strokeStyle = "rgba(51, 65, 85, 0.55)";
            ctx.beginPath();
            ctx.roundRect(24, cy, 326, 82, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = c.color;
            ctx.font = "700 18px 'Plus Jakarta Sans', sans-serif";
            ctx.fillText(c.num, 40, cy + 30);

            ctx.fillStyle = "#F8FAFC";
            ctx.font = "600 13px 'Plus Jakarta Sans', sans-serif";
            ctx.fillText(c.title, 76, cy + 29);

            ctx.fillStyle = "#94A3B8";
            ctx.font = "400 10.5px 'Plus Jakarta Sans', sans-serif";
            ctx.fillText(c.sub, 40, cy + 56);
          });

          // Sağ Tarafta Kullanıcının Yüklediği Mobil Ekran Görüntüsü (Sıfır Esneme / Gerçek Oran)
          const pad = 16;
          const availW = W - 374 - pad;
          const availH = INNER_H - pad * 2;
          const scale = Math.min(availW / iw, availH / ih);
          const drawW = iw * scale;
          const drawH = ih * scale;
          const drawX = 374 + (availW - drawW) * 0.5;
          const drawY = (INNER_H - drawH) * 0.5;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(drawX, drawY, drawW, drawH, 14);
          ctx.clip();
          ctx.drawImage(externalImg, drawX, drawY, drawW, drawH);
          ctx.restore();
          return off;
        }

        ctx.drawImage(externalImg, 0, 0, W, INNER_H);
        return off;
      }

      if (key === "ipo") {
        // IPO Finance Tracker — Next.js 16 + React 19 + TypeScript + Supabase + Vercel
        ctx.fillStyle = "#F4F4F2";
        ctx.fillRect(0, 0, W, INNER_H);

        const topCards = [
          { bg: "#141417", title: "PROFILES & ROLES", sub: "Admin / User Auth" },
          { bg: "#1E222B", title: "INVESTMENT ACCOUNTS", sub: "Çoklu Banka & Hesap" },
          { bg: "#E8EAE6", title: "OFFERINGS (IPO)", sub: "Halka Arz & Lot", darkText: true },
          { bg: "#222630", title: "CASH FLOW LEDGER", sub: "Nakit & Geri Ödeme" },
          { bg: "#141417", title: "PROFIT SHARING", sub: "Kullanıcı Payı Motoru" },
        ];
        const tw = (W - 36) / 5;
        topCards.forEach((c, idx) => {
          const x = 6 + idx * (tw + 6);
          ctx.fillStyle = c.bg;
          ctx.fillRect(x, 6, tw, 82);
          ctx.fillStyle = c.darkText ? "#18181B" : "#F2F4F3";
          ctx.font = "600 9px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(c.title, x + 10, 28);
          ctx.fillStyle = c.darkText ? "#52525B" : "#9CA3AF";
          ctx.font = "400 8.5px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(c.sub, x + 10, 46);
        });

        ctx.fillStyle = "#121215";
        ctx.fillRect(6, 94, 340, 224);
        ctx.fillStyle = "#3ECF8E";
        ctx.fillRect(18, 108, 118, 86);
        ctx.fillStyle = "#121215";
        ctx.font = "600 11px 'Space Grotesk', sans-serif";
        ctx.fillText("LIVE ON VERCEL", 30, 148);
        ctx.fillText("SUPABASE RLS", 30, 166);

        ctx.fillStyle = "#F2F4F3";
        ctx.font = "600 18px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("IPO FINANCE", 152, 146);
        ctx.fillText("TRACKER", 152, 170);
        ctx.font = "400 10px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#9CA3AF";
        ctx.fillText("Next.js 16.2 · React 19 · TypeScript 5", 18, 278);
        ctx.fillText("arz-finans-takip.vercel.app", 18, 296);

        ctx.fillStyle = "#F7F7F5";
        ctx.fillRect(352, 94, 402, 224);
        ctx.fillStyle = "#141417";
        ctx.font = "600 15px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("APP ROUTER ARCHITECTURE", 374, 198);
        ctx.strokeStyle = "rgba(20, 20, 23, 0.28)";
        ctx.font = "600 16px 'Space Grotesk', sans-serif";
        ctx.strokeText("MULTI-ACCOUNT CASH LEDGER", 374, 226);
        ctx.strokeText("LOT ALLOCATION & ROI TRACKING", 374, 250);
        ctx.strokeText("AUTOMATED PROFIT SPLIT (%20)", 374, 274);

        const bw = (W - 30) / 4;
        for (let i = 0; i < 4; i++) {
          const bx = 6 + i * (bw + 6);
          ctx.fillStyle = i % 2 === 0 ? "#1C1D22" : "#E5E7EB";
          ctx.fillRect(bx, 324, bw, 88);
          ctx.fillStyle = i % 2 === 0 ? "#F2F4F3" : "#141417";
          ctx.font = "500 10px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(
            ["/admin/overview", "/admin/offerings", "/admin/cash", "/my/portfolio"][i],
            bx + 14,
            356
          );
        }
      } else if (key === "emotion") {
        // AI Mood Analysis & Personalized Nutrition/Activity Recommender
        ctx.fillStyle = "#8F1D35";
        ctx.fillRect(0, 0, W, INNER_H);

        ctx.fillStyle = "#0B0B0F";
        ctx.fillRect(46, 34, W - 92, INNER_H - 68);

        ctx.strokeStyle = "rgba(242, 244, 243, 0.22)";
        ctx.strokeRect(W / 2 - 96, INNER_H / 2 - 72, 192, 144);
        ctx.fillStyle = "#1E222D";
        ctx.fillRect(W / 2 - 64, INNER_H / 2 - 44, 128, 88);

        ctx.fillStyle = "#F2F4F3";
        ctx.font = "500 12px 'Space Grotesk', sans-serif";
        ctx.fillText("FER-2013 CNN + EMOJI HYBRID MATRIX", 76, 68);
        ctx.fillStyle = "#94949E";
        ctx.fillText("FLUTTER · FASTAPI · PYTORCH · POSTGRESQL", 76, 90);

        ctx.fillStyle = "#F2F4F3";
        ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("FACE + EMOJI", W / 2 - 44, INNER_H / 2 - 4);
        ctx.fillStyle = "#3ECF8E";
        ctx.font = "400 10px 'Space Grotesk', sans-serif";
        ctx.fillText("INFERENCE READY", W / 2 - 46, INNER_H / 2 + 16);

        ctx.fillStyle = "#94949E";
        ctx.font = "400 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(
          "Kişiselleştirilmiş Besin, İçecek ve Aktivite Karar Motoru",
          76,
          INNER_H - 54
        );
      } else if (key === "bookan") {
        // Bookan — Flutter + Firebase + Google Books API & PHP/MySQL Web
        ctx.fillStyle = "#3A2A22";
        ctx.fillRect(0, 0, W, INNER_H);

        ctx.fillStyle = "#F4F1EA";
        ctx.fillRect(38, 32, W - 76, INNER_H - 64);

        ctx.fillStyle = "#223330";
        ctx.fillRect(38, 78, 340, INNER_H - 110);
        ctx.fillStyle = "#D4A373";
        ctx.beginPath();
        ctx.arc(128, 168, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#F4F1EA";
        ctx.font = "500 15px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Bookan Mobile & Web", 68, 244);
        ctx.font = "400 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#A7B8B4";
        ctx.fillText("Flutter · Cloud Firestore · Google Books API", 68, 268);
        ctx.fillText("Native PHP 8 (PDO) · MySQL · Quote Feed", 68, 288);

        ctx.fillStyle = "#1E1D22";
        ctx.font = "600 13px 'Space Grotesk', sans-serif";
        ctx.fillText("BOOKAN SOCIAL ECOSYSTEM", 310, 60);

        ctx.fillStyle = "#5D768B";
        ctx.fillRect(420, 104, 264, 210);
        ctx.fillStyle = "#F4F1EA";
        ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Kişisel Kütüphane & Alıntı Ağı", 444, 188);
        ctx.font = "400 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#E2E8F0";
        ctx.fillText("ISBN Katalog · Okuma Durumu · Yorum", 444, 214);
      } else if (key === "library") {
        // Library Management System (Qt & C++ & SQLite)
        ctx.fillStyle = "#17181E";
        ctx.fillRect(0, 0, W, INNER_H);

        ctx.fillStyle = "#21242D";
        ctx.fillRect(28, 28, W - 56, INNER_H - 56);

        ctx.fillStyle = "#41CD52";
        ctx.fillRect(52, 52, 96, 26);
        ctx.fillStyle = "#0F1115";
        ctx.font = "600 11px 'Space Grotesk', sans-serif";
        ctx.fillText("Qt & C++ OOP", 64, 69);

        ctx.fillStyle = "#F2F4F3";
        ctx.font = "600 19px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Library Management System (SQLite)", 52, 114);
        ctx.fillStyle = "#94949E";
        ctx.font = "400 12px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(
          "QSqlQueryModel Canlı Tablo Senkronizasyonu · Ödünç / Teslim & 15 Gün Gecikme Cezası Motoru",
          52,
          138
        );

        const modules = [
          { file: "mainwindow.cpp", desc: "Merkezi Navigasyon & Modül Yöneticisi" },
          { file: "islemleruye.cpp", desc: "Üye CRUD & Aktif Ödünç Silme Koruması" },
          { file: "islemlerkitap.cpp", desc: "Envanter & Stok Senkronizasyonu" },
          { file: "islemleroduncteslim.cpp", desc: "15 Gün Limit & Otomatik Borç Hesabı" },
        ];
        modules.forEach((m, i) => {
          const y = 168 + i * 48;
          ctx.fillStyle = i % 2 === 0 ? "#181A22" : "#262A36";
          ctx.fillRect(52, y, W - 104, 40);
          ctx.fillStyle = "#41CD52";
          ctx.font = "500 11px 'Space Grotesk', sans-serif";
          ctx.fillText(m.file, 68, y + 25);
          ctx.fillStyle = "#F2F4F3";
          ctx.font = "400 11.5px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(m.desc, 250, y + 25);
        });
      } else {
        // Türksat A.Ş. — Sistem ve Ağ Yönetimi
        ctx.fillStyle = "#6F442A";
        ctx.fillRect(0, 0, W, INNER_H);

        ctx.fillStyle = "#1E423A";
        ctx.fillRect(28, 28, 420, INNER_H - 56);

        ctx.fillStyle = "#E6C4B0";
        ctx.fillRect(448, 28, W - 476, INNER_H - 56);

        ctx.fillStyle = "#F2F4F3";
        ctx.font = "600 21px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("TÜRKSAT A.Ş.", 58, 92);
        ctx.font = "400 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#A9C9C0";
        ctx.fillText("Sistem ve Ağ Yönetimi Müdürlüğü", 58, 118);
        ctx.fillText("Active Directory (AD DS) · DNS · DHCP · GPO", 58, 170);
        ctx.fillText("En Az Yetki Prensibi (PoLP) & RBAC Denetimi", 58, 196);
        ctx.fillText("Linux & Windows Server Otomasyonu (PowerShell / Bash)", 58, 222);

        ctx.fillStyle = "#1E1D22";
        ctx.font = "600 13px 'Space Grotesk', sans-serif";
        ctx.fillText("INFRASTRUCTURE", 476, 92);
        ctx.font = "400 11.5px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("· Domain Controller", 476, 128);
        ctx.fillText("· Group Policy Objects", 476, 152);
        ctx.fillText("· Delegation of Control", 476, 176);
        ctx.fillText("· Wireshark & TCP/IP", 476, 200);
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

      const stripW = 8;
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
     4. Proje "Detay" Çekmecesi (GitHub & Canlı Demo Bağlantılarıyla)
     ------------------------------------------------------------------------ */
  function initProjectModal() {
    const modal = document.querySelector("[data-project-modal]");
    const yearEl = document.querySelector("[data-modal-year]");
    const titleEl = document.querySelector("[data-modal-title]");
    const stackEl = document.querySelector("[data-modal-stack]");
    const listEl = document.querySelector("[data-modal-list]");
    const linksEl = document.querySelector("[data-modal-links]");
    const closeBtns = document.querySelectorAll("[data-modal-close]");
    const detailBtns = document.querySelectorAll("[data-open-detail]");

    if (!(modal instanceof HTMLElement)) return;

    const DETAILS = {
      ipo: {
        year: "2026",
        title: "IPO Finance Tracker — Halka Arz & Portföy Takip Sistemi",
        stack: "Next.js 16.2 · React 19.2 · TypeScript 5 · Tailwind CSS 4 · Supabase (PostgreSQL & Auth) · Vercel",
        points: [
          "Kullanıcı ve Yönetici (Admin) panellerine sahip full-stack mimari: profiles, investment_accounts, offerings ve investments ilişkisel PostgreSQL şemalarıyla çoklu yatırım hesabı takibi.",
          "Halka arz başvuru, tahsis edilen lot, alış/satış maliyeti, nakit akışı (para giriş/çıkış, geri ödeme) ve kullanıcı bazlı kâr paylaşım oranlarını (%20 vb.) otomatik hesaplayan finans motoru.",
          "Supabase Authentication ve Row Level Security (RLS) ile rol bazlı erişim kontrolü; Vercel üzerinde canlı prodüksiyon yayını.",
        ],
        links: [
          { label: "GitHub Repository ↗", url: "https://github.com/yorukokan/ipo-finance-tracker" },
          { label: "Canlı Uygulama (Vercel) ↗", url: "https://arz-finans-takip.vercel.app/" },
        ],
      },
      emotion: {
        year: "Şubat – Haziran 2026",
        title: "AI Mood Analysis & Kişiselleştirilmiş Beslenme/Aktivite Önerisi",
        stack: "Flutter · FastAPI · Python · PyTorch (CNN / FER-2013) · OpenCV · PostgreSQL · Firebase Auth",
        points: [
          "FER-2013 veri setiyle eğitilen CNN görüntü işleme modeli ve kullanıcı emoji seçimini birleştiren Hibrit Duygu Karar Mekanizması.",
          "Kamera üzerinden alınan yüz ifadesini FastAPI backend'inde analiz ederek PostgreSQL'den anlık ruh haline uygun besin, içecek ve aktivite önerileri döndüren uçtan uca mobil ekosistem.",
          "Firebase Authentication ile güvenli kullanıcı oturumu ve Flutter ile çapraz platform mobil arayüz.",
        ],
        links: [
          {
            label: "GitHub Repository ↗",
            url: "https://github.com/yorukokan/ai-powered-mood-analysis-personalized-nutrition-activity-recommendation",
          },
        ],
      },
      bookan: {
        year: "2025",
        title: "Bookan — Sosyal Kitap Keşif ve Alıntı Ekosistemi (Mobil & Web)",
        stack: "Flutter · Dart · Cloud Firestore · Firebase Auth · Google Books API · Native PHP 8 (PDO) · MySQL",
        points: [
          "Mobil (Flutter + Cloud Firestore) ve Web (PHP 8 PDO + MySQL) olarak iki ayrı platformda geliştirilen sosyal okuma ve kişisel kütüphane ekosistemi.",
          "Google Books API entegrasyonu ile milyonlarca kitabın ISBN, yazar, yayınevi ve kapak verilerine anında erişim; okuma durumu (Okunacak, Okunuyor, Okundu) takibi.",
          "Kitap ve sayfa numarası referanslı alıntı paylaşım akışı, gerçek zamanlı beğeni/yorum etkileşimi ve bcrypt/PDO tabanlı güvenlik katmanı.",
        ],
        links: [
          { label: "Bookan Mobile Repo (Flutter) ↗", url: "https://github.com/yorukokan/bookan-mobile-app" },
          { label: "Bookan Web Repo (PHP & MySQL) ↗", url: "https://github.com/yorukokan/bookan-web-app" },
        ],
      },
      library: {
        year: "2025",
        title: "Library Management System — Masaüstü Otomasyon Mimarisi",
        stack: "C++ · Qt Widgets · QSqlQueryModel · SQLite · Nesne Yönelimli Programlama (OOP)",
        points: [
          "Üye kayıtlarını (islemleruye.cpp), kitap envanterini (islemlerkitap.cpp) ve ödünç/iade iş akışlarını (islemleroduncalma.cpp / islemleroduncteslim.cpp) yöneten modüler C++ & Qt mimarisi.",
          "QSqlQueryModel ile SQLite veritabanı değişikliklerinin arayüz tablolarına gerçek zamanlı senkronizasyonu ve otomatik stok takibi.",
          "İlişkisel bütünlük koruması (ödünçteki kitabın veya iade etmemiş üyenin silinmesini engelleme) ve 15 günü aşan iadeler için otomatik gecikme cezası hesaplama algoritması.",
        ],
        links: [
          { label: "GitHub Repository ↗", url: "https://github.com/yorukokan/library-management-system-Qt" },
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
        links: [
          { label: "GitHub Profili ↗", url: "https://github.com/yorukokan" },
          { label: "LinkedIn Profili ↗", url: "https://linkedin.com/in/okanyoruk" },
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
      if (linksEl) {
        linksEl.innerHTML = "";
        (info.links || []).forEach((lnk) => {
          const a = document.createElement("a");
          a.className = "project-modal__btn";
          a.href = lnk.url;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = lnk.label;
          linksEl.appendChild(a);
        });
      }
      modal.hidden = false;
    }

    function closeModal() {
      modal.hidden = true;
    }

    detailBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const key = btn.getAttribute("data-open-detail");
        if (key) openModal(key);
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

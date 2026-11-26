<div align="center">

<!-- HERO BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0B0F19,45:0EA5E9,80:6366F1,100:10B981&height=210&section=header&text=Okan%20Y%C3%B6r%C3%BCk%20%C2%B7%203D%20Portfolio&fontSize=42&fontColor=F8FAFC&fontAlignY=38&desc=Zero-Dependency%20WebGL%201.0%20%E2%80%A2%2022K%20Particles%20%E2%80%A2%208-Stage%20Scroll%20Morphing&descSize=16&descAlignY=62&animation=fadeIn" width="100%" alt="Okan Yörük Interactive 3D Particle Portfolio Banner" />

<!-- TYPING ANIMATION -->
<a href="https://yorukokan.github.io/portfolyo/">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=18&duration=2600&pause=900&color=38BDF8&center=true&vCenter=true&width=780&lines=Pure+WebGL+1.0+%2B+GLSL+Shaders+%C2%B7+22%2C000+Real-Time+Particles;8-Stage+Scroll+Metamorphosis+at+60-120+FPS+(%3C0.4ms+CPU);S%C4%B1f%C4%B1r+3B+Motor+Ba%C4%9F%C4%B1ml%C4%B1l%C4%B1%C4%9F%C4%B1+%C2%B7+Canvas+2D+Fallback+Destekli;Wavy+Project+Canvases+%C2%B7+Lenis+Smooth+Scroll+%C2%B7+Custom+Cursor" alt="Typing Animation" />
</a>

<br/>

<!-- QUICK ACTION PILLS -->
<p>
  <a href="https://yorukokan.github.io/portfolyo/">
    <img src="https://img.shields.io/badge/Live_Demo-yorukokan.github.io%2Fportfolyo-10B981?style=for-the-badge&logo=githubpages&logoColor=white&labelColor=0B0F19" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Engine-WebGL_1.0_%C2%B7_GLSL_%C2%B7_Vanilla_JS-0EA5E9?style=for-the-badge&logo=webgl&logoColor=white&labelColor=0B0F19" alt="WebGL 1.0 Engine" />
  <a href="https://github.com/yorukokan">
    <img src="https://img.shields.io/badge/GitHub-yorukokan-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=0B0F19" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/okanyoruk">
    <img src="https://img.shields.io/badge/LinkedIn-Okan_Y%C3%B6r%C3%BCk-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=0B0F19" alt="LinkedIn" />
  </a>
  <a href="mailto:okanyoruk.tr@gmail.com">
    <img src="https://img.shields.io/badge/Email-okanyoruk.tr%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white&labelColor=0B0F19" alt="Email" />
  </a>
</p>

</div>

---

## 🎯 Overview · Proje Özeti

<table>
<tr>
<td width="50%" valign="top">

<h3>🇬🇧 English</h3>

An interactive, scroll-driven **3D particle portfolio** built with **zero external 3D engine dependencies** (no Three.js or PixiJS). Powered by a custom **WebGL 1.0 + GLSL shader pipeline** with an automatic **Canvas 2D fallback**, it morphs **22,000 point particles** seamlessly across **8 narrative stages** at **60–120 FPS**.

Designed to showcase enterprise systems engineering, full-stack architecture, computer vision, and cross-platform software work, the experience pairs a precomputed sine lookup table (`SIN_LUT`) for sub-`0.4ms` frame updates with velocity-reactive wavy project canvases, Lenis smooth scrolling, and an accessible project inspection modal.

</td>
<td width="50%" valign="top">

<h3>🇹🇷 Türkçe</h3>

Hiçbir harici 3B motor bağımlılığı olmadan (Three.js veya PixiJS kullanmadan) geliştirilmiş, kaydırma (scroll) güdümlü etkileşimli bir **3B partikül portfolyosudur**. Saf **WebGL 1.0 + GLSL Shader** hattı ve otomatik **Canvas 2D Fallback** desteğiyle **22.000 noktasal partikülü** **8 anlatı sahnesi** boyunca **60–120 FPS** hızında gerçek zamanlı morfing ile dönüştürür.

Kurumsal sistem/ağ mühendisliği, full-stack mimari, yapay görme ve çapraz platform projelerini sergilemek üzere tasarlanan deneyim; kare başına `< 0.4ms` CPU yükü sağlayan `SIN_LUT` tablosu, kaydırma hızına duyarlı dalgalı proje kanvasları, Lenis yumuşak kaydırma ve erişilebilir proje detay çekmecesi sunar.

</td>
</tr>
</table>

---

## ✨ Key Features · Öne Çıkan Özellikler

<table>
<tr>
<td width="50%" valign="top">

<h4>🌌 8-Stage WebGL Particle Engine · 8 Evreli Partikül Motoru</h4>

<b>EN:</b> Unpacks 22,000 Base64-encoded 5-byte particles (<code>x</code>, <code>y</code>, <code>alpha</code>) and interpolates them smoothly across 8 calibrated scenes with zero particle-text collisions, localized cursor ripples, and automatic Canvas 2D fallback.<br/>
<b>TR:</b> Base64 ile paketlenmiş 22.000 partikülü (5 bayt/nokta) açarak metinlerle çakışmayacak şekilde kalibre edilmiş 8 sahne arasında yumuşak morfing, yerel imleç dalgalanması ve otomatik Canvas 2D geri dönüşüyle çizer.<br/><br/>
<code>particles3d.js</code> · <code>portrait-data.js</code>

</td>
<td width="50%" valign="top">

<h4>⚡ Zero-Trig LUT Optimization · Sıfır Trigonometri Darboğazı</h4>

<b>EN:</b> Eliminates <code>Math.sin</code> and <code>Math.cos</code> inside the 22K-particle loop by using a precomputed 256-entry <code>Float32Array</code> sine lookup table (<code>SIN_LUT</code>) and pre-cached transition buffers (<code>coilShape</code>, <code>fig8Shape</code>), keeping CPU time under <code>0.4ms</code> per frame.<br/>
<b>TR:</b> Animasyon döngüsü içinde <code>Math.sin</code> / <code>Math.cos</code> çağrıları yerine 256 elemanlı <code>Float32Array</code> Sinüs Arama Tablosu (<code>SIN_LUT</code>) ve önceden hesaplanmış geçiş tamponları kullanarak CPU yükünü kare başına <code>&lt; 0.4ms</code> seviyesinde tutar.<br/><br/>
<code>particles3d.js</code>

</td>
</tr>
<tr>
<td width="50%" valign="top">

<h4>🌊 Velocity-Reactive Wavy Canvases · Dalgalı Proje Kanvasları</h4>

<b>EN:</b> Renders horizontal project cards via 8px sinusoidal strips reacting to <code>scrollVelocity</code> and pointer hover amplitude, with procedural offscreen canvas fallbacks and <code>IntersectionObserver</code> gating to zero out off-screen GPU/CPU usage.<br/>
<b>TR:</b> Yatay proje kartlarını <code>scrollVelocity</code> ve imleç hover genliğine duyarlı 8px sinüzoidal şeritlerle çizer; harici görsel yoksa prosedürel kanvas fallback üretir ve <code>IntersectionObserver</code> ile yalnızca görünür alanda çalışır.<br/><br/>
<code>script.js</code> · <code>index.html</code>

</td>
<td width="50%" valign="top">

<h4>🎯 Smooth Choreography &amp; Modal · Kaydırma Koreografisi ve Detay Çekmecesi</h4>

<b>EN:</b> Integrates Lenis smooth scrolling (with <code>prefers-reduced-motion</code> respect), a desktop-only glowing custom cursor transitioning into a 48px ring on interactive targets, and a keyboard-accessible (<code>Esc</code>) architectural detail drawer.<br/>
<b>TR:</b> <code>prefers-reduced-motion</code> uyumlu Lenis yumuşak kaydırma, etkileşimli öğelerde 48px çembere dönüşen masaüstü özel imleç ve <code>Esc</code> ile kapanan erişilebilir mimari proje inceleme çekmecesi içerir.<br/><br/>
<code>script.js</code> · <code>style.css</code> · <code>index.html</code>

</td>
</tr>
</table>

---

## 🌀 8-Stage Particle Metamorphosis · 8 Evreli Partikül Metamofozu

| Stage · Sahne | Shape Source · Veri | EN Description | TR Açıklama |
| :--- | :--- | :--- | :--- |
| **Stage 0** (`scene--hero`) | `pack.bust` | Centered 22,000-point depth/luminance portrait silhouette between left name and right title. | Gerçek portre fotoğrafından çıkarılmış, solda isim ve sağda unvan arasına oturan 22.000 noktalı merkez portre silüeti. |
| **Stage 1** (`scene--intro`) | `pack.bust` | Portrait shifts cleanly to the right half (`xShift = 0.88`) revealing the intro statement on the left. | Portre silüeti sağ yarıya kayar (`xShift = 0.88`) ve sol boşlukta tanıtım metni belirir. |
| **Stage 2** (`scene--globe`) | `pack.sphere` | Morphs via a Horizontal Slice Wave (`sliceSwirlX` / `sliceCompressY`) into a 3D sphere encircled by rotating SVG `<textPath>` orbit text. | Yatay dilimleme dalgasıyla 3B küreye dönüşür; dış çeperde 44 saniyelik döngüyle dönen SVG yörünge metni eşlik eder. |
| **Stage 3** (`scene--map`) | `pack.map` | Transforms from the sphere into a high-resolution topographic silhouette of Türkiye with an upper-right location pin (`Ankara & Konya`). | Küreden yüksek çözünürlüklü Türkiye topografik haritası partikül silüetine dönüşür ve üst sağda konum pini belirir. |
| **Stage 4 &amp; 5** (`scene--philosophy`, `scene--works`) | `pack.ribbon` | Forms a diagonal twisted DNA / wave particle ribbon behind the engineering philosophy and sticky horizontal project showcase. | Felsefe metni ve yatay kaydırılan proje vitrini (`#selected-works`) arkasında diyagonal çift sarmallı DNA / dalga şeridi oluşturur. |
| **Stage 6** (`scene--more`) | `coilShape` → `pack.vortex` | Passes through a Helical Spring Coil transition into a continuously rotating Spiral Galaxy Vortex shifted right (`xShift = 0.34`). | Helisel yay ara geçişiyle sağa hizalı (`xShift = 0.34`) ve kendi ekseninde sürekli dönen galaksi girdabına dönüşür. |
| **Stage 7** (`scene--contact`) | `fig8Shape` → `pack.rect` | Flows through a Figure-8 infinity cloud into a wide sparkling rectangle frame (`scaleX = 1.38`) framing the contact email and CV links. | Sonsuzluk (Figure-8) bulutu üzerinden iletişim e-postası ve CV bağlantılarını saran geniş ışıltılı çerçeveye dönüşür. |

---

## 🏗️ Architecture · Mimari

```text
index.html (Semantic 8-Scene Scroll Layout · SVG Orbit · Project Modal)
  ├── style.css
  │     └── Fixed .webgl-stage · Custom Cursor · Sticky Horizontal Track · Responsive Breakpoints
  ├── portrait-data.js
  │     └── window.PARTICLE_SHAPES_B64 (22,000 pts · Base64 5-byte/pt: bust, sphere, map, ribbon, vortex, rect)
  ├── particles3d.js
  │     ├── unpackBase64Shape() ──▶ Float32Array[8] Stages + Precomputed coilShape / fig8Shape / SIN_LUT[256]
  │     ├── Scroll Timeline     ──▶ Smooth Stage Interpolation (smoothstep + midBell transitions)
  │     ├── Pointer Ripple      ──▶ Localized cursor repulsion in NDC world space
  │     └── Render Pipeline     ──▶ WebGL 1.0 (aPosition, aAlpha, GLSL) ──[fallback]──▶ Canvas 2D Context
  ├── Lenis 1.1.14 (CDN)
  │     └── Smooth wheel interpolation + live scrollVelocity feed
  └── script.js
        ├── initSmoothScroll()          ──▶ Lenis RAF loop + native scroll fallback
        ├── initCustomCursor()          ──▶ Glowing dot + 48px hover ring (fine pointers only)
        ├── initWorksAndWavyCanvases()  ──▶ IntersectionObserver + 8px sinusoidal strip deformation + horizontal track
        └── initProjectModal()          ──▶ Architectural detail drawer (DETAILS map + Esc/backdrop close)
```

---

## 💼 Featured Projects &amp; Experience · Seçili Projeler ve Sistem Deneyimi

| Project / Experience · Proje / Deneyim | Summary · Özet | Tech Stack · Teknoloji Yığını | Links · Bağlantılar |
| :--- | :--- | :--- | :--- |
| **IPO Finance Tracker** (`2026`) | Full-stack IPO lot allocation, multi-account cash ledger &amp; automated profit-sharing tracker with role-based RLS. · Rol bazlı RLS ile çoklu hesap nakit akışı ve halka arz kâr paylaşım takip sistemi. | `Next.js 16.2` · `React 19` · `TypeScript 5` · `Tailwind CSS 4` · `Supabase (PostgreSQL & RLS)` · `Vercel` | [Live Demo](https://arz-finans-takip.vercel.app/) · [GitHub](https://github.com/yorukokan/ipo-finance-tracker) |
| **AI Mood &amp; Nutrition Recommender** (`2026`) | Hybrid facial emotion (FER-2013 CNN) + emoji decision matrix delivering personalized food &amp; activity recommendations. · FER-2013 CNN yüz analizi ve emoji doğrulamalı kişiselleştirilmiş beslenme/aktivite öneri sistemi. | `Flutter` · `FastAPI` · `PyTorch CNN (FER-2013)` · `OpenCV` · `PostgreSQL` · `Firebase Auth` | [GitHub](https://github.com/yorukokan/ai-powered-mood-analysis-personalized-nutrition-activity-recommendation) |
| **Bookan — Social Book Ecosystem** (`2025`) | Cross-platform social reading, ISBN catalog &amp; page-referenced quote feed built for both Mobile and Web. · Mobil ve Web için geliştirilmiş sosyal okuma, ISBN katalog ve alıntı paylaşım ekosistemi. | `Flutter & Dart` · `Cloud Firestore` · `Google Books API` · `Native PHP 8 (PDO)` · `MySQL` | [Mobile Repo](https://github.com/yorukokan/bookan-mobile-app) · [Web Repo](https://github.com/yorukokan/bookan-web-app) |
| **Library Management System** (`2025`) | Modular OOP desktop automation with real-time `QSqlQueryModel` sync, referential integrity guards &amp; 15-day late fee engine. · Canlı SQLite senkronizasyonu ve 15 gün gecikme cezası motoruna sahip masaüstü otomasyonu. | `C++` · `Qt Widgets` · `QSqlQueryModel` · `SQLite` · `OOP` | [GitHub](https://github.com/yorukokan/library-management-system-Qt) |
| **Türksat A.Ş. — Systems &amp; Network** (`2026`) | Enterprise domain infrastructure, AD DS / DNS / DHCP / GPO administration, PoLP &amp; RBAC auditing, and server automation. · Kurumsal etki alanı yönetimi, AD DS / GPO / DNS / DHCP, PoLP/RBAC denetimi ve sunucu otomasyonu. | `Active Directory (AD DS)` · `DNS / DHCP / GPO` · `PoLP & RBAC` · `Linux & Windows Server` · `PowerShell / Bash` | [GitHub Profile](https://github.com/yorukokan/yorukokan) · [LinkedIn](https://linkedin.com/in/okanyoruk) |

---

## 🛠️ Tech Stack · Teknoloji Yığını

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white&labelColor=0D1117)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white&labelColor=0D1117)
![JavaScript](https://img.shields.io/badge/Vanilla_JS_(ES6+)-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black&labelColor=0D1117)
![WebGL](https://img.shields.io/badge/WebGL_1.0-990000?style=for-the-badge&logo=webgl&logoColor=white&labelColor=0D1117)
![GLSL](https://img.shields.io/badge/GLSL_Shaders-5586A4?style=for-the-badge&logo=opengl&logoColor=white&labelColor=0D1117)
![Canvas 2D](https://img.shields.io/badge/Canvas_2D_Fallback-0EA5E9?style=for-the-badge&logo=html5&logoColor=white&labelColor=0D1117)
![SVG](https://img.shields.io/badge/SVG_Orbit_Text-FFB13B?style=for-the-badge&logo=svg&logoColor=black&labelColor=0D1117)
![Lenis](https://img.shields.io/badge/Lenis_1.1.14-FF98A2?style=for-the-badge&logoColor=black&labelColor=0D1117)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white&labelColor=0D1117)

</div>

---

## 📂 Project Structure · Proje Yapısı

```text
portfolyo/
├── index.html                           # 8-stage semantic layout, SVG orbit ring & project detail modal
├── style.css                            # Dark theme tokens, fixed WebGL stage, custom cursor & responsive grid
├── particles3d.js                       # Zero-dependency WebGL 1.0 + GLSL 8-stage particle engine & 2D fallback
├── portrait-data.js                     # Base64-packed 22,000-point geometry buffers (6 target shapes)
├── script.js                            # Lenis smooth scroll, wavy canvases, IntersectionObserver & modal logic
├── assets/
│   ├── okan-yoruk.jpg                   # Portrait reference asset
│   ├── Okan-Yoruk-CV.pdf                # Downloadable full resume (PDF)
│   └── projects/
│       ├── ipo-finance-tracker.png      # IPO Finance Tracker showcase visual
│       ├── ai-mood-recommendation.png   # AI Mood & Nutrition Recommender mobile showcase
│       ├── bookan-platform.svg          # Bookan ecosystem vector visual
│       ├── library-management-qt.svg    # Qt & C++ Library Management visual
│       └── turksat-sistem-ag.svg        # Türksat Systems & Network Administration visual
├── Agents.md                            # Project engineering guidelines
├── .gitignore                           # Ignored local reference assets
└── README.md                            # Project documentation (EN · TR)
```

---

## 🚀 Getting Started · Kurulum ve Çalıştırma

Zero build step or package installation required — serve the static files with any local HTTP server:
Herhangi bir derleme (build) veya paket kurulumu gerektirmez — doğrudan yerel bir HTTP sunucusuyla çalıştırabilirsiniz:

```bash
# 1. Clone the repository · Repoyu klonlayın
git clone https://github.com/yorukokan/portfolyo.git
cd portfolyo

# 2. Start a local static server · Yerel HTTP sunucusunu başlatın
python3 -m http.server 8080
```

Then open **`http://localhost:8080`** in your browser — or visit the live deployment at **[yorukokan.github.io/portfolyo](https://yorukokan.github.io/portfolyo/)**.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0B0F19,45:0EA5E9,80:6366F1,100:10B981&height=100&section=footer" width="100%" alt="Footer Wave" />

<sub>⚡ <b>Okan Yörük</b> · Interactive 3D Particle Portfolio · <a href="https://yorukokan.github.io/portfolyo/">Live Demo</a> · <a href="https://github.com/yorukokan">github.com/yorukokan</a></sub>

</div>

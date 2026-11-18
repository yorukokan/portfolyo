<div align="center">

# Okan Yörük — Interactive 3D Particle Portfolio

**Software & Systems Engineer · Türksat A.Ş. Sistem ve Ağ Yönetimi**

[![GitHub](https://img.shields.io/badge/GitHub-yorukokan-181717?style=for-the-badge&logo=github)](https://github.com/yorukokan)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Okan_Yörük-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/okanyoruk)
[![Email](https://img.shields.io/badge/E--Posta-okanyoruk.tr%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:okanyoruk.tr@gmail.com)

</div>

---

## 📌 Mimari Genel Bakış

Bu portfolyo; sıfır harici 3B motor bağımlılığıyla (**Saf WebGL 1.0 + GLSL Shader + Canvas 2D Fallback**) 22.000 noktasal partikülü kaydırma (scroll) konumuna göre gerçek zamanlı morfing ile dönüştüren yüksek performanslı (60–120 FPS) bir web deneyimidir.

### ✨ Temel Mühendislik Özellikleri

- **8 Evreli WebGL Partikül Metamofoz Motoru (`particles3d.js` & `portrait-data.js`)**:
  - **Sahne 0 & 1**: Gerçek portre fotoğrafından çıkarılmış 22.000 noktalı derinlik/parlaklık silüeti.
  - **Sahne 2**: Yatay dilimleme dalgasıyla (Horizontal Slice Wave) 3B Küreye dönüşüm ve dış çeperde dönen SVG yörünge metni.
  - **Sahne 3**: Küreden yüksek çözünürlüklü Türkiye topografik haritası partikül silüetine dönüşüm.
  - **Sahne 4 & 5**: Diyagonal çift sarmallı (DNA / Dalga) partikül şeridi.
  - **Sahne 6**: Helisel yay geçişiyle dönen galaksi girdabına (Spiral Vortex) dönüşüm.
  - **Sahne 7**: Sonsuzluk (Figure-8) bulutu üzerinden ışıltılı iletişim çerçevesine dönüşüm.
- **Sıfır Trigonometri Darboğazı**: Animasyon döngüsü içinde `Math.sin` / `Math.cos` çağrıları yerine önceden hesaplanmış 256 elemanlı `Float32Array` Sinüs Arama Tablosu (`SIN_LUT`) ve ara geçiş tabloları kullanılarak CPU yükü kare başına `< 0.4ms` seviyesinde tutulmuştur.
- **Dalgalı (Wavy) Proje Vitrin Kanvasları (`script.js`)**:
  - Yatay kaydırma hızına (`scrollVelocity`) ve imleç etkileşimine duyarlı sinüzoidal şerit deformasyonu.
  - Yalnızca `#selected-works` görünür alanda (`IntersectionObserver`) iken çizim yaparak arka plan kaynak tüketimini sıfırlar.

---

## 📂 Seçili Projeler & Sistem Deneyimi

| Proje / Deneyim | Teknoloji Yığını | Bağlantılar |
| :--- | :--- | :--- |
| **IPO Finance Tracker** | `Next.js 16.2`, `React 19`, `TypeScript 5`, `Tailwind CSS 4`, `Supabase (PostgreSQL & RLS)`, `Vercel` | [Canlı Demo](https://arz-finans-takip.vercel.app/) · [GitHub](https://github.com/yorukokan/ipo-finance-tracker) |
| **AI Mood & Nutrition Recommender** | `Flutter`, `FastAPI`, `PyTorch CNN (FER-2013)`, `OpenCV`, `PostgreSQL`, `Firebase Auth` | [GitHub](https://github.com/yorukokan/ai-powered-mood-analysis-personalized-nutrition-activity-recommendation) |
| **Bookan — Sosyal Kitap Ekosistemi** | `Flutter & Dart`, `Cloud Firestore`, `Google Books API`, `Native PHP 8 (PDO)`, `MySQL` | [Mobil Repo](https://github.com/yorukokan/bookan-mobile-app) · [Web Repo](https://github.com/yorukokan/bookan-web-app) |
| **Library Management System** | `C++`, `Qt Widgets`, `QSqlQueryModel`, `SQLite`, `OOP` | [GitHub](https://github.com/yorukokan/library-management-system-Qt) |
| **Türksat A.Ş. — Sistem & Ağ Yönetimi** | `Active Directory (AD DS)`, `DNS / DHCP / GPO`, `PoLP & RBAC`, `Linux & Windows Server` | [Profil](https://github.com/yorukokan/yorukokan) |

---

## 🚀 Yerel Çalıştırma

Herhangi bir derleme (build) adımına ihtiyaç duymaz. Doğrudan bir yerel HTTP sunucusu ile çalıştırabilirsiniz:

```bash
git clone https://github.com/yorukokan/portfolyo.git
cd portfolyo
python3 -m http.server 8080
```

Tarayıcıda `http://localhost:8080` adresini açarak inceleyebilirsiniz.

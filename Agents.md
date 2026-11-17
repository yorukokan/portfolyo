# Tasarım Rehberi
## Konsept
Karanlık, sinematik, "yazılımcının uzayı". Az metin, büyük tipografi, bol boşluk, akıcı hareket.

## Teknik
- Build aracı yok: saf HTML/CSS/JS. Kütüphaneler jsDelivr CDN'den.
- Three.js (3D), GSAP + ScrollTrigger (animasyon), Lenis (yumuşak kaydırma).

## Renkler
--bg: #0a0a0f; --surface: #14141c; --text: #f2f2f2; --muted: #8a8a99;
--accent: #7c5cff; --accent-2: #00e5ff

## Tipografi
Başlıklar: "Space Grotesk", çok büyük: clamp(3rem, 10vw, 9rem), satır aralığı 0.9.
Gövde: "Inter", 18px. (Google Fonts)

## Hareket
- Easing: power3.out / expo.out, süreler 0.8–1.2 sn.
- Bölümler kaydırınca girer: opacity 0→1, y: 60→0.
- Başlıklar kelime kelime, maskenin altından yukarı açılır.
- prefers-reduced-motion açıksa animasyonları kapat.

## Kurallar
- Sadece istenen bölüm ve dosyaya dokun.
- 60 fps hedefle; mobilde 3D sahneyi sadeleştir.
- Konsolda hata bırakma.

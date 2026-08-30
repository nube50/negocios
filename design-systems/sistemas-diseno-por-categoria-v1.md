# Sistemas de Diseño — Landing Pages Premium por Categoría (v1.0)

> Documento de referencia y fuente de verdad de diseño para generación de Landing Pages por categoría.

---

## 0. Stack técnico y principios transversales

- **Stack:** HTML5, CSS3, JavaScript nativo, **GSAP 3.12 + ScrollTrigger**, **Lenis** (`@studio-freight/lenis` / smooth scroll), Google Fonts (`font-display: swap`), Font Awesome 6 / Lucide Icons.
- **Reglas no negociables:**
  1. Rendimiento: animar solo `transform` y `opacity`.
  2. Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (easeOutExpo).
  3. Micro-interacciones: 150–300ms. Secciones: 600–1000ms.
  4. Stagger obligatorio: 60–100ms.
  5. Espaciado generoso: padding-block >= 96px desktop / 56px mobile.
  6. Contraste tipográfico marcado: Display expresivo vs Sans neutro.
  7. Botones CTA con feedback de 2 propiedades mínimo.
  8. Imágenes con `object-fit: cover` + gradiente overlay.
  9. `cursor: pointer` en todas las tarjetas interactivas.
  10. Cero flashes de carga.

---

## 1. Categoría: Energía Solar — "Confianza técnica + futuro limpio"
- **Mood:** Ingeniería seria, ROI, solidez técnica, no eco-hippie.
- **Paleta:** Primario `#0B3D2E`, Acento Energía `#F5A623`, Secundario `#1B4B6B`, Fondo `#F7F8F5`, Texto `#12181A`.
- **Tipografía:** Space Grotesk / Clash Display (H1/H2) + Inter (Cuerpo y números tabulares).
- **Componentes:** Calculadora slider con count-up `requestAnimationFrame`, comparador de factura con animación de peso, sello de garantía circular rotatorio 20s, simulador a 25 años SVG, CTA evolutivo según engagement score.

---

## 2. Categoría: Spa / Bienestar — "Calma, lujo sensorial, lentitud intencional"
- **Mood:** Lentitud intencional, respiración, sofisticación orgánica.
- **Paleta:** Base `#F5F0E8` / `#EDE4D3`, Acento `#5C4033` / `#2D3B36`, Metálico `#B5985A`, Texto `#2B2622`.
- **Tipografía:** Playfair Display / Fraunces (itálica ligera 300-400) + Jost / Karla (cuerpo espaciado).
- **Componentes:** Hero con crossfade ambiental lento (6s/2s), menú de servicios acordeón con `grid-template-rows: 0fr -> 1fr`, botón magnético reactivo al cursor, textura de grano SVG, galería mosaico asimétrico con zoom 1.05s, exit-intent modal.

---

## 3. Categoría: Bares / Ocio Nocturno — "Energía nocturna, ritmo, atrevimiento"
- **Mood:** Alto contraste, oscuridad base, luces de neón y ritmo.
- **Paleta:** Base `#0D0D0F`, Superficie `#1A1A1E`, Neón `#FF3D6E` / `#00D9FF`, Ámbar Licor `#FFB84D`, Texto `#F2F2F0`.
- **Tipografía:** Bebas Neue / Archivo Black (Display bold condensado) + Inter / Sora.
- **Componentes:** Títulos con efecto neón y flicker sutil, spotlight hover en carta de cocteles (atenúa el resto a 0.4), marquee horizontal infinito de eventos, flyers semanales con inclinación 3D en perspectiva, CTA con borde animado `conic-gradient`.

---

## 4. Categoría: Boutiques / Moda — "Editorial, minimalista, deseable"
- **Mood:** Revista de moda digital, espacio en blanco, protagonismo del producto.
- **Paleta:** Base `#FAFAF8` (blanco cálido), `#111111` (negro editorial), Acento `#C9A876` (beige dorado) en <5%, Grises `#E8E6E1`.
- **Tipografía:** Didot / Playfair Display Bold (Alta costura) + General Sans (labels en mayúsculas `0.75rem; letter-spacing: 0.12em`).
- **Componentes:** Grid de catálogo con hover de segunda foto (crossfade 0.4s), cursor custom "VER" que sigue al mouse, lookbook con scroll horizontal pineado (`pin: true`, `scrub: 1`), composición editorial asimétrica ("01 / 06").

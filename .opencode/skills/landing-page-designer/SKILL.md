---
name: landing-page-designer
description: >
  Diseña landing pages profesionales y de alta conversión para negocios
  locales. Especializado en moda, vestidos, boutiques y alquiler de ropa.
  Genera HTML/CSS/JS autocontenido sin dependencias externas.
license: MIT
compatibility: opencode
metadata:
  audience: designers
  workflow: landing-pages
---

## Qué hago

Diseño landing pages profesionales, modernas y responsivas para negocios locales
usando un único archivo HTML autocontenido (sin build steps, sin npm).

## Principios de diseño

- **Jerarquía visual clara**: hero → propuesta de valor → servicios → cómo funciona → redes sociales → CTA → contacto
- **Colores de marca**: usar paleta que refleje la identidad del negocio (elegante, femenino para vestidos, etc.)
- **Tipografía**: Google Fonts (Playfair Display para títulos, Inter/Montserrat para cuerpo)
- **Responsive**: mobile-first, grid flexible sin frameworks
- **CTA principal**: WhatsApp flotante siempre visible con número del negocio
- **Rendimiento**: sin imágenes externas (usar placeholders, iconos SVG inline, gradientes)
- **Animaciones**: sutiles (fade-in, slide-up al scroll) con Intersection Observer
- **Contenido**: extraer de redes sociales del negocio (Instagram), NO usar lorem ipsum

## Estructura recomendada

1. **Hero**: nombre, tagline, CTA principal (WhatsApp/Instagram), fondo elegante
2. **Sobre nosotros**: historia/valores (sostenibilidad, moda circular)
3. **Servicios/categorías**: grid de cards con lo que ofrecen (formal, prom, cocktail, etc.)
4. **Cómo funciona**: pasos del proceso (visitar → probar → reservar → evento → devolver)
5. **Precios**: rango indicativo
6. **Redes sociales**: feed de Instagram embebido o simulado con imágenes de placeholder
7. **Testimonios**: sociales
8. **Ubicación/contacto**: dirección, horario, mapa (Google Maps link), WhatsApp CTA final
9. **Footer**: redes sociales

## Reglas estrictas

- Un solo archivo `.html` en landing-pages/
- CSS inline en `<style>`, JS inline en `<script>`
- Sin dependencias externas excepto Google Fonts
- Los placeholders de imágenes usan `https://placehold.co/400x400/COLOR/TEXT?text=Descripción`
- WhatsApp flotante + botón sticky
- Meta tags OG para compartir
- Sin emojis a menos que sea estrictamente necesario y el usuario los pida

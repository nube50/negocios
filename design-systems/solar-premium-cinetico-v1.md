# SISTEMA DE DISEÑO — REGENCIA VISUAL "SOLAR PREMIUM CINÉTICO" v1.0

> **Aplicación Sectorial:** Energía Solar, Energías Renovables, Tecnología Limpia, Sostenibilidad Premium y Marcas Luxury con Identidad Tecnológica-Ambiental.  
> **Filosofía:** *"Energía que se siente, no que se ve."*  
> **Arquitectura:** Línea de tiempo cinética con narrativa por scroll en 5 Actos y motor Three.js WebGL procedural fotorrealista.

---

## 1. Filosofía & Narrativa Cinética en 5 Actos

La experiencia abandona el scroll vertical estático y se concibe como una **Línea de Tiempo Energética**:

| Acto | Nombre | Rango Scroll | Cinemática & Narrativa |
|---|---|---|---|
| **ACTO I** | *El Despertar* | `0% - 25%` | El panel solar 3D emerge en estado de reposo nocturno. Al iniciar el scroll, amanece con un bloom solar dorado (`#FFD700`), activando el barrido metálico del título y el anillo pulsante del CTA. |
| **ACTO II** | *El Flujo de Ahorro* | `25% - 50%` | El panel rota al centro-izquierdo. Se despliega la comparativa de alto impacto: fuga de capital en red pública (-\$1.5M COP) vs generación Sun Energy (+\$1.2M COP/mes ahorrados y Ley 1715). |
| **ACTO III** | *La Transformación 3D* | `50% - 75%` | **Vista explosionada (*Exploded View*)** en Three.js: separación del vidrio templado anti-reflejo, matriz de 144 celdas Half-Cut N-Type con 12 micro-busbars, y caja IP68 con cableado solar MC4. |
| **ACTO IV** | *La Prueba Viva* | `75% - 90%` | El panel solar actúa como visor holográfico proyectando casos de éxito reales en Bogotá (Chicó, Santa Bárbara, Montevideo/Fontibón). |
| **ACTO V** | *La Conexión Final* | `90% - 100%` | El panel se acopla en el fondo mientras se activa la **Cabina de Telemetría Solar Interactiva**, con cálculo dinámico de kWp, COP ahorrados y $CO_2$ evitado en tiempo real, conectado a WhatsApp. |

---

## 2. Paleta de Colores & Tokens Cromáticos

```css
:root {
  /* Fondos Cósmicos & Profundos */
  --bg-dark-start: #040814;
  --bg-dark-end: #0c1e33;
  --surface-glass: rgba(6, 15, 33, 0.72);
  --surface-glass-hover: rgba(10, 24, 52, 0.88);

  /* Acentos de Energía Solar */
  --gold-solar: #ffd700;       /* Dorado Puro (Rayos, CTAs, Highlights) */
  --gold-amber: #f59e0b;       /* Ámbar Cálido */
  --gold-light: #fff099;       /* Brillo Solar Especular */

  /* Acentos Tecnológicos & Ahorro */
  --cyan-electric: #00d4ff;    /* Cian Neón (Circuitos, N-Type, Telemetría) */
  --cyan-glow: rgba(0, 212, 255, 0.4);
  --emerald-eco: #10b981;      /* Verde Esmeralda (Ahorro COP, Certificaciones) */
  --emerald-glow: rgba(16, 185, 129, 0.35);

  /* Jerarquía de Texto */
  --text-white: #ffffff;
  --text-body: rgba(255, 255, 255, 0.85);
  --text-muted: #94a3b8;

  /* Bordes & Glassmorphism */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-gold-glow: rgba(255, 215, 0, 0.4);
  --border-cyan-glow: rgba(0, 212, 255, 0.4);
}
```

---

## 3. Tipografía de Autor & Jerarquía Escalable (`clamp`)

* **Títulos de Alto Impacto (H1, H2, H3):** `Satoshi` / `PPMori` / `Syne` en peso 900 con tracking ultra condensado (-1.5px) y **barrido metálico lineal animado**:
  ```css
  .metallic-title {
    font-family: 'Satoshi', 'Syne', sans-serif;
    font-weight: 900;
    letter-spacing: -1.5px;
    background: linear-gradient(110deg, #ffffff 15%, #ffd700 45%, #ffffff 60%, #e2e8f0 85%, #ffd700 100%);
    background-size: 250% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: metallicShine 6s infinite linear;
  }

  /* Escalas Fluidas con clamp() */
  h1 { font-size: clamp(2.5rem, 8vw, 5rem); }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); }
  h3 { font-size: clamp(1.5rem, 3vw, 2.2rem); }
  body { font-size: clamp(1rem, 1.2vw, 1.125rem); line-height: 1.6; }
  ```
* **Cuerpo Editorial:** `DM Sans` / `General Sans` / `Inter` con `line-height: 1.6`.
* **Telemetría & Datos Numéricos:** `JetBrains Mono` / `Space Mono` (cifras monoespaciadas estilo aviónica / satélite con parpadeo de cursor).

---

## 4. Animaciones Clave & Keyframes

```css
/* Barrido Metálico Continuo */
@keyframes metallicShine {
  0% { background-position: 250% 0; }
  100% { background-position: -250% 0; }
}

/* Pulso Energético de Botón Primario */
@keyframes pulse-btn {
  0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(255, 215, 0, 0.45); }
  50% { transform: scale(1.05); box-shadow: 0 20px 50px rgba(255, 215, 0, 0.75); }
}

/* Anillo de Carga Solar Alrededor del CTA */
@keyframes energy-ring {
  0% { transform: scale(0.96); opacity: 1; }
  100% { transform: scale(1.18); opacity: 0; }
}

/* Latido de Botón Flotante FAB */
@keyframes pulse-fab {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); box-shadow: 0 15px 40px rgba(255, 215, 0, 0.8); }
}

/* Titileo de Cursor Monoespaciado */
@keyframes blink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.7); }
}
```

---

## 5. Arquitectura del Navbar Móvil Solar & Experiencia Táctil

1. **Estado Inicial Flotante:** Formato cápsula (*Floating Pill*) `rgba(5, 11, 26, 0.65)` con `backdrop-filter: blur(16px)`.
2. **Icono de Menú "Solar Cell Grid":** Matriz de 2×2 celdas que, al tocarse, rota 45° y se transforma en una **X** cian neón (`#00d4ff`).
3. **Overlay Fullscreen:** Menú en cascada escalonada (*GSAP Stagger Delay 0.05s*) con inclinación 3D en el eje Y y efecto onda expansiva (*ripple*).
4. **Scroll Inteligente:** Se compacta en altura, adquiere borde cian inferior, y se oculta al llegar al formulario para máxima concentración.
5. **Inspección 3D Táctil (*Touch Drag*):** El usuario puede rotar libremente el panel solar 3D arrastrando con el dedo sobre la pantalla.
6. **Respuesta Háptica:** Integración con `navigator.vibrate(10)` en clics de CTA y aperturas de menú.
7. **Nivel de Detalle Adaptativo (LOD):** En móviles (`< 768px`) reduce polígonos y ajusta las partículas a 80 fotones más grandes con mezcla aditiva para mantener 60fps constantes.

---

## 6. Módulos Obligatorios por Sección

* **Hero:** Panel 3D / Rayos volumétricos, contadores animados (+2.38 MWp, 80% Ahorro, 25 Años).
* **Problema vs Solución:** Comparativa gráfica de gasto en red tradicional vs autoconsumo solar + 3 pilares de beneficios con resplandor dorado al hover.
* **Tecnología 3D (Exploded View):** 3 tarjetas de especificaciones (Vidrio Anti-Reflejo, 144 Celdas N-Type, Caja IP68) y 3 pasos de instalación llave en mano.
* **Telemetría Flotante en Vivo:** Módulo superior con radiación actual Bogotá (4.85 kWh/m²), eficiencia (22.8%) y $CO_2$ evitado.
* **Testimonios Holográficos:** 3 casos verificados con ahorro mensual en COP.
* **Tableta de Telemetría Solar (Cotizador):** Calculador reactivo con selectores de factura mensual que computan kWp, ahorro en COP y toneladas de $CO_2$, con envío formateado a WhatsApp.
* **Ubicación & Cobertura:** Mapa interactivo de Google Maps embebido con dirección física real y líneas directas.

---

## 7. Plantilla de Datos Reales de Negocio

Para aplicar este sistema a un nuevo negocio del sector solar, sustituir las siguientes variables:

* **Nombre de Marca:** `[Nombre del Negocio]` (Ej. *Sun Energy Bogotá*)
* **Potencia Total Instalada:** `[+X.X MWp / kWp]` (Ej. *+2.38 MWp*)
* **Tecnología de Módulos:** `[Potencia en Watts / Tipo de Celda]` (Ej. *Half-Cut 550W N-Type Monocristalino*)
* **Inversores & Baterías:** `[Tipo]` (Ej. *Inversores Híbridos con Almacenamiento LiFePO4*)
* **Ahorro Promedio Mensual:** `[COP / Mes]` (Ej. *$1.200.000 COP / mes industrial*)
* **Certificaciones:** `[Entidades]` (Ej. *UPME, RETIE, NABCEP*)
* **Financiación:** `[Condiciones]` (Ej. *Hasta 100% con Tasa DTF + 4%*)
* **Teléfonos & WhatsApp:** `[Número Internacional]` (Ej. *+57 320 340 5497*)
* **Dirección Física & Cobertura:** `[Dirección]` (Ej. *Carrera 12 # 19-76, Centro / Santa Fe, Bogotá*)

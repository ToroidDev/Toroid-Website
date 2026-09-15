"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./HeroToroidLogo3D.module.css";

const NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
  for (const key in attrs) node.setAttribute(key, String(attrs[key]));
  return node;
}

const clampByte = (n: number) => Math.max(0, Math.min(255, n));
function mixHex(hex: string, target: number, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (shift: number) => clampByte(Math.round(((n >> shift) & 255) + (target - ((n >> shift) & 255)) * amt));
  return `#${[f(16), f(8), f(0)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
const lighten = (hex: string, amt: number) => mixHex(hex, 255, amt);
const darken = (hex: string, amt: number) => mixHex(hex, 0, amt);

// PREVIEW — traçado do logo animado (HeroToroidLogo) intacto: mesmo núcleo,
// mesmas seis ondas, mesmos três fios, mesma timeline de entrada e pulso. A
// única mudança é uma camada de relevo por cima da geometria original —
// pedido: "respeitar o formato da logo original, só aplicar a identidade 3d
// nela", em vez de trocar a geometria pelo enrolamento genérico de
// HeroToroid. Sem inclinação (rejeitada no preview anterior): o 3D mora só no
// sombreamento do anel, que fica propositalmente em cinza/preto/branco — a
// paleta do traço do logo proíbe acento (azul/verde/amarelo) fora dos fios.
const CX = 466.5;
const CY = 244.5;
const D2R = Math.PI / 180;
const sx = (r: number, t: number) => CX + r * Math.cos(t * D2R);
const sy = (r: number, t: number) => CY - r * Math.sin(t * D2R);

const INK = "#FFFFFF";
const CREST = "#EAF2FF";

const WIRES = [
  {
    color: "#F9EC24",
    glow: "#FFFBB0",
    pts: [
      [348, 261], [330, 262.5], [315, 263.5], [300, 263.5], [285, 263.5], [270, 262.5],
      [255, 261], [240, 258.5], [225, 255], [210, 250.5], [195, 244.5], [180, 238],
      [165, 230], [150, 222.5], [135, 213.5], [120, 209.5], [105, 205.5], [90, 204.5],
      [75, 209], [60, 217.5], [53, 221],
    ],
  },
  {
    color: "#1CADE4",
    glow: "#B4EAFB",
    pts: [
      [350, 255], [345, 255.5], [330, 256.5], [315, 252.5], [300, 244.5], [285, 233.5],
      [270, 222], [255, 211], [240, 203.5], [225, 198], [210, 194], [195, 192.5],
      [180, 194.5], [165, 199.5], [150, 209.5], [135, 225.5], [123, 247], [117, 258],
    ],
  },
  {
    color: "#18A957",
    glow: "#A8E9C4",
    pts: [
      [350, 259], [345, 263.5], [330, 270], [315, 279.5], [300, 285.5], [285, 287.5],
      [270, 288.5], [255, 287], [240, 284], [225, 280], [210, 275], [195, 270],
      [180, 264], [165, 258], [150, 253.5], [135, 250], [120, 248], [105, 246],
      [90, 246], [75, 247.5], [60, 251.5], [45, 257], [30, 264], [15, 274], [5, 280],
    ],
  },
] as const;

/* ---------- geometria estática (calculada uma única vez) ---------- */

function buildCoreRing(): string {
  const N = 18, rIn = 28.5, rMean = 121, amp = 3.5, steps = 540;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 360;
    const r = rMean + amp * Math.cos(N * (t - 100) * D2R);
    d += (i ? " L " : "M ") + sx(r, t).toFixed(2) + " " + sy(r, t).toFixed(2);
  }
  d += " Z";
  d += ` M ${CX + rIn} ${CY} A ${rIn} ${rIn} 0 1 0 ${CX - rIn} ${CY} A ${rIn} ${rIn} 0 1 0 ${CX + rIn} ${CY} Z`;
  return d;
}
const CORE_RING = buildCoreRing();

const SLOTS = Array.from({ length: 18 }, (_, k) => {
  const t = 90 + k * 20;
  return { k, x1: sx(36.5, t), y1: sy(36.5, t), x2: sx(108.5, t), y2: sy(108.5, t) };
});

function buildPetals() {
  const a = 121.75, b = 60.75, R = 115;
  const s = (-2 * b * b + Math.sqrt(4 * b * b * b * b + 4 * (a * a - b * b) * R * R)) / (2 * (a * a - b * b));
  const tEnd = Math.acos(Math.max(-1, Math.min(1, s - 1)));
  return [-90, -30, 30, 90, 150, -150].map((phi) => {
    const p = phi * D2R;
    const ux = Math.cos(p), uy = Math.sin(p), vx = -Math.sin(p), vy = Math.cos(p);
    const ex = CX + a * ux, ey = CY + a * uy;
    const P = (t: number): [number, number] => [
      ex + a * Math.cos(t) * ux + b * Math.sin(t) * vx,
      ey + a * Math.cos(t) * uy + b * Math.sin(t) * vy,
    ];
    const D = (t: number): [number, number] => [
      -a * Math.sin(t) * ux + b * Math.cos(t) * vx,
      -a * Math.sin(t) * uy + b * Math.cos(t) * vy,
    ];
    const arc = (t1: number, t2: number, n: number) => {
      const p0 = P(t1);
      let d = `M ${p0[0].toFixed(2)} ${p0[1].toFixed(2)}`;
      for (let k = 0; k < n; k++) {
        const ta = t1 + ((t2 - t1) * k) / n;
        const tb = t1 + ((t2 - t1) * (k + 1)) / n;
        const al = (4 / 3) * Math.tan((tb - ta) / 4);
        const A = P(ta), dA = D(ta), B = P(tb), dB = D(tb);
        d += ` C ${(A[0] + al * dA[0]).toFixed(2)} ${(A[1] + al * dA[1]).toFixed(2)}`
          + ` ${(B[0] - al * dB[0]).toFixed(2)} ${(B[1] - al * dB[1]).toFixed(2)}`
          + ` ${B[0].toFixed(2)} ${B[1].toFixed(2)}`;
      }
      return d;
    };
    return { half1: arc(tEnd, 0, 4), half2: arc(-tEnd, 0, 4) };
  });
}
const PETALS = buildPetals();

function crPath(pts: readonly (readonly number[])[]): string {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || pts[i + 1];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(2)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(2)}`
      + ` ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(2)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(2)}`
      + ` ${p2[0]} ${p2[1]}`;
  }
  return d;
}
const WIRE_D = WIRES.map((w) => crPath(w.pts));

/* ---------- linha do tempo (idêntica a HeroToroidLogo) ---------- */
const CORE_IN = 0.22;
const PETAL_START = 0.25;
const PETAL_STAGGER = 0.24;
const PETAL_DUR = 0.7;
const WIRE_START = 1.9;
const WIRE_STAGGER = 0.18;
const WIRE_DUR = 0.95;

const petalDrawEnd = (i: number) => PETAL_START + i * PETAL_STAGGER + PETAL_DUR;
const wireDrawEnd = (i: number) => WIRE_START + i * WIRE_STAGGER + WIRE_DUR;

const PULSE_DELAY = 0.15;
const CREST_START = petalDrawEnd(0) + PULSE_DELAY;
const CREST_PERIOD = 2.0;
const CREST_FADE = 0.45;
const CREST_ALPHA = 0.45;
const WIRE_PERIOD = 2.2;

const Easing = {
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
};

function animate(from: number, to: number, start: number, end: number, ease: (t: number) => number) {
  return (t: number) => {
    if (t <= start) return from;
    if (t >= end) return to;
    return from + (to - from) * ease((t - start) / (end - start));
  };
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const mod = (n: number, m: number) => ((n % m) + m) % m;

export function HeroToroidLogo3D({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const glowId = `toroid-logo3d-glow-${uid}`;
  const slotsMaskId = `toroid-logo3d-slots-${uid}`;
  const coreGradId = `toroid-logo3d-coregrad-${uid}`;
  const coreSpecId = `toroid-logo3d-corespec-${uid}`;
  const coreHoleId = `toroid-logo3d-corehole-${uid}`;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const lastWrite = new Map<Element, Record<string, string>>();
    const write = (el: Element, name: string, value: string) => {
      let seen = lastWrite.get(el);
      if (!seen) lastWrite.set(el, (seen = {}));
      if (seen[name] === value) return;
      seen[name] = value;
      el.setAttribute(name, value);
    };

    const svg = svgEl("svg", { viewBox: "-10 -8 710 506", width: "100%", "aria-hidden": "true" });
    svg.style.display = "block";
    svg.style.overflow = "visible";

    const defs = svgEl("defs", {});

    const gradient = svgEl("radialGradient", { id: glowId });
    gradient.appendChild(svgEl("stop", { offset: "0", "stop-color": CREST, "stop-opacity": "0.22" }));
    gradient.appendChild(svgEl("stop", { offset: "0.55", "stop-color": CREST, "stop-opacity": "0.07" }));
    gradient.appendChild(svgEl("stop", { offset: "1", "stop-color": CREST, "stop-opacity": "0" }));
    defs.appendChild(gradient);

    // Relevo do anel: gradiente "metal" (luz vindo de cima) com bem mais
    // contraste que a primeira versão, um realce especular maior no canto
    // superior esquerdo, e mais abaixo uma sombra de contato (mesmo truque
    // dos fios: cópia do traçado, deslocada, escura, atrás de tudo) — é essa
    // combinação que faz o anel ler como tubo sólido em vez de recorte
    // chapado, sem precisar inclinar a peça. Tudo em cinza/preto/branco, a
    // paleta do traço do logo não abre exceção pro acento aqui.
    const coreGrad = svgEl("linearGradient", {
      id: coreGradId, x1: CX, y1: CY - 140, x2: CX, y2: CY + 140, gradientUnits: "userSpaceOnUse",
    });
    [
      ["0", "#FFFFFF"], ["0.32", "#F2F4F8"], ["0.6", "#C7CCD6"], ["0.82", "#8B909C"], ["1", "#5B6068"],
    ].forEach(([offset, color]) => coreGrad.appendChild(svgEl("stop", { offset, "stop-color": color })));
    defs.appendChild(coreGrad);

    const coreSpec = svgEl("radialGradient", {
      id: coreSpecId, cx: CX - 38, cy: CY - 98, r: 145, gradientUnits: "userSpaceOnUse",
    });
    coreSpec.appendChild(svgEl("stop", { offset: "0", "stop-color": "#FFFFFF", "stop-opacity": "0.85" }));
    coreSpec.appendChild(svgEl("stop", { offset: "0.45", "stop-color": "#FFFFFF", "stop-opacity": "0.3" }));
    coreSpec.appendChild(svgEl("stop", { offset: "1", "stop-color": "#FFFFFF", "stop-opacity": "0" }));
    defs.appendChild(coreSpec);

    // Sombra no fundo do furo central: um disco escuro por baixo de tudo,
    // menor que o raio interno do anel, pra ler como profundidade real do
    // furo e não só um vazio recortado.
    const coreHole = svgEl("radialGradient", { id: coreHoleId, cx: "0.5", cy: "0.42", r: "0.65" });
    coreHole.appendChild(svgEl("stop", { offset: "0", "stop-color": "#1B1D21", "stop-opacity": "0.55" }));
    coreHole.appendChild(svgEl("stop", { offset: "0.7", "stop-color": "#1B1D21", "stop-opacity": "0.28" }));
    coreHole.appendChild(svgEl("stop", { offset: "1", "stop-color": "#1B1D21", "stop-opacity": "0" }));
    defs.appendChild(coreHole);

    // Gradiente vertical por fio (mesma lógica do anel: claro em cima, sombra
    // embaixo) — dá volume cilíndrico ao traço sem mexer no percurso.
    const wireGradIds = WIRES.map((w, i) => {
      const id = `toroid-logo3d-wiregrad-${uid}-${i}`;
      const g = svgEl("linearGradient", { id, x1: CX, y1: CY - 140, x2: CX, y2: CY + 140, gradientUnits: "userSpaceOnUse" });
      g.appendChild(svgEl("stop", { offset: "0", "stop-color": lighten(w.color, 0.55) }));
      g.appendChild(svgEl("stop", { offset: "0.4", "stop-color": w.color }));
      g.appendChild(svgEl("stop", { offset: "1", "stop-color": darken(w.color, 0.45) }));
      defs.appendChild(g);
      return id;
    });

    const slotsMask = svgEl("mask", {
      id: slotsMaskId, maskUnits: "userSpaceOnUse",
      x: CX - 150, y: CY - 150, width: 300, height: 300,
    });
    slotsMask.appendChild(svgEl("rect", { x: CX - 150, y: CY - 150, width: 300, height: 300, fill: "#fff" }));
    for (const s of SLOTS) {
      slotsMask.appendChild(
        svgEl("line", { x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2, stroke: "#000", "stroke-width": 9, "stroke-linecap": "round" })
      );
    }
    defs.appendChild(slotsMask);

    svg.appendChild(defs);
    const glowCircle = svgEl("circle", { cx: CX, cy: CY, r: 175, fill: `url(#${glowId})` });
    glowCircle.style.animation = "toroGlow 6s ease-in-out infinite";
    svg.appendChild(glowCircle);

    const root = svgEl("g", {});
    svg.appendChild(root);

    const petalsGroup = svgEl("g", { fill: "none", stroke: INK, "stroke-width": 6.5, "stroke-linecap": "butt" });
    const petalPaths = PETALS.map((p) => {
      const base = { pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1 };
      const h1 = svgEl("path", { d: p.half1, ...base });
      const h2 = svgEl("path", { d: p.half2, ...base });
      petalsGroup.append(h1, h2);
      return { h1, h2 };
    });
    root.appendChild(petalsGroup);

    const crestGroup = svgEl("g", {
      fill: "none", stroke: CREST, "stroke-width": 12,
      "stroke-linecap": "round", "stroke-dasharray": "0.18 0.82",
      "stroke-dashoffset": 1,
    });
    const crestPaths = PETALS.map((p) => {
      const el = svgEl("path", { d: `${p.half1} ${p.half2}`, pathLength: 2, "stroke-opacity": 0 });
      crestGroup.appendChild(el);
      return el;
    });
    root.appendChild(crestGroup);

    // Cada fio ganha uma terceira cópia do traçado, mais larga e escura, deslocada
    // (translate) para trás/baixo — sombra de relevo de "fio redondo", igual ao
    // truque clássico de bevel/emboss. Ela segue o mesmo dashoffset do traço
    // principal para desenhar junto durante a entrada, e não é tocada depois.
    const wiresGroup = svgEl("g", { fill: "none", "stroke-linecap": "round" });
    const wireEls = WIRES.map((w, i) => {
      const shadow = svgEl("path", {
        d: WIRE_D[i], stroke: darken(w.color, 0.6), "stroke-width": 13, "stroke-opacity": 0.32,
        pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1,
        transform: "translate(1.8,2.6)",
      });
      const main = svgEl("path", {
        d: WIRE_D[i], stroke: `url(#${wireGradIds[i]})`, "stroke-width": 10.5, pathLength: 1,
        "stroke-dasharray": "1 1", "stroke-dashoffset": 1,
      });
      const glow = svgEl("path", {
        d: WIRE_D[i], stroke: w.glow, "stroke-width": 6, pathLength: 1,
        "stroke-dasharray": "0.1 0.9", opacity: 0,
      });
      wiresGroup.append(shadow, main, glow);
      return { shadow, main, glow };
    });
    root.appendChild(wiresGroup);

    const coreGroup = svgEl("g", { opacity: 0 });
    coreGroup.appendChild(svgEl("circle", { cx: CX, cy: CY, r: 30, fill: `url(#${coreHoleId})` }));
    const coreShadow = svgEl("path", { d: CORE_RING, "fill-rule": "evenodd", fill: "#14161A", opacity: 0.4, mask: `url(#${slotsMaskId})`, transform: "translate(3,4.5)" });
    coreGroup.appendChild(coreShadow);
    coreGroup.appendChild(svgEl("path", { d: CORE_RING, "fill-rule": "evenodd", fill: `url(#${coreGradId})`, mask: `url(#${slotsMaskId})` }));
    const coreSpecPath = svgEl("path", { d: CORE_RING, "fill-rule": "evenodd", fill: `url(#${coreSpecId})`, mask: `url(#${slotsMaskId})` });
    coreSpecPath.style.mixBlendMode = "screen";
    coreGroup.appendChild(coreSpecPath);
    root.appendChild(coreGroup);

    host.appendChild(svg);

    const render = (T: number, withPulse: boolean) => {
      write(coreGroup, "opacity", clamp(T / CORE_IN, 0, 1).toFixed(3));

      const u = withPulse ? mod((T - CREST_START) / CREST_PERIOD, 1) : 0;
      const crestAlpha = withPulse && T > CREST_START ? CREST_ALPHA * (1 - 0.3 * u) : 0;
      write(crestGroup, "stroke-dashoffset", (1 - u).toFixed(4));

      PETALS.forEach((_, i) => {
        const start = PETAL_START + i * PETAL_STAGGER;
        const prog = animate(0, 1, start, start + PETAL_DUR, Easing.easeOutCubic)(T);
        const offset = (1 - prog).toFixed(4);
        write(petalPaths[i].h1, "stroke-dashoffset", offset);
        write(petalPaths[i].h2, "stroke-dashoffset", offset);

        const fadeFrom = petalDrawEnd(i);
        const gate = animate(0, 1, fadeFrom, fadeFrom + CREST_FADE, Easing.easeOutCubic)(T);
        write(crestPaths[i], "stroke-opacity", (crestAlpha * gate).toFixed(3));
      });

      WIRES.forEach((_, i) => {
        const start = WIRE_START + i * WIRE_STAGGER;
        const prog = animate(0, 1, start, start + WIRE_DUR, Easing.easeOutQuart)(T);
        const offset = (1 - prog).toFixed(4);
        write(wireEls[i].shadow, "stroke-dashoffset", offset);
        write(wireEls[i].main, "stroke-dashoffset", offset);

        const from = wireDrawEnd(i) + PULSE_DELAY;
        const p = withPulse && T > from ? mod((T - from) / WIRE_PERIOD, 1) : -1;
        write(wireEls[i].glow, "opacity", p < 0 ? "0" : (0.85 * Math.sin(p * Math.PI)).toFixed(3));
        if (p >= 0) write(wireEls[i].glow, "stroke-dashoffset", p.toFixed(4));
      });
    };

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduced) {
      render(999, false);
      return () => {
        svg.remove();
      };
    }

    let raf = 0;
    let last = -99;
    let onScreen = true;
    let startTs: number | null = null;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (!onScreen || ts - last < 26) return;
      last = ts;
      if (startTs === null) startTs = ts;
      render((ts - startTs) / 1000, true);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(host);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      svg.remove();
    };
  }, [glowId, slotsMaskId, coreGradId, coreSpecId, coreHoleId, uid]);

  return <div ref={hostRef} aria-hidden="true" className={`${styles.host} ${className ?? ""}`} />;
}

"use client";

import { useEffect, useId, useRef } from "react";

const NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
  for (const key in attrs) node.setAttribute(key, String(attrs[key]));
  return node;
}

// Logotipo animado da Toroid. O núcleo é fixo: ele é a peça, não o evento.
// As seis ondas eletromagnéticas e os três fios de cobre (as cores são as do
// logo oficial, ver "Logo peito" da identidade visual) entram desenhando uma
// única vez por carregamento de página, e depois disso o que continua em
// movimento é só o pulso: uma frente de onda irradiando do núcleo para fora e
// a corrente correndo pelos fios.
//
// Geometria portada 1:1 do protótipo (Claude Design canvas), em SVG imperativo
// sobre rAF, no mesmo padrão de HeroToroid e CurrentWave: sem framework de
// composição, sem lib de animação. Depois da entrada o trabalho por frame cai
// para 8 atribuições de atributo (INP < 200ms é requisito do projeto), porque a
// frente de onda é dirigida por um único stroke-dashoffset herdado do grupo.
const CX = 466.5;
const CY = 244.5;
const D2R = Math.PI / 180;
const sx = (r: number, t: number) => CX + r * Math.cos(t * D2R);
const sy = (r: number, t: number) => CY - r * Math.sin(t * D2R);

const INK = "#FFFFFF";
// Quase-branco do halo, reaproveitado na crista da onda. O traço do logo é
// branco puro e não existe branco mais brilhante que branco, então a crista lê
// por área (traço mais largo, brilho para os dois lados) e não por luminância.
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

// Cada onda é um arco de elipse truncado onde encontra a borda externa do
// núcleo (R), então nasce e termina na borda e nunca alcança o centro. As duas
// metades saem de `arc(±tEnd, 0)`: começam na borda do núcleo e terminam na
// ponta externa. Essa direção é o que define para que lado a crista viaja.
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

/* ---------- linha do tempo ---------- */
// Entrada one-shot: o núcleo já está lá, as ondas abrem em leque e os fios saem
// em seguida. O stagger das ondas é maior que a duração percebida do easing
// (easeOutCubic chega a 95% em 63% do intervalo, ~0.44s aqui), senão as seis
// abrem praticamente juntas e o leque não lê.
const CORE_IN = 0.22;
const PETAL_START = 0.25;
const PETAL_STAGGER = 0.24;
const PETAL_DUR = 0.7;
const WIRE_START = 1.9;
const WIRE_STAGGER = 0.18;
const WIRE_DUR = 0.95;

const petalDrawEnd = (i: number) => PETAL_START + i * PETAL_STAGGER + PETAL_DUR;
const wireDrawEnd = (i: number) => WIRE_START + i * WIRE_STAGGER + WIRE_DUR;

// Folga entre o fim do desenho de um traço e o começo do pulso nele, para o
// pulso não parecer que atropelou a entrada.
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

export function HeroToroidLogo({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const glowId = `toroid-logo-glow-${uid}`;
  const slotsMaskId = `toroid-logo-slots-${uid}`;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Depois da entrada quase todo atributo vira constante. O cache evita
    // reescrever o mesmo valor 38 vezes por segundo, o que ainda invalidaria
    // estilo e paint de graça.
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

    // Halo suave atrás da marca: o traço do núcleo/ondas (INK) fica dentro da
    // paleta preto/ink/branco da identidade, nunca nas cores de acento
    // (azul/verde/amarelo). Sobre o fundo azul profundo o halo ajuda a separar
    // a marca do entorno, mesma lógica de um "spot" de luz.
    const gradient = svgEl("radialGradient", { id: glowId });
    gradient.appendChild(svgEl("stop", { offset: "0", "stop-color": CREST, "stop-opacity": "0.22" }));
    gradient.appendChild(svgEl("stop", { offset: "0.55", "stop-color": CREST, "stop-opacity": "0.07" }));
    gradient.appendChild(svgEl("stop", { offset: "1", "stop-color": CREST, "stop-opacity": "0" }));
    defs.appendChild(gradient);

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
    svg.appendChild(svgEl("circle", { cx: CX, cy: CY, r: 175, fill: `url(#${glowId})` }));

    const root = svgEl("g", {});
    svg.appendChild(root);

    // `stroke-dashoffset: 1` já na criação, não no primeiro render: o default é
    // 0, que desenha o traço inteiro. Sem isto o logo pisca completo por um
    // frame entre o appendChild e o primeiro callback de rAF.
    const petalsGroup = svgEl("g", { fill: "none", stroke: INK, "stroke-width": 6.5, "stroke-linecap": "butt" });
    const petalPaths = PETALS.map((p) => {
      const base = { pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1 };
      const h1 = svgEl("path", { d: p.half1, ...base });
      const h2 = svgEl("path", { d: p.half2, ...base });
      petalsGroup.append(h1, h2);
      return { h1, h2 };
    });
    root.appendChild(petalsGroup);

    // A frente de onda. As seis pétalas compartilham a mesma fase, então as
    // doze cristas estão sempre no mesmo raio e o olho fecha o círculo: lê como
    // anel expandindo, que é o fenômeno. Fase por pétala leria como seis
    // corredores independentes, o oposto disso.
    //
    // Como a fase é compartilhada, `stroke-dashoffset` pode morar no grupo e ser
    // herdado pelas seis filhas: um único write por frame move toda a frente.
    // Cada filha junta as duas metades num só path com `pathLength=2`, então
    // cada metade mede exatamente 1 e o período do dasharray (também 1) fecha
    // na emenda entre os subpaths.
    // A transparência vai em `stroke-opacity` nas filhas, nunca em `opacity` no
    // grupo: `opacity` num grupo obriga o browser a compor as seis cristas num
    // buffer offscreen a cada frame, e `stroke-opacity` é herdada sem criar
    // camada nenhuma.
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

    const wiresGroup = svgEl("g", { fill: "none", "stroke-width": 10.5, "stroke-linecap": "round" });
    const wireEls = WIRES.map((w, i) => {
      const main = svgEl("path", {
        d: WIRE_D[i], stroke: w.color, pathLength: 1,
        "stroke-dasharray": "1 1", "stroke-dashoffset": 1,
      });
      const glow = svgEl("path", {
        d: WIRE_D[i], stroke: w.glow, "stroke-width": 6, pathLength: 1,
        "stroke-dasharray": "0.1 0.9", opacity: 0,
      });
      wiresGroup.append(main, glow);
      return { main, glow };
    });
    root.appendChild(wiresGroup);

    // O núcleo entra por cima: as ondas são truncadas em R=115 e os fios nascem
    // a ~118 do centro, então é o núcleo que esconde as emendas de todos eles.
    const coreGroup = svgEl("g", { opacity: 0 });
    coreGroup.appendChild(svgEl("path", { d: CORE_RING, "fill-rule": "evenodd", fill: INK, mask: `url(#${slotsMaskId})` }));
    root.appendChild(coreGroup);

    host.appendChild(svg);

    const render = (T: number, withPulse: boolean) => {
      // O núcleo é fixo, mas o SVG só existe depois da hidratação. Sem esses
      // 0.22s de fade ele aparece com um estalo no meio do carregamento.
      write(coreGroup, "opacity", clamp(T / CORE_IN, 0, 1).toFixed(3));

      // Emissão contínua: quando uma crista sai pela ponta, a seguinte já
      // nasceu na borda do núcleo. Por isso a opacidade não tem envelope
      // senoidal (que piscaria na emenda), só a queda de amplitude com a
      // distância. `1 - u` porque dashoffset crescente move o traço para o
      // começo do path, e o começo aqui é o núcleo: para irradiar para fora o
      // offset tem que decrescer.
      const u = withPulse ? mod((T - CREST_START) / CREST_PERIOD, 1) : 0;
      const crestAlpha = withPulse && T > CREST_START ? CREST_ALPHA * (1 - 0.3 * u) : 0;
      write(crestGroup, "stroke-dashoffset", (1 - u).toFixed(4));

      PETALS.forEach((_, i) => {
        const start = PETAL_START + i * PETAL_STAGGER;
        const prog = animate(0, 1, start, start + PETAL_DUR, Easing.easeOutCubic)(T);
        const offset = (1 - prog).toFixed(4);
        write(petalPaths[i].h1, "stroke-dashoffset", offset);
        write(petalPaths[i].h2, "stroke-dashoffset", offset);

        // Cada braço acende quando termina de se desenhar e se junta a uma
        // frente que já está em voo.
        const fadeFrom = petalDrawEnd(i);
        const gate = animate(0, 1, fadeFrom, fadeFrom + CREST_FADE, Easing.easeOutCubic)(T);
        write(crestPaths[i], "stroke-opacity", (crestAlpha * gate).toFixed(3));
      });

      WIRES.forEach((_, i) => {
        const start = WIRE_START + i * WIRE_STAGGER;
        const prog = animate(0, 1, start, start + WIRE_DUR, Easing.easeOutQuart)(T);
        write(wireEls[i].main, "stroke-dashoffset", (1 - prog).toFixed(4));

        // A fase sai do próprio fim do desenho deste fio, não de um offset
        // calibrado à mão: mexer nos tempos de entrada não descola mais o pulso.
        // Aqui o offset cresce, então a corrente corre da ponta para o núcleo,
        // ou seja entrando no enrolamento. É de propósito, e é o contrário da
        // crista das ondas, que irradia para fora.
        const from = wireDrawEnd(i) + PULSE_DELAY;
        const p = withPulse && T > from ? mod((T - from) / WIRE_PERIOD, 1) : -1;
        write(wireEls[i].glow, "opacity", p < 0 ? "0" : (0.85 * Math.sin(p * Math.PI)).toFixed(3));
        if (p >= 0) write(wireEls[i].glow, "stroke-dashoffset", p.toFixed(4));
      });
    };

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduced) {
      render(999, false); // um único frame estático: tudo desenhado, sem pulso
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
      if (!onScreen || ts - last < 26) return; // throttle ~38fps
      last = ts;
      // `startTs` depois do guard de propósito: abaixo de 1200px o hero é uma
      // coluna e a arte cai abaixo da dobra, então o relógio precisa começar na
      // primeira vez que a peça fica visível, senão a entrada toca para ninguém.
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
  }, [glowId, slotsMaskId]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      // aspect-ratio reserva a caixa exata do viewBox, então a hidratação não
      // empurra layout (CLS < 0.1 é requisito do projeto).
      style={{ position: "relative", aspectRatio: "710 / 506" }}
    />
  );
}

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

// Projeção 3D do núcleo toroidal (isométrica com achatamento SE/CE) + hidden-line
// para os fios de cobre: o trecho "atrás" do núcleo desenha com opacidade baixa,
// o trecho "na frente" com opacidade/espessura maior, dando volume ao traçado.
const W = 780;
const H = 560;
const CX = W / 2;
const CY = H / 2 + 8;
const R = 198; // raio do núcleo
const A = 54; // raio do tubo (espessura do toroide)
const SE = 0.448; // achatamento vertical da projeção
const CE = 0.894; // componente complementar do achatamento

/**
 * Presets de densidade do enrolamento. `turns` = nº de fios de cobre,
 * `rings` = amostras por volta do fio. São os dois únicos botões de custo da
 * animação (custo por frame ≈ turns × rings), e INP < 200ms é requisito do projeto.
 *
 * Para trocar de preset é uma linha: `<HeroToroid preset="compact" />`, ou mudar
 * o default do parâmetro em `HeroToroid` abaixo.
 *
 *  - `original`: como estava antes do hero full-bleed (46/26), peça grande sobre fundo claro.
 *  - `compact`:  versão enxuta usada quando o toroide era pequeno no canto (34/20).
 *  - `dense`:    atual, enrolamento cheio, para a peça em tamanho próximo ao do h1.
 */
export const TOROID_PRESETS = {
  original: { turns: 46, rings: 26 },
  compact: { turns: 34, rings: 20 },
  dense: { turns: 70, rings: 22 },
} as const;

export type ToroidPreset = keyof typeof TOROID_PRESETS;

type Variant = "light" | "dark";

const PALETTE: Record<
  Variant,
  {
    glow: string;
    glowStops: readonly (readonly [string, string])[];
    shadow: string;
    coreOuterFill: string;
    coreOuterStroke: string;
    coreInnerFill: string;
    coreInnerStroke: string;
    coreRingStroke: string;
    wireBack: string;
    wireBackOpacity: string;
    wireFront: string;
    wireRear: string;
  }
> = {
  light: {
    glow: "#1A4B8C",
    glowStops: [
      ["0", ".30"],
      [".5", ".09"],
      ["1", "0"],
    ],
    shadow: "rgba(26,75,140,.06)",
    coreOuterFill: "rgba(232,239,248,.62)",
    coreOuterStroke: "rgba(26,75,140,.18)",
    coreInnerFill: "rgba(253,254,255,.96)",
    coreInnerStroke: "rgba(26,75,140,.20)",
    coreRingStroke: "rgba(26,75,140,.10)",
    wireBack: "#B8834A",
    wireBackOpacity: ".16",
    wireFront: "#C08A4E",
    wireRear: "#96703F",
  },
  // Sobre azul profundo o núcleo vira vidro translúcido e o cobre sobe de luminância,
  // senão o traçado desaparece no fundo.
  dark: {
    glow: "#8FC0F0",
    glowStops: [
      ["0", ".40"],
      [".5", ".13"],
      ["1", "0"],
    ],
    // sem sombra de contato no escuro: sobre azul profundo ela lia como borrão,
    // não como chão
    shadow: "transparent",
    coreOuterFill: "rgba(255,255,255,.055)",
    coreOuterStroke: "rgba(255,255,255,.20)",
    coreInnerFill: "rgba(224,238,255,.10)",
    coreInnerStroke: "rgba(255,255,255,.26)",
    coreRingStroke: "rgba(255,255,255,.13)",
    wireBack: "#A8763C",
    wireBackOpacity: ".24",
    wireFront: "#EDB472",
    wireRear: "#B07D42",
  },
};

export function HeroToroid({
  variant = "light",
  preset = "dense",
  className,
}: {
  variant?: Variant;
  preset?: ToroidPreset;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Sem isto duas instâncias na mesma página colidiriam no id do gradiente.
  const rawId = useId();
  const glowId = `toroid-glow-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const c = PALETTE[variant];
    const { turns: TURNS, rings: RINGS } = TOROID_PRESETS[preset];

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", "aria-hidden": "true" });
    svg.style.display = "block";
    svg.style.overflow = "visible";

    const defs = svgEl("defs", {});
    const gradient = svgEl("radialGradient", { id: glowId });
    c.glowStops.forEach(([offset, stopOpacity]) => {
      gradient.appendChild(svgEl("stop", { offset, "stop-color": c.glow, "stop-opacity": stopOpacity }));
    });
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // sombra de contato no chão
    svg.appendChild(svgEl("ellipse", { cx: CX, cy: CY + 172, rx: 230, ry: 20, fill: c.shadow }));

    const glow = svgEl("circle", { cx: CX, cy: CY, r: 170, fill: `url(#${glowId})` });
    glow.style.animation = "toroGlow 7s ease-in-out infinite";
    svg.appendChild(glow);

    const gFar = svgEl("g", {}); // trechos de fio atrás do núcleo
    const core = svgEl("g", {}); // o próprio núcleo (3 elipses)
    const gNear = svgEl("g", {}); // trechos de fio na frente
    svg.append(gFar, core, gNear);

    core.appendChild(
      svgEl("ellipse", {
        cx: CX,
        cy: CY,
        rx: R + A,
        ry: (R + A) * SE,
        fill: c.coreOuterFill,
        stroke: c.coreOuterStroke,
        "stroke-width": 1.3,
      })
    );
    core.appendChild(
      svgEl("ellipse", {
        cx: CX,
        cy: CY,
        rx: R - A,
        ry: (R - A) * SE,
        fill: c.coreInnerFill,
        stroke: c.coreInnerStroke,
        "stroke-width": 1.3,
      })
    );
    core.appendChild(
      svgEl("ellipse", {
        cx: CX,
        cy: CY,
        rx: (R - A) * 0.66,
        ry: (R - A) * SE * 0.66,
        fill: "none",
        stroke: c.coreRingStroke,
        "stroke-width": 1,
      })
    );

    const turns = Array.from({ length: TURNS }, (_, i) => {
      const hidden = svgEl("path", {
        fill: "none",
        stroke: c.wireBack,
        "stroke-width": 1.1,
        "stroke-linecap": "round",
        opacity: c.wireBackOpacity,
      });
      const visible = svgEl("path", {
        fill: "none",
        stroke: c.wireFront,
        "stroke-width": 2,
        "stroke-linecap": "round",
      });
      gFar.appendChild(hidden);
      gNear.appendChild(visible);
      return { i, hidden, visible };
    });

    host.appendChild(svg);

    const draw = (time: number) => {
      const phase = time * 0.14; // velocidade de rotação (rad/s)
      for (const turn of turns) {
        const u = (turn.i / TURNS) * Math.PI * 2 + phase; // ângulo maior (posição da volta)
        const su = Math.sin(u);
        const cu = Math.cos(u);
        const front = (su + 1) / 2; // 0 = fundo, 1 = frente
        let visibleD = "";
        let hiddenD = "";
        let prevShown: boolean | null = null;
        for (let j = 0; j <= RINGS; j++) {
          const v = (j / RINGS) * Math.PI * 2; // ângulo menor (volta em torno do tubo)
          const cv = Math.cos(v);
          const sv = Math.sin(v);
          const rr = R + A * cv;
          const x = CX + rr * cu;
          const y = CY + rr * su * SE - A * sv * CE; // projeção isométrica achatada
          const shown = cv * su * CE + sv * SE > 0; // hidden-line test (normal · câmera)
          const segment = `${prevShown === shown ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
          if (shown) visibleD += segment;
          else hiddenD += segment;
          prevShown = shown;
        }
        turn.visible.setAttribute("d", visibleD);
        turn.hidden.setAttribute("d", hiddenD);
        turn.visible.setAttribute("stroke-width", (1.5 + 1.1 * front).toFixed(2));
        turn.visible.setAttribute("opacity", (0.58 + 0.4 * front).toFixed(2));
        turn.visible.setAttribute("stroke", front > 0.55 ? c.wireFront : c.wireRear);
      }
    };

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduced) {
      draw(0); // um único frame estático
      return () => {
        svg.remove();
      };
    }

    let raf = 0;
    let last = -99;
    let onScreen = true;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (!onScreen || ts - last < 26) return; // throttle ~38fps
      last = ts;
      draw(ts / 1000);
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
  }, [variant, preset, glowId]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      // aspect-ratio em vez de min-height: reserva a caixa exata do viewBox, então
      // a hidratação não empurra nada (CLS < 0.1 é requisito). O rotate é só
      // transform (não afeta a caixa de layout), por isso não conta pra CLS.
      style={{ position: "relative", aspectRatio: `${W} / ${H}`, transform: "rotate(-7deg)" }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

const NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
  for (const key in attrs) node.setAttribute(key, String(attrs[key]));
  return node;
}

const W = 640;
const H = 260;

function wavePath(phase: number, amplitude: number) {
  let d = "";
  for (let x = 0; x <= W; x += 8) {
    const y = H / 2 + amplitude * Math.sin((x / W) * Math.PI * 4 + phase);
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`;
  }
  return d;
}

type Variant = "light" | "dark";

const PALETTE: Record<Variant, { gridH: string; gridV: string; back: string; main: string }> = {
  light: {
    gridH: "rgba(26,75,140,.10)",
    gridV: "rgba(26,75,140,.06)",
    back: "rgba(26,75,140,.22)",
    main: "#1A4B8C",
  },
  dark: {
    gridH: "rgba(255,255,255,.12)",
    gridV: "rgba(255,255,255,.07)",
    back: "rgba(143,192,240,.30)",
    main: "rgba(255,255,255,.88)",
  },
};

// Senoide de corrente (osciloscópio): grade de referência + duas ondas
// defasadas simulando o traço principal e seu eco.
export function CurrentWave({ variant = "light", className }: { variant?: Variant; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const c = PALETTE[variant];

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", "aria-hidden": "true" });
    svg.style.display = "block";

    for (let i = 1; i < 4; i++) {
      svg.appendChild(
        svgEl("line", {
          x1: 0,
          y1: (H / 4) * i,
          x2: W,
          y2: (H / 4) * i,
          stroke: c.gridH,
          "stroke-width": 1,
        })
      );
    }
    for (let i = 1; i < 6; i++) {
      svg.appendChild(
        svgEl("line", {
          x1: (W / 6) * i,
          y1: 0,
          x2: (W / 6) * i,
          y2: H,
          stroke: c.gridV,
          "stroke-width": 1,
        })
      );
    }

    const back = svgEl("path", {
      fill: "none",
      stroke: c.back,
      "stroke-width": 1.6,
      "stroke-linecap": "round",
    });
    const main = svgEl("path", { fill: "none", stroke: c.main, "stroke-width": 2.4, "stroke-linecap": "round" });
    svg.append(back, main);
    host.appendChild(svg);

    const draw = (time: number) => {
      main.setAttribute("d", wavePath(-time * 0.9, 62));
      back.setAttribute("d", wavePath(-time * 0.9 + 0.9, 46));
    };

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduced) {
      draw(0);
      return () => {
        svg.remove();
      };
    }

    let raf = 0;
    let last = -99;
    let onScreen = true;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (!onScreen || ts - last < 26) return;
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
  }, [variant]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ position: "relative", aspectRatio: `${W} / ${H}` }}
    />
  );
}

import styles from "./PulsoProtegido.module.css";

/**
 * Emblema do hero de equipamentos médicos: o núcleo isolando um sinal limpo,
 * não um transformador genérico. Três coisas afirmadas, nada além:
 *
 *  1. O sinal (a fita de monitor cruzando o anel) permanece plano e legível
 *     dentro da zona protegida. É a leitura visual de "baixa interferência no
 *     sinal medido".
 *  2. O núcleo contém o campo: como em NucleoIsolado.tsx, quase nada escapa
 *     para fora do anel de limite.
 *  3. Fora do limite existem traços de ruído externo, mas eles desaparecem
 *     com a distância em vez de atravessar. Nenhum entra na zona do sinal:
 *     não é decoração, é a mesma afirmação de "baixa irradiação de campo" do
 *     texto ao lado.
 *
 * Determinístico, sem estado e sem tempo em JS: renderiza no servidor, e as
 * únicas animações (fluxo girando, fita do monitor deslizando) são CSS puro,
 * tratadas globalmente por `prefers-reduced-motion` em globals.css.
 */

const SIZE = 440;
const C = SIZE / 2;

const R_OUT = 140;
const R_IN = 90;
const R_LIMITE = 158;

const STROKE = "rgba(190, 216, 244, 0.55)";
const STROKE_FAINT = "rgba(190, 216, 244, 0.24)";
const FLUXO = "rgba(190, 216, 244, 0.4)";
const ACCENT = "#8FCB8F";

// Um ciclo de batimento simplificado (P discreto, QRS marcado, T suave),
// pensado para ler como "monitor de sinal vital", não como ECG clínico.
// Período de 110 unidades: quatro ciclos cobrem os 440 de largura do hero.
const PERIODO = 110;
const CICLO: [number, number][] = [
  [0, 0],
  [40, 0],
  [44, -2],
  [50, 0],
  [58, 0],
  [60, 1],
  [63, -17],
  [66, 4],
  [72, 0],
  [80, 0],
  [88, -4],
  [96, 0],
  [110, 0],
];

function fitaMonitor(larguraTotal: number) {
  let d = "";
  for (let inicio = 0; inicio < larguraTotal; inicio += PERIODO) {
    for (const [dx, dy] of CICLO) {
      const x = inicio + dx;
      if (x > larguraTotal) break;
      d += `${d === "" ? "M" : "L"}${x} ${dy.toFixed(1)} `;
    }
  }
  return d.trim();
}

// Traçado com o dobro da largura visível, igual à técnica de BandaRegulacao.tsx:
// desloca -440 e a emenda não aparece, porque o período (110) divide 440.
const FITA_D = fitaMonitor(SIZE * 2);

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

// Marcas de ruído externo, curtas e decrescendo de opacidade com o raio:
// determinístico por índice, não Math.random, pra renderizar igual sempre.
const RUIDO_EXTERNO = Array.from({ length: 14 }, (_, i) => {
  const deg = i * 25.7;
  const r1 = R_LIMITE + 14 + (i % 3) * 10;
  const r2 = r1 + 10 + (i % 4) * 4;
  const [x1, y1] = polar(r1, deg);
  const [x2, y2] = polar(r2, deg);
  const opacidade = Math.max(0.05, 0.3 - (r1 - R_LIMITE) * 0.006);
  return { key: i, x1, y1, x2, y2, opacidade };
});

export function PulsoProtegido({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <clipPath id="pulsoProtegidoFaixa">
          <rect x={C - R_OUT} y={C - 26} width={R_OUT * 2} height={52} />
        </clipPath>
      </defs>

      {/* ruído externo: some com a distância, nunca cruza o limite */}
      <g stroke="rgba(230, 120, 120, 0.5)" strokeWidth={1.4} strokeLinecap="round">
        {RUIDO_EXTERNO.map((t) => (
          <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} opacity={t.opacidade} />
        ))}
      </g>

      {/* limite do campo, mesma leitura de NucleoIsolado.tsx */}
      <circle cx={C} cy={C} r={R_LIMITE} stroke={STROKE_FAINT} strokeWidth={1} fill="none" opacity={0.5} />

      {/* corpo do núcleo */}
      <circle cx={C} cy={C} r={R_OUT} stroke={STROKE} strokeWidth={2.2} fill="none" />
      <circle cx={C} cy={C} r={R_IN} stroke={STROKE} strokeWidth={2.2} fill="none" />

      {/* fluxo contido na coroa */}
      {[
        { r: 128, duracao: "40s" },
        { r: 112, duracao: "31s" },
      ].map(({ r, duracao }) => {
        const perimetro = 2 * Math.PI * r;
        const traco = perimetro / 8;
        return (
          <circle
            key={r}
            cx={C}
            cy={C}
            r={r}
            fill="none"
            stroke={FLUXO}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeDasharray={`${traco.toFixed(1)} ${traco.toFixed(1)}`}
            className={styles.fluxo}
            style={{ animationDuration: duracao }}
          />
        );
      })}

      {/* fita do monitor: sinal limpo cruzando a zona protegida */}
      <g clipPath="url(#pulsoProtegidoFaixa)">
        <line x1={0} y1={C} x2={SIZE} y2={C} stroke="rgba(190, 216, 244, 0.14)" strokeWidth={1} />
        <g className={styles.deriva}>
          <path d={FITA_D} fill="none" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" transform={`translate(0 ${C})`} />
        </g>
      </g>
    </svg>
  );
}

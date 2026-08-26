import styles from "./EspecificacoesSobMedida.module.css";

/**
 * Emblema do hero de integradores de sistemas: diferente das outras 4 páginas
 * deste lote, aqui não existe UMA característica elétrica pra ilustrar (o
 * próprio texto da página já diz isso, ver comentário no topo de page.tsx). O
 * que existe é variedade de projeto. Por isso o desenho não é um núcleo com
 * um fenômeno acontecendo dentro dele: são três núcleos de tamanhos
 * diferentes (projetos diferentes, cada um com a própria especificação), e só
 * o que está "em cotação agora" gira e tem o selo de verificado. Os outros
 * dois ficam parados e discretos, não é ele que a página está descrevendo.
 *
 * Determinístico, sem estado e sem tempo em JS: renderiza no servidor, e a
 * única animação (fluxo do núcleo em destaque) é CSS puro, tratada
 * globalmente por `prefers-reduced-motion` em globals.css.
 */

const SIZE = 440;
const STROKE_FAINT = "rgba(190, 216, 244, 0.4)";
const FLUXO = "rgba(190, 216, 244, 0.45)";
const ACCENT = "#8FCB8F";

type Nucleo = {
  cx: number;
  cy: number;
  rOut: number;
  rIn: number;
};

const SECUNDARIO_A: Nucleo = { cx: 108, cy: 300, rOut: 52, rIn: 32 };
const SECUNDARIO_B: Nucleo = { cx: 356, cy: 316, rOut: 64, rIn: 40 };
const PRINCIPAL: Nucleo = { cx: 246, cy: 172, rOut: 96, rIn: 58 };

function anelFluxo({ cx, cy, rOut, rIn }: Nucleo) {
  const r = (rOut + rIn) / 2;
  const perimetro = 2 * Math.PI * r;
  const traco = perimetro / 9;
  return { cx, cy, r, dasharray: `${traco.toFixed(1)} ${traco.toFixed(1)}` };
}

const FLUXO_PRINCIPAL = anelFluxo(PRINCIPAL);

function checkBadge({ cx, cy, rOut }: Nucleo) {
  const a = (-38 * Math.PI) / 180;
  const bx = cx + rOut * Math.cos(a);
  const by = cy + rOut * Math.sin(a);
  return { bx, by };
}

const { bx: BADGE_X, by: BADGE_Y } = checkBadge(PRINCIPAL);

export function EspecificacoesSobMedida({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* dois núcleos secundários: outros projetos, discretos de propósito */}
      {[SECUNDARIO_A, SECUNDARIO_B].map((n, i) => (
        <g key={i} opacity={0.4}>
          <circle cx={n.cx} cy={n.cy} r={n.rOut} stroke={STROKE_FAINT} strokeWidth={1.8} fill="none" />
          <circle cx={n.cx} cy={n.cy} r={n.rIn} stroke={STROKE_FAINT} strokeWidth={1.8} fill="none" />
        </g>
      ))}

      {/* núcleo em cotação: o foco da página */}
      <circle cx={PRINCIPAL.cx} cy={PRINCIPAL.cy} r={PRINCIPAL.rOut} stroke="rgba(190, 216, 244, 0.6)" strokeWidth={2.4} fill="none" />
      <circle cx={PRINCIPAL.cx} cy={PRINCIPAL.cy} r={PRINCIPAL.rIn} stroke="rgba(190, 216, 244, 0.6)" strokeWidth={2.4} fill="none" />

      <circle
        cx={FLUXO_PRINCIPAL.cx}
        cy={FLUXO_PRINCIPAL.cy}
        r={FLUXO_PRINCIPAL.r}
        fill="none"
        stroke={FLUXO}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={FLUXO_PRINCIPAL.dasharray}
        className={styles.fluxo}
      />

      {/* contorno tracejado: "em especificação agora", não pronto de catálogo */}
      <circle
        cx={PRINCIPAL.cx}
        cy={PRINCIPAL.cy}
        r={PRINCIPAL.rOut + 14}
        stroke="rgba(143, 203, 143, 0.55)"
        strokeWidth={1.4}
        strokeDasharray="3 6"
        fill="none"
      />

      {/* selo de verificado */}
      <circle cx={BADGE_X} cy={BADGE_Y} r={17} fill="#fff" stroke={ACCENT} strokeWidth={2} />
      <path
        d={`M${BADGE_X - 7} ${BADGE_Y} l4.5 4.5 l9.5 -9.5`}
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

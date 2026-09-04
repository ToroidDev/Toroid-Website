import type { ProdutoIcone } from "@/lib/produtos";

/**
 * Emblema do hero das páginas de família de produto: o núcleo toroidal
 * desenhado como corte técnico, não como ilustração. Anel de medição por fora,
 * enrolamento no anel, e no centro o detalhe que diferencia a família (condutor
 * atravessando no TC, degrau de tensão no TP, bobina no indutor). A variante
 * "toroidal" (derivações em anel) segue existindo para o hero da página que
 * explica a tecnologia em si, mesmo não sendo mais uma das 3 famílias.
 *
 * Determinístico e sem estado, então renderiza inteiro no servidor: zero JS no
 * bundle do cliente, que é requisito de performance do projeto.
 */

const SIZE = 400;
const C = SIZE / 2;

const R_DIAL_OUT = 176;
const R_DIAL_IN = 168;
const R_DIAL_IN_LONG = 162;
const R_TORUS_OUT = 150;
const R_TORUS_IN = 92;

const TICKS = 72;
const WINDINGS = 48;

const STROKE = "rgba(190, 216, 244, 0.55)";
const STROKE_FAINT = "rgba(190, 216, 244, 0.24)";
const ACCENT = "#8FCB8F";

function polar(radius: number, angle: number) {
  return [C + radius * Math.cos(angle), C + radius * Math.sin(angle)] as const;
}

const ticks = Array.from({ length: TICKS }, (_, i) => {
  const angle = (i / TICKS) * Math.PI * 2;
  const inner = i % 6 === 0 ? R_DIAL_IN_LONG : R_DIAL_IN;
  const [x1, y1] = polar(inner, angle);
  const [x2, y2] = polar(R_DIAL_OUT, angle);
  return { key: i, x1, y1, x2, y2, forte: i % 6 === 0 };
});

// O enrolamento é lido como densidade, não como fio contábil: 48 segmentos
// cruzando o anel bastam para o olho reconhecer o toroidal enrolado.
const windings = Array.from({ length: WINDINGS }, (_, i) => {
  const angle = (i / WINDINGS) * Math.PI * 2;
  const [x1, y1] = polar(R_TORUS_IN + 4, angle);
  const [x2, y2] = polar(R_TORUS_OUT - 4, angle);
  return { key: i, x1, y1, x2, y2 };
});

function DetalheTc() {
  return (
    <g>
      {/* condutor primário atravessando o núcleo, que é o que define um TC */}
      <path d={`M${C} 26V${C - R_TORUS_IN + 2}`} stroke={ACCENT} strokeWidth={7} strokeLinecap="round" />
      <path d={`M${C} ${C + R_TORUS_IN - 2}V${SIZE - 26}`} stroke={ACCENT} strokeWidth={7} strokeLinecap="round" />
      <circle cx={C} cy={C} r={26} stroke={ACCENT} strokeWidth={2} fill="none" opacity={0.5} />
    </g>
  );
}

function DetalheToroidal() {
  return (
    <g stroke={ACCENT} strokeWidth={6} strokeLinecap="round">
      {/* as duas derivações do secundário, mesma leitura do ícone da família */}
      <path d={`M40 ${C - 30}H${SIZE - 40}`} />
      <path d={`M40 ${C + 30}H${SIZE - 40}`} />
    </g>
  );
}

function DetalheTP() {
  return (
    <g stroke={ACCENT} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* barra de tensão de entrada e de saída, ligadas pela transição de nível */}
      <path d={`M${C - 70} ${C - 26}h30L${C + 40} ${C + 26}h30`} />
    </g>
  );
}

function DetalheIndutor() {
  const base = C + 4;
  return (
    <g stroke={ACCENT} strokeWidth={6} strokeLinecap="round" fill="none">
      <path d={`M${C - 74} ${base}h18`} />
      <path
        d={`M${C - 56} ${base}a14 14 0 0 1 28 0 14 14 0 0 1 28 0 14 14 0 0 1 28 0`}
      />
      <path d={`M${C + 56} ${base}h18`} />
    </g>
  );
}

function DetalheIsobox() {
  return (
    <g>
      {/* mesmo condutor do TC, mas com o pé de trilho DIN na base: o Isobox é
          um TC de linha padrão, pronto para montar, não uma família nova */}
      <path d={`M${C} 26V${C - R_TORUS_IN + 2}`} stroke={ACCENT} strokeWidth={7} strokeLinecap="round" />
      <path d={`M${C} ${C + R_TORUS_IN - 2}V${SIZE - 46}`} stroke={ACCENT} strokeWidth={7} strokeLinecap="round" />
      <circle cx={C} cy={C} r={26} stroke={ACCENT} strokeWidth={2} fill="none" opacity={0.5} />
      <g stroke={ACCENT} strokeWidth={6} strokeLinecap="round">
        <path d={`M${C - 30} ${SIZE - 30}H${C + 30}`} />
        <path d={`M${C - 20} ${SIZE - 30}V${SIZE - 16}`} />
        <path d={`M${C + 20} ${SIZE - 30}V${SIZE - 16}`} />
      </g>
    </g>
  );
}

const DETALHES: Record<ProdutoIcone, () => React.JSX.Element> = {
  tc: DetalheTc,
  toroidal: DetalheToroidal,
  indutor: DetalheIndutor,
  potencia: DetalheTP,
  isobox: DetalheIsobox,
};

export function PillarEmblem({ icone, className }: { icone: ProdutoIcone; className?: string }) {
  const Detalhe = DETALHES[icone];

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* anel de medição */}
      <circle cx={C} cy={C} r={R_DIAL_OUT} stroke={STROKE_FAINT} strokeWidth={1} fill="none" />
      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.forte ? STROKE : STROKE_FAINT}
          strokeWidth={t.forte ? 2 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* enrolamento sobre o anel */}
      {windings.map((w) => (
        <line
          key={w.key}
          x1={w.x1}
          y1={w.y1}
          x2={w.x2}
          y2={w.y2}
          stroke={STROKE_FAINT}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      ))}

      {/* corpo do núcleo */}
      <circle cx={C} cy={C} r={R_TORUS_OUT} stroke={STROKE} strokeWidth={2.2} fill="none" />
      <circle cx={C} cy={C} r={R_TORUS_IN} stroke={STROKE} strokeWidth={2.2} fill="none" />

      {/* cota do diâmetro interno, o dado que o projetista mede primeiro */}
      <g stroke={STROKE_FAINT} strokeWidth={1}>
        <path d={`M${C - R_TORUS_IN} ${C + 62}h${R_TORUS_IN * 2}`} />
        <path d={`M${C - R_TORUS_IN} ${C + 56}v12`} />
        <path d={`M${C + R_TORUS_IN} ${C + 56}v12`} />
      </g>

      <Detalhe />
    </svg>
  );
}

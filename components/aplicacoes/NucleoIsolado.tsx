import styles from "./NucleoIsolado.module.css";

/**
 * Emblema do hero das páginas de aplicação: o núcleo toroidal desenhado pelo que
 * o engenheiro de nobreak precisa ver, não como ilustração de produto.
 *
 * O desenho afirma três coisas verdadeiras e nada além delas:
 *  1. Isolação galvânica: primário (azul, à esquerda) e secundário (verde, à
 *     direita) são dois enrolamentos separados, com folga visível entre eles em
 *     cima e embaixo. Não existe caminho condutivo de um lado ao outro, e os
 *     terminais saem para lados opostos.
 *  2. Acoplamento só pelo núcleo: o fluxo circula DENTRO do anel. É a única
 *     coisa que atravessa a isolação.
 *  3. Campo contido: fora do anel o desenho é praticamente vazio, coerente com
 *     a baixíssima irradiação de campo da construção toroidal. Nada de linhas
 *     irradiando para fora, que diriam o oposto.
 *
 * Determinístico, sem estado e sem tempo em JS: renderiza inteiro no servidor e
 * a circulação do fluxo é só CSS. Zero JS no bundle do cliente, que é requisito
 * de performance do projeto. `prefers-reduced-motion` já é tratado globalmente
 * em globals.css, e o estado parado continua legível.
 */

const SIZE = 440;
const C = SIZE / 2;

const R_OUT = 150;
const R_IN = 92;
const R_LIMITE = 159;

const STROKE = "rgba(190, 216, 244, 0.55)";
const STROKE_FAINT = "rgba(190, 216, 244, 0.24)";
const FLUXO = "rgba(190, 216, 244, 0.46)";
const ACCENT = "#8FCB8F";

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

/** Espiras cruzando o anel, lidas como densidade e não como fio contábil. */
function enrolamento(de: number, ate: number, quantas: number) {
  return Array.from({ length: quantas }, (_, i) => {
    const deg = de + ((ate - de) * i) / (quantas - 1);
    const [x1, y1] = polar(R_IN + 5, deg);
    const [x2, y2] = polar(R_OUT - 5, deg);
    return { key: `${de}-${i}`, x1, y1, x2, y2 };
  });
}

/**
 * Terminal saindo da PONTA do enrolamento, curto e com ponto de conexão no fim.
 * Curto de propósito: terminal longo virava arco varrendo a composição e ligava
 * visualmente os dois lados, dizendo o contrário da isolação galvânica.
 */
function terminal(deg: number, xAlvo: number, yAlvo: number) {
  const [x, y] = polar(R_OUT - 8, deg);
  const cx = x + (xAlvo - x) * 0.45;
  const cy = y;
  return {
    d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${xAlvo} ${yAlvo}`,
    x: xAlvo,
    y: yAlvo,
  };
}

const PRIMARIO = enrolamento(128, 232, 23);
const SECUNDARIO = enrolamento(308, 412, 23);

// Terminais nas extremidades de cada enrolamento, apontando para fora.
const TERMINAIS_PRIMARIO = [terminal(232, 68, 84), terminal(128, 68, 356)];
const TERMINAIS_SECUNDARIO = [terminal(308, 372, 84), terminal(412, 372, 356)];

// Três anéis de fluxo dentro da coroa. Mesma direção (fluxo não circula em
// sentidos opostos), velocidades diferentes: a variação é o que faz a circulação
// parecer viva em vez de peça girando.
const ANEIS = [
  { r: 136, duracao: "42s", largura: 1.6 },
  { r: 121, duracao: "34s", largura: 2.2 },
  { r: 106, duracao: "27s", largura: 1.6 },
];

export function NucleoIsolado({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* limite do campo: onde a irradiação para fora deixa de existir */}
      <circle cx={C} cy={C} r={R_LIMITE} stroke={STROKE_FAINT} strokeWidth={1} fill="none" opacity={0.5} />

      {/* corpo do núcleo */}
      <circle cx={C} cy={C} r={R_OUT} stroke={STROKE} strokeWidth={2.2} fill="none" />
      <circle cx={C} cy={C} r={R_IN} stroke={STROKE} strokeWidth={2.2} fill="none" />

      {/* fluxo circulando dentro da coroa: o único acoplamento entre os lados */}
      {ANEIS.map(({ r, duracao, largura }) => {
        const perimetro = 2 * Math.PI * r;
        const traco = perimetro / 9;
        return (
          <circle
            key={r}
            cx={C}
            cy={C}
            r={r}
            fill="none"
            stroke={FLUXO}
            strokeWidth={largura}
            strokeLinecap="round"
            strokeDasharray={`${traco.toFixed(1)} ${traco.toFixed(1)}`}
            className={styles.fluxo}
            style={{ animationDuration: duracao }}
          />
        );
      })}

      {/* primário */}
      <g stroke={STROKE} strokeWidth={2.6} strokeLinecap="round">
        {PRIMARIO.map((s) => (
          <line key={s.key} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}
      </g>
      <g stroke={STROKE} strokeWidth={2.6} strokeLinecap="round" fill="none">
        {TERMINAIS_PRIMARIO.map((t) => (
          <path key={t.d} d={t.d} />
        ))}
      </g>
      <g fill={STROKE}>
        {TERMINAIS_PRIMARIO.map((t) => (
          <circle key={t.d} cx={t.x} cy={t.y} r={4} />
        ))}
      </g>

      {/* secundário: cor diferente porque é outro circuito, não outro estilo */}
      <g stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" opacity={0.9}>
        {SECUNDARIO.map((s) => (
          <line key={s.key} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}
      </g>
      <g stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" fill="none" opacity={0.9}>
        {TERMINAIS_SECUNDARIO.map((t) => (
          <path key={t.d} d={t.d} />
        ))}
      </g>
      <g fill={ACCENT} opacity={0.9}>
        {TERMINAIS_SECUNDARIO.map((t) => (
          <circle key={t.d} cx={t.x} cy={t.y} r={4} />
        ))}
      </g>
    </svg>
  );
}

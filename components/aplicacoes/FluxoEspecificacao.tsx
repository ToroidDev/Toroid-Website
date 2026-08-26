import { CircleDot, Cog, FileCheck2, Truck } from "lucide-react";
import styles from "./FluxoEspecificacao.module.css";

/**
 * Complementa "processo de especificação recorrente" do texto ao lado com o
 * próprio processo desenhado: 4 etapas fixas, ligadas por uma linha que
 * escorre da esquerda pra direita. Diferente das outras 3 páginas deste
 * lote (que usam BandaRegulacao/FaixaControle/FaixaEstabilidade, todas sobre
 * um fenômeno elétrico), aqui não há onda pra desenhar: a dor de abertura
 * desta página é de processo, não de característica técnica (ver aviso no
 * topo de page.tsx), então o gráfico também é de processo.
 *
 * `stroke-dashoffset` animado é a técnica mais barata que existe pra "fluxo
 * correndo numa linha": só desloca o padrão do traço, sem recalcular o path,
 * sem JS, compositável. `prefers-reduced-motion` desliga globalmente
 * (globals.css).
 */

const ETAPAS = [
  { Icon: CircleDot, titulo: "Especificação", texto: "Você envia os dados do projeto" },
  { Icon: Cog, titulo: "Dimensionamento", texto: "Engenharia calcula e propõe" },
  { Icon: FileCheck2, titulo: "Ensaio", texto: "Elétrico, documentado" },
  { Icon: Truck, titulo: "Embarque", texto: "Com rastreabilidade de lote" },
];

export function FluxoEspecificacao() {
  return (
    <div className={styles.quadro}>
      <div className={styles.linha} aria-hidden="true">
        <svg viewBox="0 0 100 4" preserveAspectRatio="none" className={styles.linhaSvg}>
          <line x1={0} y1={2} x2={100} y2={2} className={styles.linhaFundo} />
          <line x1={0} y1={2} x2={100} y2={2} className={styles.linhaFluxo} />
        </svg>
      </div>

      <ol className={styles.etapas}>
        {ETAPAS.map(({ Icon, titulo, texto }) => (
          <li key={titulo} className={styles.etapa}>
            <span className={styles.iconWrap} aria-hidden="true">
              <Icon size={18} strokeWidth={1.8} />
            </span>
            <span className={styles.etapaLegenda}>
              <p className={styles.etapaTitulo}>{titulo}</p>
              <p className={styles.etapaTexto}>{texto}</p>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Paginacao.module.css";

/**
 * Paginação da grade de /blog. Server Component puro: cada página é uma URL
 * de verdade (`/blog?page=3`), então o Google indexa o acervo inteiro e o
 * bundle do visitante não cresce um byte. A âncora `#artigos` faz o clique
 * aterrissar na grade, não no topo do hero.
 */

const RETICENCIAS = "…";

/** Sempre a primeira, a última e a janela de ±1 em volta da atual. O resto
 *  vira reticências, para a régua não crescer com o acervo. */
function paginasVisiveis(atual: number, total: number): Array<number | typeof RETICENCIAS> {
  const numeros = new Set<number>([1, total, atual - 1, atual, atual + 1]);
  const ordenadas = [...numeros].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  return ordenadas.flatMap((n, i) => {
    const anterior = ordenadas[i - 1];
    return anterior !== undefined && n - anterior > 1 ? [RETICENCIAS, n] : [n];
  });
}

function href(pagina: number): string {
  return pagina <= 1 ? "/blog#artigos" : `/blog?page=${pagina}#artigos`;
}

export function Paginacao({ paginaAtual, totalPaginas }: { paginaAtual: number; totalPaginas: number }) {
  if (totalPaginas <= 1) return null;

  const anterior = paginaAtual - 1;
  const proxima = paginaAtual + 1;

  return (
    <nav className={styles.nav} aria-label="Paginação dos artigos">
      {anterior >= 1 ? (
        <Link href={href(anterior)} className={styles.seta} rel="prev" aria-label="Página anterior">
          <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      ) : (
        <span className={`${styles.seta} ${styles.setaInativa}`} aria-hidden="true">
          <ChevronLeft size={18} strokeWidth={2.2} />
        </span>
      )}

      <ol className={styles.lista}>
        {paginasVisiveis(paginaAtual, totalPaginas).map((item, i) =>
          item === RETICENCIAS ? (
            <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              {RETICENCIAS}
            </li>
          ) : (
            <li key={item}>
              {item === paginaAtual ? (
                <span className={`${styles.pagina} ${styles.atual}`} aria-current="page">
                  {item}
                </span>
              ) : (
                <Link href={href(item)} className={styles.pagina} aria-label={`Página ${item}`}>
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
      </ol>

      {proxima <= totalPaginas ? (
        <Link href={href(proxima)} className={styles.seta} rel="next" aria-label="Próxima página">
          <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      ) : (
        <span className={`${styles.seta} ${styles.setaInativa}`} aria-hidden="true">
          <ChevronRight size={18} strokeWidth={2.2} />
        </span>
      )}
    </nav>
  );
}

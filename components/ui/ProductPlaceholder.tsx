import type { Produto } from "@/lib/produtos";
import { InstitutionalPattern } from "./InstitutionalPattern";
import { ProdutoIconeSvg } from "./ProductIcons";
import styles from "./ProductPlaceholder.module.css";

/**
 * Placeholder orientado a dados: mostra qual produto vai entrar naquele
 * espaço (pattern institucional + ícone da família + nome) até a Fase 3
 * trocar `produto.imagem` pela foto real do WordPress.
 */
export function ProductPlaceholder({ produto }: { produto: Produto }) {
  return (
    <div className={styles.placeholder}>
      <InstitutionalPattern opacity={0.55} className={styles.pattern} />
      <ProdutoIconeSvg icone={produto.icone} size={56} className={styles.icon} />
      <span className={styles.label}>{produto.nome}</span>
    </div>
  );
}

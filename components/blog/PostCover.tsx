import Image from "next/image";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { decodificarEntidades, type TemaId } from "@/lib/blog";
import type { WPImagem } from "@/lib/wordpress";
import styles from "./PostCover.module.css";

/**
 * Capa de um card de post. Metade do acervo real não tem imagem destacada no
 * WordPress (26 dos 64 têm, confirmado via curl em 2026-08-28), e um card
 * vazio ao lado de um card com foto quebra a grade inteira. Sem imagem, a capa
 * vira uma placa azul com o pattern institucional: continua sendo cor e
 * matéria de marca, não um retângulo cinza de "imagem faltando".
 *
 * `alt` do WordPress vem quase sempre vazio nesse acervo, então o título do
 * post é o texto alternativo real. A placa sem imagem é decorativa e não
 * carrega texto algum, por isso fica fora da árvore de acessibilidade.
 */
export function PostCover({
  imagem,
  titulo,
  tema,
  variante,
  sizes,
  priority = false,
}: {
  imagem: WPImagem | null;
  titulo: string;
  tema: TemaId;
  /** Id do post: escolhe o enquadramento do pattern na placa sem foto, para
   *  dois cards do mesmo tema não saírem idênticos (ver PostCover.module.css). */
  variante: number;
  sizes: string;
  priority?: boolean;
}) {
  if (imagem) {
    return (
      <Image
        src={imagem.url}
        alt={imagem.alt || decodificarEntidades(titulo)}
        fill
        sizes={sizes}
        priority={priority}
        className={styles.imagem}
      />
    );
  }

  return (
    <div className={`${styles.placa} ${styles[tema]}`} aria-hidden="true">
      <InstitutionalPattern
        opacity={0.2}
        stroke="#9FC2EA"
        className={`${styles.pattern} ${styles[`v${Math.abs(variante) % 4}` as "v0" | "v1" | "v2" | "v3"]}`}
      />
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dataISO, formatarData, temaDoPost } from "@/lib/blog";
import type { PostResumo } from "@/lib/wordpress";
import { PostCover } from "./PostCover";
import { TemaChip } from "./TemaChip";
import styles from "./PostCard.module.css";

export function PostCard({ post }: { post: PostResumo }) {
  const tema = temaDoPost(post.titulo);

  return (
    <article className={styles.card}>
      <Link href={`/blog/${post.slug}`} className={styles.link}>
        <div className={styles.capa}>
          <PostCover
            imagem={post.imagemDestaque}
            titulo={post.titulo}
            tema={tema.id}
            variante={post.id}
            sizes="(min-width: 1000px) 360px, (min-width: 640px) 46vw, 100vw"
          />
          <span className={styles.capaChip}>
            <TemaChip tema={tema} tone="dark" />
          </span>
        </div>

        <div className={styles.corpo}>
          <time className={styles.data} dateTime={dataISO(post.publicadoEm)}>
            {formatarData(post.publicadoEm)}
          </time>
          <h3 className={styles.titulo} dangerouslySetInnerHTML={{ __html: post.titulo }} />
          <div className={styles.resumo} dangerouslySetInnerHTML={{ __html: post.resumoHtml }} />
          <span className={styles.cta}>
            Ler artigo
            <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

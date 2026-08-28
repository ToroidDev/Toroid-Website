import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { dataISO, formatarData, temaDoPost } from "@/lib/blog";
import type { PostResumo } from "@/lib/wordpress";
import { PostCover } from "./PostCover";
import { TemaChip } from "./TemaChip";
import styles from "./PostDestaque.module.css";

/**
 * Abertura da listagem: o post mais recente aberto na coluna principal (capa,
 * etiqueta, data, título, resumo e CTA) e as três leituras seguintes numa
 * coluna lateral compacta.
 *
 * O bloco só existe na primeira página (ver app/blog/page.tsx): a partir da
 * página 2 o visitante já está navegando o acervo, e repetir os mesmos quatro
 * posts no topo empurraria a grade para fora da tela em toda paginação.
 */
export function PostDestaque({ destaque, sugestoes }: { destaque: PostResumo; sugestoes: PostResumo[] }) {
  const tema = temaDoPost(destaque.titulo);

  return (
    <section className={styles.section} aria-labelledby="blog-destaque">
      <div className={styles.inner}>
        <h2 id="blog-destaque" className={styles.rotuloOculto}>
          Leituras em destaque
        </h2>

        <div className={styles.grid}>
          <article className={styles.destaque}>
            <Link href={`/blog/${destaque.slug}`} className={styles.destaqueLink}>
              <div className={styles.capa}>
                <PostCover
                  imagem={destaque.imagemDestaque}
                  titulo={destaque.titulo}
                  tema={tema.id}
                  variante={destaque.id}
                  sizes="(min-width: 1040px) 620px, (min-width: 700px) 92vw, 100vw"
                  priority
                />
                <span className={styles.capaChip}>
                  <TemaChip tema={tema} tone="dark" />
                </span>
              </div>

              <div className={styles.corpo}>
                <p className={styles.meta}>
                  <span className={styles.marcador}>Mais recente</span>
                  <span className={styles.metaSep} aria-hidden="true">
                    ·
                  </span>
                  <time dateTime={dataISO(destaque.publicadoEm)}>{formatarData(destaque.publicadoEm)}</time>
                </p>

                <h3
                  className={styles.destaqueTitulo}
                  dangerouslySetInnerHTML={{ __html: destaque.titulo }}
                />
                <div
                  className={styles.destaqueResumo}
                  dangerouslySetInnerHTML={{ __html: destaque.resumoHtml }}
                />

                <span className={styles.destaqueCta}>
                  Ler artigo
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </article>

          <aside className={styles.lateral} aria-label="Leia também">
            <p className={styles.lateralTitulo}>
              <span className={styles.lateralRule} aria-hidden="true" />
              Leia também
            </p>

            <ol className={styles.lista}>
              {sugestoes.map((post, i) => {
                const temaSugestao = temaDoPost(post.titulo);
                return (
                  <li key={post.id} className={styles.item}>
                    <Link href={`/blog/${post.slug}`} className={styles.itemLink}>
                      <span className={styles.numero} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.itemCorpo}>
                        <TemaChip tema={temaSugestao} />
                        <span className={styles.itemTitulo} dangerouslySetInnerHTML={{ __html: post.titulo }} />
                        <time className={styles.itemData} dateTime={dataISO(post.publicadoEm)}>
                          {formatarData(post.publicadoEm)}
                        </time>
                      </span>
                      <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" className={styles.itemSeta} />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}

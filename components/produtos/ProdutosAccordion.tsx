import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { produtos } from "@/lib/produtos";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { ProdutoIconeSvg } from "@/components/ui/ProductIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ProdutosAccordion.module.css";

/**
 * Variante em accordion da listagem de produtos, exclusiva da rota /produtos
 * (a home continua usando o grid de `components/sections/Produtos.tsx`).
 * Expansão por CSS (:hover), sem JS: o primeiro item vem expandido por
 * padrão via `:not(:hover)`, e no mobile o accordion vira lista empilhada,
 * já que não há hover em toque.
 */
export function ProdutosAccordion() {
  return (
    <section id="produtos" className={styles.section}>
      <InstitutionalPattern opacity={0.06} className={styles.pattern} />
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Produtos"
          lead="Busca transformadores? Consulte a Toroid do Brasil."
        >
          Três famílias, todas projetadas sob medida.
        </SectionHeading>

        <Link href="/transformadores-toroidais" className={styles.toroidalLink}>
          Conheça a tecnologia por trás do núcleo toroidal, presente nas três famílias
          <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
        </Link>

        <div className={styles.accordion}>
          {produtos.map((produto) => (
            <Link key={produto.id} href={produto.href} className={styles.item}>
              {produto.imagem ? (
                <Image
                  src={produto.imagem}
                  alt={produto.nome}
                  fill
                  sizes="(min-width: 700px) 60vw, 100vw"
                  className={styles.image}
                />
              ) : (
                <ProductPlaceholder produto={produto} />
              )}
              <span className={styles.badge} aria-hidden="true">
                <ProdutoIconeSvg icone={produto.icone} size={20} />
              </span>
              <div className={styles.overlay}>
                <h3 className={styles.title}>{produto.nome}</h3>
                <p className={styles.text}>{produto.descricaoCurta}</p>
                <span className={styles.link}>
                  Ver especificações
                  <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { produtos } from "@/lib/produtos";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { ProdutoIconeSvg } from "@/components/ui/ProductIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Produtos.module.css";

export function Produtos() {
  return (
    <section id="produtos" className={styles.section}>
      <InstitutionalPattern opacity={0.06} className={styles.pattern} />
      <div className={styles.inner}>
        <SectionHeading eyebrow="Produtos">Três famílias, todas projetadas sob medida.</SectionHeading>

        <div className={styles.grid}>
          {produtos.map((produto) => (
            <Link key={produto.id} href={produto.href} className={styles.card}>
              <div className={styles.cardImage}>
                {/* Fase 3: quando `produto.imagem` existir, troca para next/image aqui sem mudar marcação. */}
                <ProductPlaceholder produto={produto} />
                <span className={styles.cardBadge} aria-hidden="true">
                  <ProdutoIconeSvg icone={produto.icone} size={20} />
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{produto.nome}</h3>
                <p className={styles.cardText}>{produto.descricaoCurta}</p>
                <span className={styles.cardLink}>
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

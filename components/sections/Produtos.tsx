import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { produtos } from "@/lib/produtos";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { ProdutoIconeSvg } from "@/components/ui/ProductIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/i18n/T";
import styles from "./Produtos.module.css";

export function Produtos() {
  return (
    <section id="produtos" className={styles.section}>
      <InstitutionalPattern opacity={0.06} className={styles.pattern} />
      <div className={styles.inner}>
        <SectionHeading eyebrow={<T pt="Produtos" es="Productos" en="Products" />}>
          <T
            pt="Linha padrão e projetos sob medida."
            es="Línea estándar y proyectos a medida."
            en="Standard line and custom-engineered projects."
          />
        </SectionHeading>

        <Link href="/transformadores-toroidais" className={styles.toroidalLink}>
          <T
            pt="Conheça a tecnologia por trás do núcleo toroidal, presente em toda a linha"
            es="Conozca la tecnología detrás del núcleo toroidal, presente en toda la línea"
            en="See the technology behind the toroidal core, present across the line"
          />
          <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
        </Link>

        <div className={styles.grid}>
          {produtos.map((produto) => (
            <Link key={produto.id} href={produto.href} className={styles.card}>
              <div className={styles.cardImage}>
                {produto.imagem ? (
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
                    className={styles.cardImg}
                  />
                ) : (
                  <ProductPlaceholder produto={produto} />
                )}
                <span className={styles.cardBadge} aria-hidden="true">
                  <ProdutoIconeSvg icone={produto.icone} size={20} />
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{produto.nome}</h3>
                <p className={styles.cardText}>{produto.descricaoCurta}</p>
                <span className={styles.cardLink}>
                  <T pt="Ver especificações" es="Ver especificaciones" en="View specifications" />
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

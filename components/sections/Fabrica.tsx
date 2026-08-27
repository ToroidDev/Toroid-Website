import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAnosDeMercado } from "@/lib/institucional";
import { produtos } from "@/lib/produtos";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/i18n/T";
import styles from "./Fabrica.module.css";

// Só 3 produtos reais: duas cópias (a técnica clássica de -50%) ficam mais
// estreitas que a viewport em monitores largos, e o carrossel "acaba" antes
// de reiniciar. Seis cópias (três por metade) cobrem telas largas comuns
// sem quebrar a matemática do loop (a metade continua sendo exatamente 50%
// da largura total, então o -50% → 0% continua sem salto).
const MARQUEE_REPETICOES = 6;
const marqueeItems = Array.from({ length: MARQUEE_REPETICOES }, () => produtos).flat();

export function Fabrica() {
  return (
    <section id="fabrica" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow={<T pt="Fabricação própria" es="Fabricación propia" en="In-house manufacturing" />}
          lead={
            <T
              pt="Bobinagem, encapsulamento e teste elétrico feitos em São José dos Pinhais, com rastreabilidade de lote e sistema de gestão certificado. Atendemos empresas líderes globais dos setores elétrico e industrial."
              es="Bobinado, encapsulado y prueba eléctrica realizados en São José dos Pinhais, con trazabilidad de lote y sistema de gestión certificado. Atendemos a empresas líderes globales de los sectores eléctrico e industrial."
              en="Winding, encapsulation and electrical testing done in São José dos Pinhais, with batch traceability and a certified management system. We supply global leaders in the electrical and industrial sectors."
            />
          }
        >
          <T pt="Há " es="Hace " en="" />
          <span className={styles.headingAccent}>
            {getAnosDeMercado()} <T pt="anos" es="años" en="years" />
          </span>
          <T
            pt=" transformando energia e vidas."
            es=" transformando energía y vidas."
            en=" transforming energy and lives."
          />
        </SectionHeading>

        <div className={styles.mosaic}>
          <figure className={`${styles.tile} ${styles.tileMain}`}>
            <Image
              src="/images/fabrica-interna-tratada.webp"
              alt="Vista do chão de fábrica da Toroid, com postos de bobinagem e montagem em operação"
              fill
              sizes="(min-width: 860px) 60vw, 100vw"
              className={styles.tileImg}
            />
            {/* <div className={styles.tileOverlay} /> */}
            <figcaption className={styles.tileCaption}>
              
            </figcaption>
          </figure>

          <figure className={styles.tile}>
            <Image
              src="/images/bobinando.webp"
              alt="Operador bobinando um núcleo toroidal na fábrica da Toroid"
              fill
              sizes="(min-width: 860px) 38vw, 100vw"
              className={styles.tileImg}
            />
            {/* <div className={styles.tileOverlay} /> */}
            <figcaption className={styles.tileCaption}>
              
            </figcaption>
          </figure>

          <figure className={styles.tile}>
            <Image
              src="/images/fachada-placa.webp"
              alt="Placa na fachada da fábrica com a marca Toroid e a inscrição Desde 1994 no Brasil"
              fill
              sizes="(min-width: 860px) 38vw, 100vw"
              className={styles.tileImg}
            />
            <div className={styles.tileOverlay} />
            <figcaption className={styles.tileCaption}>
              <T pt="Desde 1994 no Brasil." es="Desde 1994 en Brasil." en="In Brazil since 1994." />
            </figcaption>
          </figure>
        </div>

        <Link href="/capacidade-fabril" className={styles.capacidadeLink}>
          <T
            pt="Da matéria-prima ao teste elétrico: conheça nossa capacidade fabril"
            es="De la materia prima a la prueba eléctrica: conozca nuestra capacidad fabril"
            en="From raw material to electrical testing: see our manufacturing capability"
          />
          <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>

      <div className={styles.marqueeWrapper}>
        <div className={styles.track}>
          {marqueeItems.map((produto, index) => {
            const duplicado = index >= produtos.length;
            return (
              <Link
                key={`${produto.id}-${index}`}
                href={produto.href}
                className={styles.figure}
                aria-hidden={duplicado}
                tabIndex={duplicado ? -1 : undefined}
              >
                <figure>
                  {produto.imagem ? (
                    <Image
                      src={produto.imagem}
                      alt={produto.nome}
                      fill
                      sizes="344px"
                      className={styles.figImg}
                    />
                  ) : (
                    <ProductPlaceholder produto={produto} />
                  )}
                  <figcaption className={styles.figCaption}>
                    <span className={styles.figTitle}>{produto.nome}</span>
                    <span className={styles.figSubtitle}>{produto.resumo}</span>
                  </figcaption>
                </figure>
              </Link>
            );
          })}
        </div>
        <div className={styles.edgeFadeLeft} aria-hidden="true" />
        <div className={styles.edgeFadeRight} aria-hidden="true" />
      </div>

      {/* A faixa de "Certificações e conformidade" que ficava aqui foi removida:
          repetia ISO 9001 / RoHS que a faixa de prova no topo da página já
          declara. Era a terceira aparição da mesma informação na mesma página. */}
    </section>
  );
}

import Image from "next/image";
import { ClipboardCheck, MapPin, Ruler } from "lucide-react";
import { getAnosDeMercado } from "@/lib/institucional";
import { produtos } from "@/lib/produtos";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Fabrica.module.css";

const STATS = [
  {
    value: "100%",
    texto: "das peças ensaiadas eletricamente antes do embarque",
    icon: ClipboardCheck,
  },
  {
    value: "Projeto técnico gratuito",
    texto: "dimensionamento incluído no orçamento, sem custo adicional",
    icon: Ruler,
  }
];

// duas cópias para o loop contínuo (translateX 0 → -50% do keyframe toroidMarquee)
const marqueeItems = [...produtos, ...produtos];

export function Fabrica() {
  return (
    <section id="fabrica" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Fabricação própria"
          lead="Bobinagem, encapsulamento e ensaio elétrico feitos na planta de São José dos Pinhais, com rastreabilidade de lote e sistema de gestão certificado."
        >
          Há <span className={styles.headingAccent}>{getAnosDeMercado()} anos</span> transformando energia e vidas.
        </SectionHeading>

        <div className={styles.mosaic}>
          <figure className={`${styles.tile} ${styles.tileMain}`}>
            <Image
              src="/images/fabrica-interna.webp"
              alt="Vista do chão de fábrica da Toroid, com postos de bobinagem e montagem em operação"
              fill
              sizes="(min-width: 860px) 60vw, 100vw"
              className={styles.tileImg}
            />
            <div className={styles.tileOverlay} />
            <figcaption className={styles.tileCaption}>
              Bobinagem, encapsulamento e ensaio elétrico sob o mesmo teto, em São José dos Pinhais.
            </figcaption>
          </figure>

          <figure className={styles.tile}>
            <Image
              src="/images/fabrica.jpg"
              alt="Operador bobinando um núcleo toroidal na fábrica da Toroid"
              fill
              sizes="(min-width: 860px) 38vw, 100vw"
              className={styles.tileImg}
            />
            <div className={styles.tileOverlay} />
            <figcaption className={styles.tileCaption}>
              Bobinagem acompanhada por operador em todas as etapas, não só na inspeção final.
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
            <figcaption className={styles.tileCaption}>Desde 1994 no Brasil.</figcaption>
          </figure>
        </div>

        {/* <div className={styles.stats}>
          {STATS.map(({ value, texto, icon: Icon }) => (
            <div key={value} className={styles.statCard}>
              <span className={styles.statIcon} aria-hidden="true">
                <Icon size={19} strokeWidth={1.8} />
              </span>
              <p className={styles.statValue}>{value}</p>
              <p className={styles.statText}>{texto}</p>
            </div>
          ))}
        </div> */}
      </div>

      <div className={styles.marqueeWrapper}>
        <div className={styles.track}>
          {marqueeItems.map((produto, index) => (
            <figure key={`${produto.id}-${index}`} className={styles.figure} aria-hidden={index >= produtos.length}>
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
          ))}
        </div>
        <div className={styles.edgeFadeLeft} aria-hidden="true" />
        <div className={styles.edgeFadeRight} aria-hidden="true" />
      </div>

      {/* A faixa de "Certificações e conformidade" que ficava aqui foi removida:
          repetia ISO 9001 / ESG / RoHS que a faixa de prova no topo da página já
          declara, e as imagens dos selos seguem no footer. Era a terceira aparição
          da mesma informação na mesma página. */}
    </section>
  );
}

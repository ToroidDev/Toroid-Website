import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAnosDeMercado } from "@/lib/institucional";
import styles from "./Historia.module.css";

const LINHA_DO_TEMPO = [
  { ano: "1994", marco: "Fundação em São José dos Pinhais, PR: uma máquina, três pessoas." },
  { ano: "2004", marco: "Mudança para uma nova sede de aproximadamente 600 m²." },
  { ano: "2016", marco: "Mudança para a sede atual, de aproximadamente 1.600 m², onde a fábrica opera hoje." },
];

const NUMEROS = [
  { valor: "~80", rotulo: "colaboradores" },
  { valor: "+3.000", rotulo: "clientes atendidos" },
  { valor: "+18.000", rotulo: "projetos entregues" },
  { valor: "+1,5 milhão", rotulo: "produtos fabricados" },
];

// `position: relative` de propósito, não sticky: é o fluxo normal desta seção
// subindo por cima do hero (sticky, ver QuemSomosHero.module.css) que produz
// o efeito de cartão deslizando sobre o azul.
export function Historia() {
  const anos = getAnosDeMercado();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            Nossa história
          </p>
          <h2 className={styles.heading}>Trajetória de inovação e qualidade desde 1994</h2>
          <p className={styles.lead}>
            Localizada em São José dos Pinhais, PR, a Toroid do Brasil fabrica transformadores e indutores desde
            1994. Começou como um projeto ambicioso: uma única máquina, três pessoas. Hoje, {anos}{" "}
            anos depois, é uma planta com bobinagem, encapsulamento e teste elétrico sob o mesmo teto, com
            rastreabilidade de lote e sistema de gestão certificado.
          </p>

          <ol className={styles.timeline}>
            {LINHA_DO_TEMPO.map(({ ano, marco }) => (
              <li key={ano} className={styles.timelineItem}>
                <span className={styles.timelineAno}>{ano}</span>
                <span className={styles.timelineMarco}>{marco}</span>
              </li>
            ))}
          </ol>

          <p className={styles.nota}>
            A Toroid do Brasil nasceu em 1994, com uma máquina e três pessoas, como parte de um grupo com raízes na
            engenharia sueca. A expertise construída desde então é o que sustenta cada projeto que sai da fábrica hoje.
          </p>
        </div>

        {/* Fotos de ofício, não de fachada/planta: a linha do tempo logo abaixo
            já mostra as sedes e o chão de fábrica em tela cheia, e repetir as
            mesmas imagens a poucos pixels de distância enfraquecia as duas. */}
        <div className={styles.media}>
          <figure className={`${styles.tile} ${styles.tileMain}`}>
            <Image
              src="/images/bobinando.webp"
              alt="Operador bobinando um núcleo toroidal na fábrica da Toroid"
              fill
              sizes="(min-width: 900px) 40vw, 100vw"
              className={styles.tileImg}
            />
          </figure>
          <figure className={styles.tile}>
            <Image
              src="/images/nucleo.webp"
              alt="Núcleo toroidal em processo de fabricação na planta da Toroid"
              fill
              sizes="(min-width: 900px) 40vw, 100vw"
              className={styles.tileImg}
            />
          </figure>
        </div>

        <div className={styles.numeros}>
          {NUMEROS.map(({ valor, rotulo }) => (
            <div key={rotulo} className={styles.numero}>
              <span className={styles.numeroValor}>{valor}</span>
              <span className={styles.numeroRotulo}>{rotulo}</span>
            </div>
          ))}
        </div>

        <Link href="/capacidade-fabril" className={styles.capacidadeLink}>
          Conheça nossa capacidade fabril, da matéria-prima ao teste elétrico
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

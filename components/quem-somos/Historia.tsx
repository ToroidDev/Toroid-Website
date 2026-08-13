import Image from "next/image";
import { getAnosDeMercado } from "@/lib/institucional";
import styles from "./Historia.module.css";

const LINHA_DO_TEMPO = [
  { ano: "1994", marco: "Fundação em São José dos Pinhais, PR — uma máquina, três pessoas, uma garagem." },
  { ano: "2004", marco: "Mudança para uma sede própria de aproximadamente 600 m²." },
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
            1994. Começou como um projeto ambicioso: uma única máquina, três pessoas, em uma garagem. Hoje, {anos}{" "}
            anos depois, é uma planta com bobinagem, encapsulamento e ensaio elétrico sob o mesmo teto, com
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
            A Toroid do Brasil nasceu em 1994, em uma garagem, com uma máquina e três pessoas — parte de um grupo com
            raízes na engenharia sueca.
          </p>
        </div>

        <div className={styles.media}>
          <figure className={`${styles.tile} ${styles.tileMain}`}>
            <Image
              src="/images/fachada-placa.webp"
              alt="Placa na fachada da fábrica da Toroid com a inscrição Desde 1994 no Brasil"
              fill
              sizes="(min-width: 900px) 40vw, 100vw"
              className={styles.tileImg}
            />
          </figure>
          <figure className={styles.tile}>
            <Image
              src="/images/fabrica-interna.webp"
              alt="Vista do chão de fábrica da Toroid, com postos de bobinagem e montagem em operação"
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
      </div>
    </section>
  );
}

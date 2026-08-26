"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { getAnosDeMercado } from "@/lib/institucional";
import styles from "./LinhaDoTempo.module.css";

const MARCOS = [
  {
    ano: "1994",
    titulo: "A fundação",
    texto:
      "O engenheiro sueco Lars Christian Ennerfelt Schnock, irmão de Gunnar Ennerfelt, funda a Toroid do Brasil em São José dos Pinhais, PR.",
    imagem: "/images/casamadeiratoroid.webp",
    alt: "Primeira sede da Toroid do Brasil, uma casa de madeira em São José dos Pinhais, PR",
  },
  {
    ano: "1994",
    titulo: "A primeira máquina",
    texto:
      "Uma única máquina de enrolar toroides, com capacidade de até 100 VA, e uma equipe de três pessoas. Todo transformador saía dali.",
    imagem: "/images/primeiramaquina.webp",
    alt: "Operador enrolando toroides na primeira máquina da Toroid do Brasil, nos anos 1990",
  },
  {
    ano: "2004",
    titulo: "Nova sede",
    texto:
      "Dez anos depois, a operação muda para uma sede de aproximadamente 600 m², com espaço para mais máquinas de enrolamento.",
    imagem: "/images/fachada-placa.webp",
    alt: "Placa institucional na fachada da fábrica da Toroid, com a inscrição Desde 1994 no Brasil",
  },
  {
    ano: "2016",
    titulo: "A planta atual",
    texto:
      "Mudança para a sede atual, de aproximadamente 1.600 m².",
    imagem: "/images/sedetratada.webp",
    alt: "Fachada da sede atual da Toroid do Brasil, em São José dos Pinhais, PR",
  },
  {
    ano: "Hoje",
    titulo: "Engenharia aplicada, em escala",
    texto:
      "Cerca de 80 colaboradores, mais de 18.000 projetos entregues e mais de 1,5 milhão de produtos fabricados, com rastreabilidade de lote e sistema de gestão certificado. Da primeira máquina até aqui, o crescimento nunca parou.",
    imagem: "/images/fabrica-interna-tratada.webp",
    alt: "Vista do chão de fábrica da Toroid, com postos de bobinagem e montagem em operação",
  },
];

// Painéis full-viewport que correm na horizontal conforme a página rola na
// vertical. Duas decisões que valem registro:
//
// 1. Sem biblioteca de animação. O efeito "scrub" suave que se espera de um
//    GSAP/ScrollTrigger aqui é um lerp de ~15 linhas (ver `tick`): o alvo vem
//    do scroll, e o valor aplicado persegue esse alvo quadro a quadro, o que
//    produz a inércia sem os ~35 kB de JS que GSAP+ScrollTrigger adicionariam
//    ao bundle do cliente. Performance é requisito do projeto, não sugestão
//    (ver CLAUDE.md), e o ganho visual de uma lib aqui seria zero.
// 2. `translate3d` em vez de `translateX`, e a leitura de layout (`medir`)
//    fora do rAF de pintura: mantém a animação no compositor e evita
//    thrash de layout a cada quadro.
//
// Sem JS ou com `prefers-reduced-motion: reduce`, a classe `.pinned` nunca é
// aplicada: os painéis viram uma fileira de scroll horizontal nativo, sem pin
// e sem sequestro de scroll.
export function LinhaDoTempo() {
  const anos = getAnosDeMercado();
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barraRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const barra = barraRef.current;
    if (!wrap || !track || !barra) return;

    let maxTranslate = 0;
    let percurso = 0;
    let folga = 0;
    let alvo = 0;
    let atual = 0;
    let rafId: number | null = null;
    let pinAtivo = false;

    function medir() {
      // O recuo lateral do track (metade do que falta para a viewport, ver CSS)
      // faz translate 0 nascer com o primeiro cartão centralizado e
      // `maxTranslate` terminar com o último centralizado.
      maxTranslate = Math.max(0, track!.scrollWidth - window.innerWidth);
      // Percurso um pouco menor que o deslocamento total: a passagem entre
      // cartões fica ágil em vez de exigir uma tela cheia de scroll por cartão.
      percurso = Math.max(maxTranslate * 0.85, 1);
      // Folga parada antes e depois do percurso: a seção prende, o primeiro
      // cartão fica centralizado e imóvel por um trecho de scroll, e o mesmo
      // acontece com o último antes de a seção soltar. Sem isso a fileira já
      // entrava correndo e saía correndo, e ver a primeira e a última foto
      // exigia dosar o scroll no meio da transição.
      folga = Math.round(window.innerHeight * 0.62);
      wrap!.style.height = `${window.innerHeight + folga + percurso + folga}px`;
    }

    function pintar() {
      track!.style.transform = `translate3d(${-atual}px, 0, 0)`;
      barra!.style.transform = `scaleX(${maxTranslate > 0 ? atual / maxTranslate : 0})`;
    }

    function tick() {
      atual += (alvo - atual) * 0.11;
      if (Math.abs(alvo - atual) < 0.2) atual = alvo;
      pintar();
      rafId = atual === alvo ? null : requestAnimationFrame(tick);
    }

    // Desconta a folga de entrada antes de dividir pelo percurso: enquanto o
    // scroll está dentro dela o progresso é 0 (primeiro cartão parado no
    // centro), e depois do percurso satura em 1 (último parado no centro).
    function progressoAtual() {
      if (percurso <= 0) return 0;
      const rolado = -wrap!.getBoundingClientRect().top - folga;
      return Math.min(1, Math.max(0, rolado / percurso));
    }

    function onScroll() {
      alvo = progressoAtual() * maxTranslate;
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    function ativarPin() {
      // `.pinned` ANTES de medir, não depois: é essa classe que define a
      // largura do cartão e o recuo lateral do track. Medindo primeiro, o
      // scrollWidth lido era o da fileira do modo carrossel, `maxTranslate`
      // saía errado e os últimos cartões nunca chegavam a entrar na tela.
      wrap!.classList.add(styles.pinned);
      pinAtivo = true;
      medir();
      // Primeiro quadro sem inércia: se a página abrir já rolada (âncora, volta
      // do histórico), o painel certo precisa estar posicionado, não animando
      // desde o começo.
      atual = alvo = progressoAtual() * maxTranslate;
      pintar();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    function desativarPin() {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      wrap!.classList.remove(styles.pinned);
      wrap!.style.height = "";
      track!.style.transform = "";
      barra!.style.transform = "";
      pinAtivo = false;
    }

    // Duas experiências deliberadamente diferentes, não uma degradada: no
    // desktop, painéis pinados com scrub por scroll vertical; no toque, scroll
    // horizontal nativo com scroll-snap (ver CSS). Traduzir scroll vertical em
    // horizontal no celular deixava o visitante parar no meio de uma
    // transição, com o texto cortado entre dois painéis, e ainda pagava JS de
    // scroll no aparelho mais fraco. O snap nativo alinha sempre.
    function devePinar() {
      return (
        window.matchMedia("(min-width: 761px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }

    function avaliar() {
      const quer = devePinar();
      if (quer && !pinAtivo) ativarPin();
      else if (!quer && pinAtivo) desativarPin();
      else if (quer && pinAtivo) {
        medir();
        onScroll();
      }
    }

    avaliar();
    window.addEventListener("resize", avaliar);

    return () => {
      window.removeEventListener("resize", avaliar);
      desativarPin();
    };
  }, []);

  return (
    <section className={styles.wrap} ref={wrapRef} aria-label="Linha do tempo da Toroid do Brasil">
      <div className={styles.sticky}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            Linha do tempo
          </p>
          <h2 className={styles.heading}>
            De uma máquina a uma fábrica, em {anos} anos
          </h2>
        </div>

        <div className={styles.viewport}>
          <ol className={styles.track} ref={trackRef}>
            {MARCOS.map((marco, i) => (
              <li key={`${marco.ano}-${marco.titulo}`} className={styles.painel}>
                <Image
                  src={marco.imagem}
                  alt={marco.alt}
                  fill
                  sizes="(min-width: 1475px) 1180px, (min-width: 761px) 80vw, 90vw"
                  priority={i === 0}
                  className={styles.painelImg}
                />
                <div className={styles.painelVeu} aria-hidden="true" />

                <div className={styles.painelConteudo}>
                  <span className={styles.painelAno}>{marco.ano}</span>
                  <h3 className={styles.painelTitulo}>{marco.titulo}</h3>
                  <p className={styles.painelTexto}>{marco.texto}</p>
                </div>

                <span className={styles.painelIndice} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} / {String(MARCOS.length).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.progresso} aria-hidden="true">
          <span className={styles.progressoBarra} ref={barraRef} />
        </div>
      </div>
    </section>
  );
}

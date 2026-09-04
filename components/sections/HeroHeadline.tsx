"use client";

import { useEffect, useState } from "react";
import { T } from "@/components/i18n/T";
import styles from "./Hero.module.css";

type Texto = { pt: string; es: string; en: string };

interface Frase {
  before: Texto;
  accent: Texto;
  after: Texto;
  // Frase de valor que resolve a dor acima, tirada da mesma taxonomia de
  // proposta de valor que o comercial usa internamente (Performance /
  // Projeto / Negócio). Fica no mesmo parágrafo do CTA de autoridade fixo,
  // logo antes dele, com a mesma tipografia — só a ordem separa os dois.
  beneficio: Texto;
}

// Dores do playbook, na ordem trazida pelo comercial (reunião sobre o hero),
// cada uma resolvida pelo mesmo benefício técnico já publicado em
// components/sections/Segmentos.tsx — nenhuma alegação nova, só reorganizada
// no template que já existia aqui ("X não deveria comprometer Y"). A última
// frase é a que já era o H1 antes desta rotação, mantida sem alteração: é o
// que garante que a primeira pintura da página (LCP) não muda de conteúdo,
// só passa a girar depois de montado.
const FRASES: Frase[] = [
  {
    before: {
      pt: "Ruído elétrico excessivo não deveria comprometer ",
      es: "El ruido eléctrico excesivo no debería comprometer ",
      en: "Excessive electrical noise shouldn't compromise ",
    },
    accent: { pt: "a leitura do sinal", es: "la lectura de la señal", en: "signal readings" },
    after: { pt: ".", es: ".", en: "." },
    beneficio: {
      pt: "Menor dispersão magnética garante um sinal limpo, sem interferência elétrica.",
      es: "Menor dispersión magnética garantiza una señal limpia, sin interferencia eléctrica.",
      en: "Lower magnetic dispersion keeps the signal clean, free of electrical interference.",
    },
  },
  {
    before: {
      pt: "Aquecimento elevado não deveria comprometer ",
      es: "El calentamiento elevado no debería comprometer ",
      en: "Excess heat shouldn't compromise ",
    },
    accent: { pt: "a vida útil do equipamento", es: "la vida útil del equipo", en: "equipment lifespan" },
    after: { pt: ".", es: ".", en: "." },
    beneficio: {
      pt: "Menor aquecimento estende a vida útil do equipamento.",
      es: "Menor calentamiento extiende la vida útil del equipo.",
      en: "Lower heat generation extends equipment lifespan.",
    },
  },
  {
    before: {
      pt: "Baixa eficiência energética não deveria comprometer ",
      es: "La baja eficiencia energética no debería comprometer ",
      en: "Low energy efficiency shouldn't compromise ",
    },
    accent: { pt: "o custo de operação", es: "el costo de operación", en: "operating cost" },
    after: { pt: ".", es: ".", en: "." },
    beneficio: {
      pt: "Maior eficiência energética reduz o custo de operação.",
      es: "Mayor eficiencia energética reduce el costo de operación.",
      en: "Higher energy efficiency lowers operating cost.",
    },
  },
  {
    before: {
      pt: "Pouco espaço no painel não deveria comprometer ",
      es: "Poco espacio en el panel no debería comprometer ",
      en: "Limited panel space shouldn't compromise ",
    },
    accent: { pt: "o desempenho", es: "el rendimiento", en: "performance" },
    after: { pt: " do sistema.", es: " del sistema.", en: " of the system." },
    beneficio: {
      pt: "Menor volume físico facilita a integração no painel.",
      es: "Menor volumen físico facilita la integración en el panel.",
      en: "A smaller physical footprint makes panel integration easier.",
    },
  },
];

// +3,4s sobre o intervalo anterior (4,6s), a pedido: cada frase precisava
// ficar mais tempo visível antes de trocar.
const INTERVALO_MS = 8000;

export function HeroHeadline() {
  // Conta cada troca (nunca reseta), em vez de guardar só o índice 0-3: usado
  // como `key` do span ativo, para o React remontá-lo (e reiniciar o
  // keyframe) toda vez que ele vira o ativo de novo, mesmo repetindo o mesmo
  // índice num ciclo seguinte.
  const [contador, setContador] = useState(0);
  // Falso na primeira pintura (server e hidratação): o H1 é o elemento de
  // LCP da home, e animar a partir de opacity:0 nesse primeiro frame atrasa a
  // métrica (mesma regra documentada no keyframe ruleGrow, globals.css). Só
  // vira true dentro do próprio intervalo, ou seja, depois que a página já
  // pintou — a partir daí sim cada troca ganha o flash elétrico.
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    // Sem isso, quem pediu menos movimento continua vendo o texto girar: o
    // bloco global de prefers-reduced-motion (globals.css) só desliga a
    // transição CSS, não o setInterval. Congela na primeira frase.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setAnimar(true);
      setContador((c) => c + 1);
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, []);

  const indice = contador % FRASES.length;
  // Selo institucional: troca a cada duas mudanças de dor (metade da
  // velocidade do H1), então cada valor fica visível por 2 frases inteiras.
  // Como FRASES.length é 4, esse ciclo de período 2-em-4 fecha exatamente
  // junto com o ciclo das dores, sem desalinhar com o tempo.
  const internacional = Math.floor(contador / 2) % 2 === 1;

  return (
    <>
      {/* Selo institucional acima do H1. Só remonta (e só ganha o flash) na
          troca real de valor: a `key` é o próprio valor, não o contador, e o
          valor só muda a cada 2 contagens — nas contagens em que ele não
          muda, o React nem re-renderiza este span. */}
      <p className={styles.slogan}>
        <span className={styles.sloganRule} aria-hidden="true" />
        <span key={internacional ? "internacional" : "nacional"} className={animar ? styles.sloganFlash : undefined}>
          {internacional ? (
            <T pt="Expertise internacional · ISO 9001" es="Experiencia internacional · ISO 9001" en="International expertise · ISO 9001" />
          ) : (
            <T pt="Engenharia nacional · ISO 9001" es="Ingeniería nacional · ISO 9001" en="National engineering · ISO 9001" />
          )}
        </span>
      </p>

      {/* As 4 frases (línguas incluídas, via <T>) têm comprimento parecido de
          propósito, mas não idêntico — e a mesma frase quebra em números de
          linha diferentes em pt/es/en e entre breakpoints. Em vez de chutar
          uma altura fixa em linhas (o que já se mostrou frágil: alguma
          combinação de idioma/largura sempre acaba estourando), as 4 ficam
          empilhadas na mesma célula de grid (`grid-area: 1 / 1` em todas) e
          só a ativa fica visível — a grade cresce sozinha até caber a mais
          alta das quatro, no idioma e na largura de tela reais, sem cálculo
          manual. As inativas continuam no fluxo (visibility, não display)
          exatamente para contar nesse cálculo de altura. */}
      <h1 className={styles.headline}>
        {FRASES.map((frase, i) => {
          const ativo = i === indice;
          return (
            <span
              key={i}
              className={styles.headlineSlot}
              style={{ visibility: ativo ? "visible" : "hidden" }}
              aria-hidden={!ativo}
            >
              <span key={ativo ? contador : "parado"} className={ativo && animar ? styles.headlineFrase : undefined}>
                <T pt={frase.before.pt} es={frase.before.es} en={frase.before.en} />
                <span className={styles.headlineAccent}>
                  <T pt={frase.accent.pt} es={frase.accent.es} en={frase.accent.en} />
                </span>
                <T pt={frase.after.pt} es={frase.after.es} en={frase.after.en} />
              </span>
            </span>
          );
        })}
      </h1>

      {/* Frase de valor + CTA de autoridade no mesmo parágrafo, lado a lado
          como duas frases de um único texto corrido — por isso nada de
          altura reservada nem quebra forçada aqui: o benefício flui direto
          para o CTA fixo, exatamente como no exemplo aprovado (a dor do
          ruído). Só o benefício pisca (é o que muda); o CTA nunca ganha a
          classe de flash porque o texto dele nunca muda. */}
      <p className={styles.subtitle}>
        <span key={contador} className={animar ? styles.beneficioFrase : undefined}>
          <T pt={FRASES[indice].beneficio.pt} es={FRASES[indice].beneficio.es} en={FRASES[indice].beneficio.en} />
        </span>{" "}
        <T
          pt="Conheça a engenharia aplicada a cada transformador Toroid do Brasil."
          es="Conozca la ingeniería aplicada a cada transformador Toroid do Brasil."
          en="Discover the engineering applied to every Toroid do Brasil transformer."
        />
      </p>
    </>
  );
}

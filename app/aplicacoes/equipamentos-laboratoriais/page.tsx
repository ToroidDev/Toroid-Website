import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { PillarBody, PillarChecklist, Prose } from "@/components/produtos/Pillar";
import { AplicacaoHero } from "@/components/aplicacoes/AplicacaoHero";
import { LeituraEstavel } from "@/components/aplicacoes/LeituraEstavel";
import { FaixaEstabilidade } from "@/components/aplicacoes/FaixaEstabilidade";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import { getAnosDeMercado } from "@/lib/institucional";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./page.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// PUBLICADA (2026-08-25): linkada no card "Equipamentos laboratoriais" de
// Segmentos.tsx, dentro de app/sitemap.ts, sem `robots: noindex`. O conteúdo
// técnico ainda vem de conhecimento geral de engenharia, não de dado
// confirmado pela Toroid para este segmento especificamente (mesma origem do
// aviso que existia aqui antes de publicar, ver histórico em ROADMAP.md, item
// 1.5). Sem spec table de propósito, por não existir faixa técnica confirmada
// para este segmento.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Transformador para Equipamento Laboratorial | Toroid do Brasil",
  description:
    "Transformador para instrumento de laboratório com baixa irradiação de campo e regulação estável sob carga. Fale com a engenharia e peça seu orçamento.",
  alternates: { canonical: "/aplicacoes/equipamentos-laboratoriais" },
};

const PROVA = ["ISO 9001", `${getAnosDeMercado()} anos de mercado`, "garantia de 3 anos"];

const CHECKLIST = [
  "Tensões de entrada e de saída",
  "Potência necessária",
  "Sensibilidade do instrumento a campo magnético ou ruído elétrico próximo",
  "Estabilidade de tensão exigida sob variação de carga",
  "Espaço disponível no gabinete de bancada",
  "Volume do pedido e prazo do programa de produção",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Transformador toroidal interfere menos em instrumento sensível ao lado?",
    resposta:
      "O núcleo toroidal, sem gap, fecha o fluxo magnético dentro do próprio núcleo, o que reduz a irradiação de campo para fora do componente frente a uma construção convencional equivalente.",
  },
  {
    pergunta: "Como vocês tratam a estabilidade de tensão sob variação de carga?",
    resposta: "A regulação é especificada a partir da carga informada no seu projeto. Envie a faixa de variação esperada e a engenharia dimensiona.",
  },
  {
    pergunta: "Fazem transformador sob medida para instrumento de bancada, em baixo volume?",
    resposta: "Sim. Engenharia sob medida mesmo em lote pequeno, com prazo combinado conforme a complexidade da especificação.",
  },
  {
    pergunta: "Emitem laudo de ensaio elétrico do componente?",
    resposta: "Sim, o ensaio elétrico é documentado antes do embarque, disponível para compor a documentação técnica do seu equipamento.",
  },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores para equipamentos laboratoriais",
        item: "https://toroid.com.br/aplicacoes/equipamentos-laboratoriais",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
      "@type": "Question",
      name: pergunta,
      acceptedAnswer: { "@type": "Answer", text: resposta },
    })),
  },
];

export default function EquipamentosLaboratoriaisPage() {
  return (
    <>
      <AplicacaoHero
        trilha="Transformadores para equipamentos laboratoriais"
        eyebrow="Equipamentos laboratoriais"
        titulo={
          <>
            Transformador para equipamento laboratorial: estabilidade que não interfere na medição,{" "}
            <span className={styles.acento}>sem ruído que contamina o resultado</span>
          </>
        }
        lead="Instrumento de laboratório mede sinal pequeno. Um transformador que aquece, satura ou espalha campo magnético vira fonte de erro dentro do próprio equipamento que deveria estar isolando o sinal do ruído externo."
        prova={PROVA}
        ctaPrimario="Enviar a especificação do instrumento"
        ctaWhatsapp="Falar com nosso time"
        arte={<LeituraEstavel />}
      />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo="O que muda no projeto do seu instrumento">
          <p>
            Cada característica de construção abaixo termina no mesmo lugar: leitura confiável, sem erro introduzido
            pelo próprio transformador de alimentação.
          </p>
          <p>
            <strong>Núcleo toroidal, sem gap.</strong> O fluxo magnético fecha dentro do núcleo, e a irradiação de campo
            para fora do componente cai. Para você, menos interferência em sensor ou circuito de medição próximo. Para
            o negócio, menos blindagem extra para compensar um componente que já poderia irradiar menos.
          </p>
          <p>
            <strong>Regulação estável sob variação de carga.</strong> Tensão de saída que não foge da faixa quando a
            carga do próprio instrumento muda com o aquecimento. Para você, leitura que não deriva ao longo do ensaio.
            Para o negócio, menos calibração repetida por causa de fonte instável.
          </p>
          <p>
            <strong>Baixo ruído audível.</strong> A mesma geometria que reduz irradiação de campo também reduz ruído
            mecânico de magnetostricção. Para você, bancada silenciosa. Para o negócio, ambiente de trabalho mais
            confortável em uso prolongado.
          </p>
          <p>
            <strong>Isolação galvânica entre entrada e saída.</strong> Para você, proteção do sinal medido contra ruído
            vindo da rede elétrica. Para o negócio, menos artefato de medição difícil de diagnosticar.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="estabilidade" titulo="Estabilidade é dado de especificação, não suposição">
          <p>
            Sensibilidade a campo magnético, faixa de variação de carga aceitável e ruído audível tolerado mudam de
            instrumento para instrumento. Não existe padrão único de linha que resolva todo laboratório: o
            dimensionamento parte do que o seu equipamento realmente exige.
          </p>
        </Prose>

        <div className={styles.grafico}>
          <FaixaEstabilidade />
        </div>

        <div className={styles.ctaInline}>
          <p className={styles.ctaInlineTexto}>
            Já sabe a tensão e a potência do seu instrumento? Envie os dados e a engenharia dimensiona.
          </p>
          <WhatsAppLink
            className={styles.ctaInlineLink}
            mensagem="Olá! Preciso do transformador de um instrumento de laboratório e gostaria de falar sobre tensão e potência."
          >
            Falar sobre o instrumento
            <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </WhatsAppLink>
        </div>

        <div className={styles.perguntas}>
          <Perguntas id="perguntas" titulo="Perguntas que aparecem nesta especificação" itens={PERGUNTAS} />
        </div>
      </PillarBody>

      <PillarChecklist
        id="fechar"
        eyebrow="Antes da cotação"
        titulo="Feche a especificação com a engenharia"
        lead="É esse conjunto de dados que separa uma cotação de catálogo de um dimensionamento sob medida. Se algum item ainda não existe no seu projeto, a equipe ajuda a fechar."
        itens={CHECKLIST}
      />

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { PillarBody, PillarChecklist, Prose } from "@/components/produtos/Pillar";
import { AplicacaoHero } from "@/components/aplicacoes/AplicacaoHero";
import { PulsoProtegido } from "@/components/aplicacoes/PulsoProtegido";
import { FaixaIsolamento } from "@/components/aplicacoes/FaixaIsolamento";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import { getAnosDeMercado } from "@/lib/institucional";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./page.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// LINKADA, MAS AINDA `robots: noindex` (2026-08-25)
// As outras 3 páginas deste lote (automação industrial, equipamentos
// laboratoriais, integradores de sistemas) foram publicadas de verdade em
// 2026-08-25: entraram em app/sitemap.ts e perderam o noindex. Esta continua
// de fora das duas coisas, por escolha, mesmo já linkada no card
// "Fabricantes de equipamentos médicos" de Segmentos.tsx (link interno não
// depende de indexação). Motivo: equipamento médico é regulado, e o texto
// abaixo já evita de propósito qualquer frase que sugira certificação/ensaio
// já realizado para uma norma específica (família IEC 60601, por exemplo),
// mas ainda assim é conteúdo técnico não confirmado pela engenharia da
// Toroid, o tipo de coisa que pode virar problema se indexado e lido como
// afirmação oficial. Continua igual às outras em um ponto: todo o conteúdo
// técnico vem de conhecimento geral de engenharia, não de dado confirmado
// pela Toroid para este segmento específico.
//
// Antes de indexar: (1) engenharia confirma isolação, distância de
// isolamento e nível de ruído que a linha realmente entrega; (2) comercial
// confirma se a dor de abertura (isolação auditável, silêncio perto do
// leito) é a que aparece de verdade nesse segmento; (3) SEM spec table nesta
// versão, por não existir faixa técnica confirmada para este segmento,
// diferente de TC/TP/Indutores.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Transformador para Equipamento Médico | Toroid do Brasil",
  description:
    "Transformador para equipamento médico com isolação galvânica e baixo ruído audível. Fale com a engenharia e peça seu orçamento.",
  alternates: { canonical: "/aplicacoes/equipamentos-medicos" },
  robots: { index: false, follow: false },
};

const PROVA = ["ISO 9001", `${getAnosDeMercado()} anos de mercado`, "garantia de 3 anos"];

const CHECKLIST = [
  "Tipo de equipamento e classificação de uso (contato com paciente, ambiente hospitalar, portátil)",
  "Tensões de entrada e de saída",
  "Potência necessária",
  "Requisito de isolação exigido pelo processo de homologação do seu equipamento",
  "Nível de ruído audível aceitável e ambiente de instalação",
  "Espaço disponível no gabinete",
  "Volume do pedido e prazo do programa de produção",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Vocês fornecem laudo de ensaio para homologação de equipamento médico?",
    resposta:
      "O ensaio elétrico é documentado antes do embarque. O laudo específico exigido pelo seu processo de homologação, e a norma aplicável ao seu equipamento, é definido junto com a engenharia, caso a caso.",
  },
  {
    pergunta: "Qual isolação um transformador para equipamento médico precisa ter?",
    resposta:
      "Depende da classificação do equipamento final e do tipo de contato com o paciente. Traga a classificação e a engenharia dimensiona a isolação e a distância de isolamento necessárias.",
  },
  {
    pergunta: "Dá para reduzir o ruído audível perto do leito?",
    resposta:
      "A geometria toroidal, sem gap no núcleo, já reduz o ruído mecânico em relação a construções convencionais. Para ambiente mais sensível, a engenharia avalia acabamento e fixação adicionais.",
  },
  {
    pergunta: "Atendem produção contínua para uma linha de equipamento médico?",
    resposta: "Sim. Produção nacional com rastreabilidade de lote, dimensionada tanto para lote piloto quanto para produção contínua.",
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
        name: "Transformadores para equipamentos médicos",
        item: "https://toroid.com.br/aplicacoes/equipamentos-medicos",
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

export default function EquipamentosMedicosPage() {
  return (
    <>
      <AplicacaoHero
        trilha="Transformadores para equipamentos médicos"
        eyebrow="Equipamentos médicos"
        titulo={
          <>
            Transformador para equipamento médico: isolação auditável,{" "}
            <span className={styles.acento}>sem ruído perto do paciente</span>
          </>
        }
        lead="Equipamento médico não erra na isolação. É o primeiro item que uma auditoria técnica confere, e o primeiro que compromete a segurança do paciente e do operador se estiver mal especificado. Aí que o transformador deixa de ser item de lista de material e passa a ser decisão de engenharia."
        prova={PROVA}
        ctaPrimario="Enviar a especificação do equipamento"
        ctaWhatsapp="Falar com nosso time"
        arte={<PulsoProtegido />}
      />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo="O que muda no projeto do seu equipamento médico">
          <p>
            Cada característica de construção abaixo termina no mesmo lugar: o que aparece na auditoria de segurança do
            seu equipamento e no relatório de homologação.
          </p>
          <p>
            <strong>Isolação galvânica entre entrada e saída.</strong> Separação elétrica real entre a rede e o
            circuito que chega ao paciente ou ao operador. Para você, caminho mais direto para o requisito de segurança
            elétrica do equipamento final. Para o negócio, menos idas e vindas na homologação.
          </p>
          <p>
            <strong>Núcleo toroidal, sem gap.</strong> O fluxo magnético fecha dentro do núcleo, e a irradiação de campo
            para fora do componente cai. Para você, menos interferência em sensor ou sinal de diagnóstico próximo. Para
            o negócio, menos retrabalho de compatibilidade eletromagnética descoberto tarde no desenvolvimento.
          </p>
          <p>
            <strong>Baixo ruído audível.</strong> A mesma geometria que reduz irradiação de campo também reduz ruído
            mecânico de magnetostricção. Para você, equipamento silencioso perto do leito. Para o negócio, menos queixa
            de usuário em ambiente hospitalar.
          </p>
          <p>
            <strong>Ensaio elétrico documentado antes do embarque.</strong> Para você, base técnica para compor o
            dossiê de homologação. Para o negócio, menos amostra reprovada na entrada da sua linha.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="isolacao" titulo="Isolação é dado de especificação, não suposição">
          <p>
            Equipamento médico costuma ser homologado considerando os requisitos de isolação e corrente de fuga da
            família de normas IEC 60601, no que se aplica a equipamento eletromédico. Qual parte se aplica ao seu
            equipamento, e qual nível de isolação o seu projeto exige, é definido pela engenharia caso a caso, a partir
            da classificação do equipamento final e do tipo de contato com o paciente. Não presumimos esse requisito
            sem essa informação.
          </p>
        </Prose>

        <div className={styles.grafico}>
          <FaixaIsolamento />
        </div>

        <div className={styles.ctaInline}>
          <p className={styles.ctaInlineTexto}>
            Já sabe a classificação do seu equipamento? Envie os dados e a engenharia dimensiona a isolação.
          </p>
          <WhatsAppLink
            className={styles.ctaInlineLink}
            mensagem="Olá! Preciso de um transformador para equipamento médico e gostaria de falar sobre isolação e homologação."
          >
            Falar sobre isolação e homologação
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

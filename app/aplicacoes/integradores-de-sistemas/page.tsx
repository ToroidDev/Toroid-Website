import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { PillarBody, PillarChecklist, Prose } from "@/components/produtos/Pillar";
import { AplicacaoHero } from "@/components/aplicacoes/AplicacaoHero";
import { EspecificacoesSobMedida } from "@/components/aplicacoes/EspecificacoesSobMedida";
import { FluxoEspecificacao } from "@/components/aplicacoes/FluxoEspecificacao";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import { getAnosDeMercado } from "@/lib/institucional";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./page.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// PUBLICADA (2026-08-25): linkada no card "Integradores de sistemas
// elétricos" de Segmentos.tsx, dentro de app/sitemap.ts, sem `robots:
// noindex`. O conteúdo ainda não tem validação formal da
// engenharia/comercial (mesma origem do aviso que existia aqui antes de
// publicar, ver histórico em ROADMAP.md, item 1.5). Diferença deste segmento
// frente aos outros três: integrador não tem UM requisito elétrico fixo
// (varia por projeto que ele monta), então a dor de abertura aqui é de
// processo (ciclo de cotação, prazo, documentação), não de uma característica
// técnica única. Por isso não há seção de "isolação"/"estabilidade"
// equivalente às outras páginas deste lote.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Transformador Sob Medida para Integradores de Sistemas | Toroid do Brasil",
  description:
    "Transformadores e indutores sob medida para integradores de sistemas elétricos, com engenharia dedicada e ensaio documentado antes do embarque.",
  alternates: { canonical: "/aplicacoes/integradores-de-sistemas" },
};

const PROVA = ["ISO 9001", `${getAnosDeMercado()} anos de mercado`, "garantia de 3 anos"];

const CHECKLIST = [
  "Tensões de entrada e de saída de cada projeto",
  "Potência e faixa de frequência",
  "Norma aplicável ao equipamento final, quando houver",
  "Espaço disponível e forma de fixação no painel",
  "Volume do pedido, recorrência e prazo do programa de produção",
  "Se o projeto exige homologação do equipamento final, para alinhar a documentação de ensaio",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Vocês atendem projeto único ou só produção em série?",
    resposta: "Os dois. Projeto único, lote piloto ou produção recorrente, o dimensionamento é sempre sob medida a partir da especificação enviada.",
  },
  {
    pergunta: "Quanto tempo leva do desenho à amostra?",
    resposta: "Varia com a complexidade da especificação e o volume do lote. Envie os dados do projeto e a engenharia retorna com prazo.",
  },
  {
    pergunta: "Dá para padronizar o fornecimento para vários projetos diferentes da integradora?",
    resposta:
      "Sim. Cada projeto é especificado separadamente, mas prazo e logística podem ser combinados entre projetos recorrentes do mesmo cliente.",
  },
  {
    pergunta: "Emitem documentação técnica para compor o dossiê do painel entregue ao cliente final?",
    resposta:
      "Sim. O ensaio elétrico é documentado antes do embarque, disponível para compor a documentação técnica do painel.",
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
        name: "Transformadores para integradores de sistemas elétricos",
        item: "https://toroid.com.br/aplicacoes/integradores-de-sistemas",
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

export default function IntegradoresDeSistemasPage() {
  return (
    <>
      <AplicacaoHero
        trilha="Transformadores para integradores de sistemas elétricos"
        eyebrow="Integradores de sistemas elétricos"
        titulo={
          <>
            Transformador sob medida para o seu projeto: menos ida e volta na especificação,{" "}
            <span className={styles.acento}>menos atraso na entrega do painel</span>
          </>
        }
        lead="Integrador de sistemas não trabalha com um produto só. Cada projeto muda tensão, potência, espaço e norma, e o transformador quase sempre é o componente que trava a cotação até alguém dimensionar certo. Aí que entra engenharia dedicada, não catálogo fechado."
        prova={PROVA}
        ctaPrimario="Enviar a especificação do projeto"
        ctaWhatsapp="Falar com nosso time"
        arte={<EspecificacoesSobMedida />}
      />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo="O que muda quando o fornecedor dimensiona junto">
          <p>
            Cada característica abaixo termina no mesmo lugar: menos tempo parado entre o desenho do painel e a peça
            que fecha a montagem.
          </p>
          <p>
            <strong>Dimensionamento a partir da especificação do seu projeto, não de catálogo fixo.</strong> Para você,
            resposta técnica sobre o que o seu projeto pede, não sobre o que já existe pronto na prateleira. Para o
            negócio, menos ida e volta de RFQ até fechar a cotação.
          </p>
          <p>
            <strong>Engenharia e fabricação no mesmo endereço, em São José dos Pinhais.</strong> Para você, ciclo de
            desenvolvimento mais curto entre pedido de amostra e ajuste de especificação. Para o negócio, menos
            dependência de importação num componente que pode travar a linha de montagem se atrasar.
          </p>
          <p>
            <strong>Ensaio elétrico documentado antes do embarque.</strong> Para você, base técnica pronta para compor
            a documentação entregue ao cliente final. Para o negócio, menos amostra reprovada e menos ajuste depois que
            a produção já começou.
          </p>
          <p>
            <strong>Rastreabilidade de lote.</strong> Para você, reposição confiável quando o mesmo projeto volta a
            produção. Para o negócio, previsibilidade de fornecimento em programa recorrente.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="processo" titulo="Cada projeto é uma especificação nova, não uma exceção">
          <p>
            Não existe um transformador único que sirva para todo projeto que passa pela sua integradora. O que existe
            é um processo de especificação recorrente: você traz os dados do projeto, a engenharia dimensiona, ensaia e
            documenta antes do embarque. Volume, lote e cronograma entram na proposta técnica junto com o
            dimensionamento elétrico.
          </p>
        </Prose>

        <div className={styles.grafico}>
          <FluxoEspecificacao />
        </div>

        <div className={styles.ctaInline}>
          <p className={styles.ctaInlineTexto}>
            Tem um projeto em cotação agora? Envie os dados e a engenharia responde com o dimensionamento.
          </p>
          <WhatsAppLink className={styles.ctaInlineLink}>
            Falar sobre o projeto
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

import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import {
  PillarBody,
  PillarChecklist,
  PillarClosing,
  PillarHero,
  PillarIndex,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// Página mais curta que as duas irmãs (TC e Toroidal) de propósito. Não existe
// brief de conteúdo equivalente para indutores: sem dados de busca, sem dor de
// abertura documentada e, principalmente, sem faixa técnica de indutor
// confirmada no brand book. Por isso NÃO há tabela de especificações aqui:
// inventar número seria pior do que a página ser curta.
//
// TODO: pedir brief no mesmo formato dos outros dois (dados de busca, dor de
// abertura, normas de apoio, faixa técnica confirmada pela engenharia) para
// expandir esta página ao mesmo nível de profundidade e adicionar a tabela.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Indutores e Reatores sob Medida | Toroid do Brasil",
  description:
    "Indutores e reatores com indutância especificada pela faixa real de operação do circuito, fabricação nacional e garantia de 3 anos. Peça orçamento técnico.",
  alternates: { canonical: "/indutores-filtros-e-chokes" },
};

const SECOES: SecaoPilar[] = [
  { id: "faixa-de-operacao", titulo: "Indutância pela faixa de operação" },
  { id: "filtragem", titulo: "Filtragem de harmônicos" },
  { id: "limitacao", titulo: "Limitação de corrente" },
  { id: "nucleo", titulo: "Escolha do núcleo" },
  { id: "como-especificar", titulo: "Como especificar" },
  { id: "objecoes", titulo: "Objeções mais comuns" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "ISO 9001 certificada pela RINA" },
  { icon: Factory, texto: "Projeto sob medida" },
];

const CHECKLIST = [
  "Aplicação: filtragem de harmônicos, limitação de corrente, ou ambas",
  "Faixa de corrente e de frequência de operação real do circuito",
  "Indutância alvo e tolerância aceitável dentro dessa faixa",
  "Corrente de partida ou de curto-circuito prevista, quando aplicável",
  "Espaço físico disponível para instalação",
  "Ambiente de instalação: padrão, industrial ou externo",
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Indutores e Reatores",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Indutores e reatores para filtragem e limitação de corrente, com indutância especificada pela faixa de operação real da aplicação, fabricação nacional e garantia de 3 anos.",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Indutores e Reatores",
        item: "https://toroid.com.br/indutores-filtros-e-chokes",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Por que a indutância nominal não basta para especificar um indutor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Porque a indutância varia com a corrente e com a frequência de operação. Dois indutores com o mesmo valor nominal podem se comportar de forma diferente no circuito real, e um deles pode saturar justamente na faixa em que o projeto precisa dele.",
        },
      },
      {
        "@type": "Question",
        name: "Qual a diferença entre indutor de filtragem e reator de limitação de corrente?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O indutor de filtragem atua sobre uma faixa de frequência específica para atenuar harmônicos. O reator de limitação atua sobre a amplitude da corrente em partida de motor ou em falta, protegendo o restante do sistema até a proteção operar.",
        },
      },
    ],
  },
];

export default function IndutoresFiltrosEChokesPage() {
  return (
    <>
      <PillarHero
        icone="indutor"
        nomeCategoria="Indutores e Reatores"
        eyebrow="Filtragem e limitação de corrente"
        titulo={
          <>
            Indutância nominal isolada não garante{" "}
            <span style={{ color: "var(--color-green-light)" }}>desempenho no seu circuito</span>
          </>
        }
        lead="Um indutor ou reator especificado só pelo valor nominal, sem considerar a faixa real de operação do circuito, é uma causa comum de retrabalho. O componente atende a folha de dados e ainda assim não filtra o harmônico esperado, ou não limita a corrente de partida como o projeto previa."
        fatos={FATOS}
      />

      {/* <PillarProof /> */}
      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose id="faixa-de-operacao" titulo="Indutância pela faixa de operação, não pelo valor nominal isolado">
          <p>
            Dois indutores com a mesma indutância nominal podem se comportar de forma completamente diferente dentro do
            circuito real, porque a indutância varia com a corrente e com a frequência de operação. Um componente
            dimensionado apenas para o valor de catálogo pode saturar, aquecer acima do previsto ou perder eficácia de
            filtragem exatamente na faixa em que o projeto mais precisa dele.
          </p>
          <p>
            Especificar a partir da faixa real de operação é o que garante que o indutor ou reator entregue o desempenho
            projetado depois de instalado, e não apenas na folha de dados.
          </p>

          <Pullquote fonte="Toroid do Brasil">
            Especificação correta não é burocracia. É a diferença entre um projeto que funciona e um que gera
            retrabalho.
          </Pullquote>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="filtragem" titulo="Filtragem de harmônicos: o indutor depende da frequência que precisa atenuar">
          <p>
            Um indutor de filtragem atua sobre uma faixa de frequência específica do sistema. Dimensionar esse
            componente exige saber qual harmônico o projeto precisa atenuar e qual o nível de corrente envolvido, e essa
            informação não aparece em um valor nominal de indutância isolado.
          </p>
          <p>
            Sem esse dado, o resultado usual é um componente que reduz a distorção medida em bancada e decepciona no
            ponto real de instalação, onde o espectro de corrente é outro.
          </p>
        </Prose>

        <Prose id="limitacao" titulo="Limitação de corrente de partida e de curto-circuito: o papel do reator">
          <p>
            Um reator de limitação protege o restante do sistema no momento mais crítico: partida de motor ou falta no
            circuito. O dimensionamento correto passa por conhecer a corrente de partida esperada, a corrente de
            curto-circuito prevista e o tempo que a proteção do sistema leva para atuar.
          </p>
          <p>
            É a combinação desses três dados, e não a indutância sozinha, que define se o reator segura a corrente pelo
            tempo necessário sem saturar.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose id="nucleo" titulo="Escolha do núcleo: cada construção atende necessidades diferentes">
          <p>
            O núcleo toroidal concentra o campo magnético e ocupa menos volume para a mesma faixa de trabalho, o que
            ajuda quando há restrição de espaço ou sensibilidade a interferência eletromagnética no entorno. Outras
            construções seguem adequadas quando o custo por unidade pesa mais, ou quando o projeto já está validado em
            torno delas.
          </p>
          <p>
            Cada tecnologia atende necessidades diferentes. A decisão é sempre sobre qual delas gera mais valor para os
            objetivos deste projeto, e ela vem depois de conhecer a faixa de operação, nunca antes.
          </p>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes da cotação"
        titulo="Como especificar um indutor ou reator"
        lead="Este conjunto de informações é o que separa uma especificação sob medida de um componente de catálogo escolhido pelo valor nominal. É também o que evita o retrabalho de uma peça que atende a folha de dados e não resolve o problema do circuito."
        itens={CHECKLIST}
      />

      {/* <PillarObjections id="objecoes" /> */}

      {/* <PillarClosing id="fecho" titulo="Descreva o circuito, não o componente">
        <p>
          Se você ainda não tem a indutância alvo fechada, isso não impede a conversa. Descrever a faixa de corrente, a
          frequência e o que precisa ser atenuado ou limitado já é suficiente para a nossa engenharia propor um
          dimensionamento e discutir alternativas.
        </p>
      </PillarClosing> */}

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

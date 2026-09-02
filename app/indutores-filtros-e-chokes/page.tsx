import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import {
  PillarAviso,
  PillarBody,
  PillarChecklist,
  PillarClosing,
  PillarFoto,
  PillarHero,
  PillarIndex,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// BRIEF RECEBIDO EM 2026-09-01: a engenharia entregou o documento técnico que
// faltava, e a página deixou de ser a versão curta das três. Entraram daqui:
// definição de indutor e de indutância, lei de Faraday e lei de Lenz, campo de
// aplicação (fontes, filtros, ressonância, DC-DC, chokes, RF), modo comum e
// modo diferencial, e os cuidados de aplicação.
//
// AINDA SEM TABELA DE ESPECIFICAÇÕES: o brief é de conteúdo, não de faixa
// técnica. Continua não existindo faixa de indutância, de corrente e de
// frequência confirmada para declarar como linha padrão, e inventar número
// seria pior do que a página não ter tabela. O único valor numérico publicado
// aqui é o diâmetro externo do núcleo toroidal, que vem do brand book.
//
// TODO: pedir à engenharia a faixa técnica de indutor confirmada para
// finalmente adicionar a PillarSpecTable e o additionalProperty do Product.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Indutores e Reatores sob Medida | Toroid do Brasil",
  description:
    "Indutores e reatores com indutância especificada pela faixa real de operação do circuito, fabricação nacional e garantia de 3 anos. Peça orçamento técnico.",
  alternates: {
    canonical: "/indutores-filtros-e-chokes",
    languages: {
      "pt-BR": absoluteUrl("/indutores-filtros-e-chokes"),
      es: absoluteUrl("/es/indutores-filtros-e-chokes"),
      "x-default": absoluteUrl("/indutores-filtros-e-chokes"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-e", titulo: "O que um indutor faz no circuito" },
  { id: "faixa-de-operacao", titulo: "Indutância pela faixa de operação" },
  { id: "onde-se-aplica", titulo: "Onde o indutor aparece no projeto" },
  { id: "filtragem", titulo: "Filtragem de harmônicos" },
  { id: "modo-comum-e-diferencial", titulo: "Modo comum e modo diferencial" },
  { id: "limitacao", titulo: "Limitação de corrente" },
  { id: "nucleo", titulo: "Escolha do núcleo" },
  { id: "cuidados", titulo: "Cuidados de aplicação" },
  { id: "como-especificar", titulo: "Como especificar" },
  { id: "perguntas", titulo: "Perguntas frequentes" },
  // { id: "objecoes", titulo: "Objeções mais comuns" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "ISO 9001 certificada pela RINA" },
  { icon: Factory, texto: "Projeto sob medida" },
];

const CHECKLIST = [
  "Indutância alvo (H) e tolerância aceitável dentro da faixa de operação",
  "Corrente elétrica nominal (A) e faixa real de corrente do circuito",
  "Frequência nominal (Hz) e faixa de frequência que precisa ser atenuada",
  "Aplicação: filtragem de harmônicos, limitação de corrente, ou ambas",
  "Modo de filtragem, quando aplicável: modo comum ou modo diferencial",
  "Corrente de partida ou de curto-circuito prevista, quando aplicável",
  "Espaço físico disponível para instalação",
  "Ambiente de instalação: padrão, industrial ou externo",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "O que é indutância e em que unidade ela é medida?",
    resposta:
      "Indutância é a medida da oposição que um indutor oferece à variação da corrente elétrica que passa por ele. A unidade é o henry (H). Na prática, é o parâmetro que descreve o quanto aquele componente consegue amenizar picos de corrente no circuito.",
  },
  {
    pergunta: "Por que a indutância nominal não basta para especificar um indutor?",
    resposta:
      "Porque a indutância varia com a corrente e com a frequência de operação. Dois indutores com o mesmo valor nominal podem se comportar de forma diferente no circuito real, e um deles pode saturar justamente na faixa em que o projeto precisa dele.",
  },
  {
    pergunta: "O que é um choke de filtro?",
    resposta:
      "É um indutor aplicado para bloquear interferência eletromagnética e ruído em uma faixa de frequência, deixando passar o sinal ou a corrente de interesse. Aparece com frequência em fontes de alimentação e em entradas de equipamento sensível a ruído conduzido.",
  },
  {
    pergunta: "Qual a diferença entre indutor de modo comum e de modo diferencial?",
    resposta:
      "O indutor de modo comum filtra ruído que afeta os dois condutores do circuito de maneira semelhante, o que é típico de interferência de alta frequência. O de modo diferencial atua sobre sinais que apresentam diferença entre os dois condutores, com correntes fluindo em direções opostas. São problemas distintos, e o modo de filtragem precisa ser definido junto com a indutância.",
  },
  {
    pergunta: "Qual a diferença entre indutor de filtragem e reator de limitação de corrente?",
    resposta:
      "O indutor de filtragem atua sobre uma faixa de frequência específica para atenuar harmônicos. O reator de limitação atua sobre a amplitude da corrente em partida de motor ou em falta, protegendo o restante do sistema até a proteção operar.",
  },
  {
    pergunta: "Por que o formato toroidal é usado em indutores?",
    resposta:
      "O formato toroidal concentra o campo magnético no núcleo, o que reduz a perda de energia, minimiza o campo externo e com ele a interferência eletromagnética, e mantém o comportamento estável em diferentes condições de operação. Ainda assim, cada construção atende necessidades diferentes, e a escolha depende da restrição do projeto.",
  },
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
      { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Indutores e Reatores",
        item: absoluteUrl("/indutores-filtros-e-chokes"),
      },
    ],
  },
  {
    // Derivado de PERGUNTAS, a mesma constante que alimenta a seção visível.
    // Assim o dado estruturado não tem como divergir do texto publicado.
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
      "@type": "Question",
      name: pergunta,
      acceptedAnswer: { "@type": "Answer", text: resposta },
    })),
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
        <Prose
          id="o-que-e"
          titulo="O que um indutor faz no circuito"
          arte={
            <PillarFoto
              src="/images/produtos/indutores-familia.webp"
              alt="Conjunto de indutores Toroid: um filtro montado em base com vários núcleos toroidais enrolados e, ao lado, dois indutores menores montados em placa de circuito impresso"
              legenda="O mesmo princípio em escalas diferentes: filtro de potência montado em base, e indutores de placa ao lado."
              largura={1200}
              altura={750}
            />
          }
        >
          <p>
            O indutor é um componente passivo que armazena energia na forma de campo magnético. Construtivamente é um
            fio condutor enrolado em torno de um núcleo, e a grandeza que o descreve é a indutância, medida em henry
            (H): quanto maior a indutância, maior a oposição que o componente oferece à variação da corrente elétrica.
          </p>
          <p>
            O princípio é o mesmo da lei de Faraday. Quando a corrente circula pelo indutor, cria um campo magnético em
            torno do fio. Se essa corrente aumenta ou diminui, a variação do campo induz uma força eletromotriz que,
            pela lei de Lenz, se opõe justamente à mudança que a originou. É daí que vem a função prática do
            componente: amenizar picos de corrente.
          </p>
        </Prose>

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
        <Prose
          id="onde-se-aplica"
          titulo="Onde o indutor aparece no projeto"
          arte={
            <PillarFoto
              src="/images/produtos/indutor-em-placa.webp"
              alt="Indutor Toroid montado em placa de circuito impresso, com enrolamento em fio de seção retangular sobre núcleo azul e selo RoHS visível"
              legenda="Indutor de placa com selo RoHS, do tipo especificado para fonte de alimentação e filtro de linha."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            O mesmo princípio atende funções bem diferentes dentro de um projeto eletrônico, e é por isso que a
            especificação começa pela função e não pelo componente:
          </p>
          <ul>
            <li>
              <strong>Fontes de alimentação.</strong> O indutor ajuda o restante do circuito a controlar e transformar
              a tensão de forma eficiente.
            </li>
            <li>
              <strong>Filtros de alimentação e de sinal.</strong> Elimina frequências indesejadas e suaviza as tensões
              que chegam ao equipamento.
            </li>
            <li>
              <strong>Conversores de energia e fontes DC-DC.</strong> Participa diretamente da conversão e do controle
              de energia.
            </li>
            <li>
              <strong>Choke de filtro.</strong> Bloqueia interferência eletromagnética e ruído conduzido, que é a
              função por trás do nome desta página.
            </li>
            <li>
              <strong>Circuitos de ressonância e de RF.</strong> Sustenta sistemas de rádio e comunicação e o controle
              de sinais de alta frequência.
            </li>
            <li>
              <strong>Eletrônicos de consumo.</strong> Televisores, computadores e carregadores de bateria, onde o
              componente costuma ser especificado por volume.
            </li>
          </ul>
        </Prose>

        <Prose
          id="filtragem"
          titulo="Filtragem de harmônicos: o indutor depende da frequência que precisa atenuar"
          arte={
            <PillarFoto
              src="/images/produtos/indutor-pequeno.webp"
              alt="Indutor toroidal Toroid de pequeno porte, com enrolamento em cobre esmaltado e terminais isolados, montado sobre base branca com pinos para placa"
              legenda="O porte do componente sai da faixa de frequência e do nível de corrente, não do valor nominal de indutância."
              largura={1000}
              altura={750}
            />
          }
        >
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

        <Prose
          id="modo-comum-e-diferencial"
          titulo="Modo comum e modo diferencial: dois modos de filtragem"
          arte={
            <PillarFoto
              src="/images/produtos/indutor-modo-comum.webp"
              alt="Indutor de modo comum Toroid montado em placa de circuito impresso, com núcleo toroidal amarelo enrolado em cobre ao lado de um segundo enrolamento sobre núcleo retangular"
              legenda="Indutor de modo comum montado em placa: os dois condutores passam pelo mesmo núcleo, e é isso que cancela a interferência."
              largura={1000}
              altura={749}
            />
          }
        >
          <p>
            Definida a faixa de frequência, falta definir o modo de operação. São dois problemas distintos, e o
            componente que resolve um não resolve o outro.
          </p>
          <p>
            O <strong>indutor em modo comum</strong> filtra interferência que afeta os dois condutores do circuito de
            maneira semelhante. É eficaz contra sinais indesejados de alta frequência, aqueles que prejudicam
            equipamento eletrônico sensível, e por isso aparece em fontes de alimentação, circuitos de comunicação e
            dispositivos de controle de ruído. Ele permite a passagem da corrente útil enquanto bloqueia a
            interferência.
          </p>
          <p>
            O <strong>indutor em modo diferencial</strong> atua sobre sinais que apresentam diferença entre os dois
            condutores, com correntes fluindo em direções opostas. É o que se usa quando a separação de sinais precisa
            ser preservada, como em comunicação digital e em sistemas de áudio: atenua o ruído e a distorção do sinal
            diferencial, deixando passar só o que interessa.
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
        <Prose
          id="nucleo"
          titulo="Escolha do núcleo: cada construção atende necessidades diferentes"
          arte={
            <PillarFoto
              src="/images/produtos/indutor-filtro-montado.webp"
              alt="Filtro de linha Toroid montado em base preta, com três núcleos toroidais enrolados em cobre e cabos de saída identificados por cor"
              legenda="Núcleos toroidais em um filtro montado. O núcleo é fabricado internamente, com diâmetro externo de 15 mm a 350 mm."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            O núcleo toroidal concentra o campo magnético e ocupa menos volume para a mesma faixa de trabalho, o que
            ajuda quando há restrição de espaço ou sensibilidade a interferência eletromagnética no entorno. Outras
            construções seguem adequadas quando o custo por unidade pesa mais, ou quando o projeto já está validado em
            torno delas.
          </p>
          <p>
            Em indutores, três características do formato toroidal costumam pesar na decisão: a geometria minimiza a
            perda de energia no núcleo, minimiza o campo magnético externo e com ele a interferência eletromagnética
            emitida, e mantém o comportamento estável em condições variadas de operação. São características, não um
            veredito.
          </p>
          <p>
            Cada tecnologia atende necessidades diferentes. A decisão é sempre sobre qual delas gera mais valor para os
            objetivos deste projeto, e ela vem depois de conhecer a faixa de operação, nunca antes.
          </p>
          <p>
            Quando o núcleo toroidal é a escolha certa, ele é fabricado internamente, com diâmetro externo de 15 mm a
            350 mm, e o isolamento e o enrolamento também acontecem sob o mesmo teto, sem depender de fornecedor
            externo em nenhuma dessas etapas.
          </p>
        </Prose>

        <PillarAviso id="cuidados" titulo="Cuidados de aplicação">
          <p>
            Indutor é componente seguro, mas depende de ser aplicado dentro do que foi projetado. Três condições
            explicam a maior parte das falhas que chegam até a nossa engenharia:
          </p>
          <ul>
            <li>
              <strong>Sobrecarga de corrente.</strong> Operar acima da corrente nominal aquece o componente além do
              previsto e degrada o enrolamento antes do fim do ciclo de vida do projeto.
            </li>
            <li>
              <strong>Saturação do núcleo.</strong> Passado o ponto de saturação, a indutância efetiva despenca e o
              indutor deixa de filtrar ou de limitar como o projeto previa, mesmo estando fisicamente intacto.
            </li>
            <li>
              <strong>Interferência magnética excessiva.</strong> Campo externo elevado, próprio ou do entorno,
              compromete o desempenho do indutor e dos componentes vizinhos.
            </li>
          </ul>
          <p>
            As três são evitáveis na especificação, e é por isso que a faixa real de operação do circuito pesa mais do
            que o valor nominal de catálogo.
          </p>
        </PillarAviso>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes da cotação"
        titulo="Como especificar um indutor ou reator"
        lead="Este conjunto de informações é o que separa uma especificação sob medida de um componente de catálogo escolhido pelo valor nominal. É também o que evita o retrabalho de uma peça que atende a folha de dados e não resolve o problema do circuito."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <Perguntas id="perguntas" titulo="Perguntas que aparecem nesta especificação" itens={PERGUNTAS} />
      </PillarBody>

      {/* <PillarObjections id="objecoes" /> */}

      <PillarClosing id="fecho" titulo="Descreva o circuito, não o componente">
        <p>
          Se você ainda não tem a indutância alvo fechada, isso não impede a conversa. Descrever a faixa de corrente, a
          frequência e o que precisa ser atenuado ou limitado já é suficiente para o nosso time propor um
          dimensionamento e discutir alternativas.
        </p>
      </PillarClosing>

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

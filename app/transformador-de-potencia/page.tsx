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
  PillarSpecTable,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// VALIDADO PELA ENGENHARIA EM 2026-09-01: a engenharia revisou o conteúdo
// publicado desta página e confirmou os valores técnicos (faixa de 5 VA a
// 15 kVA, 50 Hz a 800 Hz, tensão de isolamento até 4 kV, eficiência até 98%,
// regulação até 1%), sem apontamento de correção. Esses valores viviam antes na
// página de Transformadores Toroidais; migraram pra aqui porque descrevem a
// linha de potência em geral, não uma vantagem específica do núcleo toroidal.
//
// A mesma revisão trouxe conteúdo de referência que não estava no site: TP
// elevador e abaixador no Sistema Elétrico de Potência, o limiar de alta tensão
// da NR-10, autotransformador contra transformador isolador, os dois tipos de
// blindagem e a regra de nunca ligar o secundário em curto.
//
// O documento da engenharia também compara núcleo EI e núcleo toroidal e conclui
// pela superioridade do toroidal. Essa parte NÃO foi publicada, por decisão: o
// CLAUDE.md proíbe a formulação "o toroidal é superior" e a página
// /transformadores-toroidais proíbe a comparação com o núcleo EI. Não
// reintroduzir aqui nem em nenhuma outra página.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Transformador de Potência sob Medida | Toroid do Brasil",
  description:
    "Transformador de potência com isolação galvânica, eficiência até 98% e núcleo toroidal ou convencional conforme o projeto. Peça orçamento técnico com o nosso time.",
  alternates: {
    canonical: "/transformador-de-potencia",
    languages: {
      "pt-BR": absoluteUrl("/transformador-de-potencia"),
      es: absoluteUrl("/es/transformador-de-potencia"),
      "x-default": absoluteUrl("/transformador-de-potencia"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-resolve", titulo: "O que um transformador de potência resolve no seu projeto" },
  { id: "isolacao-e-eficiencia", titulo: "Isolação galvânica e eficiência" },
  { id: "autotransformador-ou-isolador", titulo: "Autotransformador ou transformador isolador" },
  { id: "blindagem", titulo: "Blindagem eletrostática e magnética" },
  { id: "secundario-em-curto", titulo: "Nunca ligue o secundário em curto" },
  { id: "materias-primas", titulo: "Matérias-primas: aço e cobre" },
  { id: "acabamentos", titulo: "Encapsulado, resinado ou simples" },
  { id: "medico", titulo: "Equipamento médico" },
  { id: "solar", titulo: "Energia solar e geração distribuída" },
  { id: "como-especificar", titulo: "Como especificar um transformador de potência" },
  { id: "especificacoes", titulo: "Tabela de especificações" },
  { id: "perguntas", titulo: "Perguntas frequentes" },
  // { id: "objecoes", titulo: "Objeções mais comuns" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Tipo seco conforme ABNT NBR5356-11" },
  { icon: Factory, texto: "Fabricação nacional sob medida" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Faixa de potência", "5 VA a 15 kVA"],
  ["Frequência de operação", "50 Hz a 800 Hz"],
  ["Isolação", "galvânica, com blindagem eletrostática e eletromagnética"],
  ["Tensão de isolamento", "até 4 kV"],
  ["Eficiência", "até 98%"],
  ["Regulação", "até 1%"],
  ["Acabamentos disponíveis", "Mylar ou resina epóxi"],
  ["Norma de referência (tipo seco)", "ABNT NBR5356-11"],
];

const CHECKLIST = [
  "Tensão nominal de entrada e de saída (V)",
  "Potência nominal (VA) ou corrente da carga no secundário (A)",
  "Frequência nominal (Hz): rede padrão ou frequência específica do equipamento",
  "Classe de isolação",
  "Dimensões mínimas e máximas disponíveis no gabinete ou no produto final (mm)",
  "Tipo de aplicação e ambiente de instalação: padrão, industrial, externo ou médico",
  "Necessidade de blindagem eletrostática ou magnética",
  "Tipo de acabamento",
  "Volume do pedido e prazo do projeto",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Qual a eficiência de um transformador de potência Toroid?",
    resposta: "A linha Toroid opera com eficiência de até 98% e regulação de até 1%.",
  },
  {
    pergunta: "A partir de que tensão um circuito é considerado de alta tensão?",
    resposta:
      "Pela NR-10, toda tensão em corrente alternada acima de 1000 V é considerada alta tensão, e os valores abaixo disso são baixa tensão. Geração e transmissão trabalham em alta tensão, e é na distribuição que acontece a passagem para os níveis de baixa tensão que alimentam o equipamento final.",
  },
  {
    pergunta: "Qual a diferença entre autotransformador e transformador isolador?",
    resposta:
      "O autotransformador tem apenas o núcleo e um enrolamento, e serve para corrigir o nível de alimentação, por exemplo de 127 Vca para 220 Vca. O transformador isolador tem primário e secundário separados, então além de adequar a tensão ele mantém isolação galvânica entre os dois lados, o que funciona como proteção complementar ao equipamento.",
  },
  {
    pergunta: "O que é blindagem eletrostática em um transformador?",
    resposta:
      "É uma camada aplicada entre o primário e o secundário que reforça a isolação galvânica entre os enrolamentos, com um cabo dedicado para aterramento do transformador. Serve principalmente como proteção contra descargas atmosféricas que cheguem pela alimentação.",
  },
  {
    pergunta: "O que acontece se o secundário de um transformador de potência for ligado em curto?",
    resposta:
      "Ao contrário do transformador de corrente, o transformador de potência não é projetado para operar com o secundário em curto. Ligar os enrolamentos secundários entre si eleva a corrente do circuito, danifica o transformador e cria risco de incêndio, de explosão e de choque elétrico para quem estiver manipulando o equipamento.",
  },
  {
    pergunta: "Transformador de potência pode ser usado em equipamento médico?",
    resposta:
      "Sim. A construção tipo seco, sem óleo isolante, é enquadrada na ABNT NBR5356-11, e a linha Toroid é RoHS Compliant.",
  },
  {
    pergunta: "Qual a diferença entre acabamento Mylar e resina epóxi?",
    resposta:
      "Mylar oferece isolação elétrica em aplicação padrão. O encapsulamento em resina epóxi adiciona proteção mecânica e resistência a umidade, poeira e variação térmica, indicado para ambiente agressivo.",
  },
  {
    pergunta: "O transformador de potência pode ter núcleo toroidal?",
    resposta:
      "Sim. A linha pode ser fornecida em núcleo toroidal ou em construção convencional E/I, dependendo da restrição do projeto. Cada tecnologia atende necessidades diferentes.",
  },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Transformador de Potência",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Transformador de potência com isolação galvânica, eficiência até 98%, disponível em núcleo toroidal ou convencional conforme o projeto.",
    additionalProperty: ESPECIFICACOES.map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores de Potência",
        item: absoluteUrl("/transformador-de-potencia"),
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

export default function TransformadorDePotenciaPage() {
  return (
    <>
      <PillarHero
        icone="potencia"
        nomeCategoria="Transformadores de Potência"
        eyebrow="Isolação, regulação e eficiência sob medida"
        titulo={
          <>
            Um transformador de potência mal especificado vira instabilidade de tensão e aquecimento{" "}
            <span style={{ color: "var(--color-green-light)" }}>que só aparece depois da instalação</span>
          </>
        }
        lead="Um transformador de potência dentro da faixa nominal ainda pode falhar no que importa: regulação instável sob carga variável, aquecimento acima do projetado, ou isolação insuficiente para o ambiente de instalação. A pergunta certa não é qual modelo de catálogo comprar. É qual especificação a sua aplicação exige."
        fatos={FATOS}
      />

      {/* <PillarProof /> */}
      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose
          id="o-que-resolve"
          titulo="O que um transformador de potência resolve no seu projeto"
          arte={
            <PillarFoto
              src="/images/produtos/tp-toroidal-isolado.webp"
              alt="Transformador de potência toroidal isolado em fita, apoiado de lado, com dois chicotes de cabos coloridos saindo dos enrolamentos"
              legenda="Transformador de potência toroidal, com primário e secundário isolados e chicotes já identificados."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Um transformador de potência entrega a tensão e a corrente que o restante do circuito precisa, isolando
            galvanicamente o lado de alimentação do lado de carga. Essa isolação não é um detalhe construtivo: é a
            camada de segurança que protege equipamento e operador contra falha do lado de potência.
          </p>
          <p>
            O equipamento pode ser elevador, quando aumenta a tensão aplicada no primário, ou abaixador, quando reduz a
            tensão para o nível desejado. É o que sustenta o Sistema Elétrico de Potência inteiro: na geração e na
            transmissão, transformadores abaixadores reduzem tensões como 69 kV e 138 kV a níveis padronizados de
            medição e proteção; na distribuição, reduzem de novo até os 127 V, 220 V ou 380 V que chegam ao consumidor.
            Pela NR-10, o limiar entre alta e baixa tensão em corrente alternada está em 1000 V.
          </p>
          <p>
            A dúvida que chega até a nossa engenharia raramente é qual transformador comprar. É qual especificação
            resolve o problema real do projeto: regulação de tensão instável sob carga variável, aquecimento acima do
            previsto, ou isolação insuficiente para o ambiente de instalação.
          </p>
        </Prose>

        <Prose id="isolacao-e-eficiencia" titulo="Isolação galvânica e eficiência: o que protege o sistema">
          <p>
            A isolação galvânica entre primário e secundário protege o circuito de carga contra falha do lado de
            alimentação. É requisito de segurança, não recurso opcional. Combinada com blindagem eletrostática e
            eletromagnética, essa isolação também reduz a interferência que o transformador introduz no restante do
            sistema, o que importa especialmente em equipamento sensível a ruído elétrico.
          </p>
          <p>
            A linha de transformadores de potência da Toroid opera com eficiência de até 98% e regulação de até 1%,
            com tensão de isolamento de até 4 kV e faixa de frequência de 50 Hz a 800 Hz. Isso cobre tanto aplicação
            de rede padrão quanto equipamento que opera em frequência não convencional.
          </p>

          <Pullquote fonte="Toroid do Brasil">
            Operações críticas não esperam apenas energia. Esperam estabilidade.
          </Pullquote>
        </Prose>

        <Prose
          id="autotransformador-ou-isolador"
          titulo="Autotransformador ou transformador isolador: o que muda em baixa tensão"
          arte={
            <PillarFoto
              src="/images/produtos/tp-chicotes.webp"
              alt="Transformador de potência toroidal com dois chicotes separados, cada um terminado em seu próprio conector, saindo para lados opostos"
              legenda="Transformador isolador: primário e secundário saem em chicotes separados, cada um no seu conector."
              largura={1200}
              altura={750}
            />
          }
        >
          <p>
            Em baixa tensão, duas construções resolvem problemas diferentes e costumam ser confundidas na hora de
            cotar. O <strong>autotransformador</strong> tem apenas o núcleo e um enrolamento, e serve para corrigir o
            nível de alimentação, por exemplo transformar 127 Vca em 220 Vca ou o contrário. É a escolha econômica
            quando o objetivo é só adequar tensão.
          </p>
          <p>
            O <strong>transformador isolador</strong> tem primário e secundário separados. Além de adequar a tensão,
            mantém isolação galvânica entre os dois lados, o que transforma o transformador em proteção complementar
            do equipamento a jusante. Quando o projeto precisa que uma falha na alimentação não atravesse para a
            carga, essa separação é o que decide entre as duas construções.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose
          id="blindagem"
          titulo="Blindagem eletrostática e blindagem magnética: duas proteções distintas"
          arte={
            <PillarFoto
              src="/images/produtos/tp-toroidal-multiplos-enrolamentos.webp"
              alt="Transformador de potência toroidal visto de cima, com vários enrolamentos secundários levados a conectores e réguas de bornes identificadas"
              legenda="Transformador com múltiplos secundários. Cada saída é identificada em fábrica, incluindo o cabo dedicado ao aterramento da blindagem."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            A tabela de especificações declara isolação galvânica com blindagem eletrostática e eletromagnética. São
            duas coisas diferentes, e a escolha entre elas depende de qual problema o projeto precisa resolver.
          </p>
          <ul>
            <li>
              <strong>Blindagem eletrostática.</strong> Aplicada entre o primário e o secundário, reforça a isolação
              galvânica entre os enrolamentos e recebe um cabo dedicado para aterramento do transformador. Protege
              principalmente contra descargas atmosféricas que cheguem pela alimentação.
            </li>
            <li>
              <strong>Blindagem magnética.</strong> Camadas de chapa de aço silício aplicadas ao redor do
              transformador, para reduzir o campo magnético que ele emite. Serve para evitar que o próprio
              transformador interfira nos demais componentes do circuito.
            </li>
          </ul>
          <p>
            Uma protege o transformador do que vem de fora, a outra protege o que está em volta do transformador. Em
            equipamento sensível a ruído elétrico é comum precisar das duas, e é por isso que a blindagem aparece como
            item próprio no checklist de especificação.
          </p>
        </Prose>

        <PillarAviso id="secundario-em-curto" titulo="Nunca ligue o secundário do TP em curto">
          <p>
            Aqui a regra é o oposto da do transformador de corrente, e confundir as duas custa caro. O transformador de
            potência não é projetado para operar com o secundário em curto. Ligar os enrolamentos secundários entre si
            eleva a corrente do circuito muito acima do previsto, o que danifica o transformador e cria risco de
            incêndio, de explosão e de choque elétrico para quem estiver manipulando o equipamento.
          </p>
          <p>
            No transformador de corrente vale o contrário: lá o secundário nunca pode ficar aberto. Cada família tem a
            sua condição proibida, e a que se aplica a um não se aplica ao outro.
          </p>
        </PillarAviso>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose
          id="materias-primas"
          titulo="Matérias-primas: aço silício e cobre esmaltado"
          arte={
            <PillarFoto
              src="/images/produtos/tp-cobre-em-producao.webp"
              alt="Detalhe de transformadores toroidais em produção, com o enrolamento de cobre esmaltado à vista e cabos protegidos por conduíte corrugado"
              legenda="Cobre esmaltado G2 enrolado sobre núcleo toroidal de aço silício de grão orientado, na linha de produção."
              largura={1200}
              altura={800}
            />
          }
        >
          <p>
            O núcleo parte de aço silício de grão orientado, nas espessuras M3 (0,23 mm) e M4 (0,27 mm), cortado em
            larguras de 10 mm a 80 mm conforme a especificação do projeto. É essa lâmina de alta permeabilidade
            magnética que sustenta o desempenho declarado na tabela de especificações.
          </p>
          <p>
            O enrolamento usa cobre esmaltado G2, com bitola de 5 AWG a 36 AWG, para suportar desde correntes baixas
            de instrumentação até cargas mais exigentes, sem trocar de fornecedor entre uma faixa e outra da linha.
          </p>
        </Prose>

        <Prose
          id="acabamentos"
          titulo="Encapsulado, resinado ou simples: qual acabamento protege o projeto"
          arte={
            <PillarFoto
              src="/images/produtos/tp-familia.webp"
              alt="Três transformadores de potência Toroid lado a lado: um toroidal isolado em Mylar, um menor com chicote de cabos identificados e um encapsulado em resina epóxi preta"
              legenda="O mesmo transformador, três acabamentos: isolado em Mylar, com chicote identificado e encapsulado em resina epóxi."
              largura={1200}
              altura={750}
            />
          }
        >
          <p>
            O acabamento muda o que o transformador resiste no ambiente de instalação, não a tecnologia em si. O
            Mylar oferece isolação elétrica em aplicação padrão. O encapsulamento em resina epóxi adiciona proteção
            mecânica e resistência a umidade, poeira e variação térmica, o que aumenta a durabilidade em ambiente
            agressivo.
          </p>
          <p>
            Especificar o acabamento pelo ambiente real de instalação evita um problema comum: transformador que
            funciona bem em bancada de teste e degrada antes do previsto em campo.
          </p>
        </Prose>

        <Prose
          id="medico"
          titulo="Transformador de potência para equipamento médico"
          arte={
            <PillarFoto
              src="/images/produtos/tp-em-gabinete.webp"
              alt="Transformador de potência toroidal montado na base de um gabinete metálico, sob a placa de controle e o chicote de cabos do equipamento, com selo verde de aprovação no controle de qualidade"
              legenda="Transformador já montado no gabinete do equipamento, com selo de aprovação no controle de qualidade."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Equipamento médico tem exigência de segurança elétrica que não deixa margem para interpretação: isolação
            galvânica robusta, baixa corrente de fuga e comportamento previsível sob falha. A construção tipo seco,
            sem óleo isolante, enquadrada na ABNT NBR5356-11, atende esse perfil de aplicação. A certificação RoHS
            Compliant é relevante para quem fabrica para mercado regulado.
          </p>
          <p>
            Aqui a especificação técnica documentada pesa mais do que preço unitário. Homologação de equipamento
            médico não tolera fornecedor que não sustente o dado técnico com norma.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose
          id="solar"
          titulo="Transformador de potência para energia solar e geração distribuída"
          arte={
            <PillarFoto
              src="/images/produtos/tp-alta-potencia.webp"
              alt="Transformador de potência de núcleo retangular isolado em fita, com cabos de alta seção em laranja e preto e suportes metálicos de fixação"
              legenda="Transformador de maior potência, com cabo de seção compatível e suportes próprios de fixação."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Em geração distribuída e energia solar, a eficiência do transformador se acumula ao longo de milhares de
            horas de operação. Um ponto percentual de perda a mais é energia gerada e não entregue. A eficiência de
            até 98%, combinada com regulação de até 1%, contribui diretamente para o desempenho global do sistema,
            especialmente em instalação com espaço já restrito por definição de projeto.
          </p>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes da cotação"
        titulo="Como especificar um transformador de potência"
        lead="É esse conjunto de informações que separa uma cotação de catálogo de uma especificação sob medida, inclusive quando o padrão não cabe no gabinete do produto final e o projeto exige customização."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <PillarSpecTable
          id="especificacoes"
          titulo="Especificações da linha de transformadores de potência"
          linhas={ESPECIFICACOES}
          nota="Parâmetros da linha padrão. Aplicação fora dessas faixas é avaliada caso a caso pela engenharia."
        />
      </PillarBody>

      <PillarBody>
        <Perguntas id="perguntas" titulo="Perguntas que aparecem nesta especificação" itens={PERGUNTAS} />
      </PillarBody>

      {/* <PillarObjections id="objecoes" /> */}

      {/* <PillarClosing id="fecho" titulo="Energia que chega estável, sistema que dura mais">
        <p>
          Se o seu projeto tem restrição real de regulação, isolação, espaço ou eficiência, vale revisar a
          especificação antes de decidir entre núcleo toroidal e convencional. Depois que o restante do equipamento é
          validado em torno da escolha, mudar custa muito mais.
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

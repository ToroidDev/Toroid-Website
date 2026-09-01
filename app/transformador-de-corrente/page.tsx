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
// publicado desta página e confirmou os valores técnicos (classe de exatidão a
// partir de 0,3%, classe de tensão até 1,5 kV, tensão de isolamento até 4 kV,
// classes térmicas A e B, diâmetro interno de 5 mm a 350 mm). O único
// apontamento foi de completude, não de correção: a especificação final de um
// TC também define a corrente secundária (tipicamente 1 A ou 5 A) e a carga
// nominal em VA, o burden. Ambos entraram na tabela e no checklist abaixo.
//
// A mesma revisão trouxe conteúdo técnico de referência que não estava no site:
// relação de transformação, as duas categorias da NBR 6856, os cinco tipos
// construtivos de TC e a regra de nunca deixar o secundário aberto.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Transformador de Corrente (TC) sob Medida | Toroid",
  description:
    "Transformador de corrente para medição e proteção, com classe de exatidão a partir de 0,3%, fabricação nacional e garantia de 3 anos. Peça seu orçamento técnico.",
  alternates: {
    canonical: "/transformador-de-corrente",
    languages: {
      "pt-BR": absoluteUrl("/transformador-de-corrente"),
      es: absoluteUrl("/es/transformador-de-corrente"),
      "x-default": absoluteUrl("/transformador-de-corrente"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-resolve", titulo: "O que um TC resolve no seu circuito" },
  { id: "medicao-ou-protecao", titulo: "TC de medição ou de proteção" },
  { id: "classe-de-exatidao", titulo: "Classe de exatidão" },
  { id: "saturacao", titulo: "Saturação e curto-circuito" },
  { id: "secundario-aberto", titulo: "Nunca deixe o secundário aberto" },
  { id: "tipos-de-tc", titulo: "Tipos construtivos de TC" },
  { id: "tc-compacto", titulo: "TC compacto para painel" },
  { id: "tc-bipartido", titulo: "TC bipartido" },
  { id: "tc-resinado", titulo: "TC resinado para ambiente agressivo" },
  { id: "tc-em-scada", titulo: "TC em sistemas SCADA" },
  { id: "religadores", titulo: "TC para religadores automáticos" },
  { id: "como-testamos", titulo: "Como testamos cada TC" },
  { id: "como-especificar", titulo: "Como especificar um TC" },
  { id: "especificacoes", titulo: "Tabela de especificações" },
  { id: "perguntas", titulo: "Perguntas frequentes" },
  // { id: "objecoes", titulo: "Objeções mais comuns" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Projetado conforme ABNT NBR6856" },
  { icon: Factory, texto: "Fabricação nacional sob medida" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Classe de exatidão", "a partir de 0,3%"],
  ["Corrente secundária", "1 A ou 5 A"],
  ["Classe de tensão", "até 1,5 kV"],
  ["Tensão de isolamento", "até 4 kV"],
  ["Classe térmica", "A (105 °C); B (130 °C, sob consulta)"],
  ["Diâmetro interno", "5 mm a 350 mm"],
  ["Norma específica de TC", "ABNT NBR6856"],
  ["Robustez a curto-circuito", "conforme ABNT NBR5356-5"],
];

// A carga nominal do secundário (burden, em VA) não entra na tabela porque
// depende do conjunto de instrumentos que o TC vai alimentar, e não existe
// faixa única de linha para declarar. Por isso ela aparece como item de
// checklist: é dado que a engenharia precisa receber, não parâmetro fixo.
const CHECKLIST = [
  "Aplicação: TC de medição, de proteção, ou ambas",
  "Corrente primária e secundária nominal, ou a relação de transformação (a secundária é tipicamente 1 A ou 5 A)",
  "Carga nominal do secundário em VA, o burden que o TC precisa alimentar",
  "Classe de exatidão exigida pelo projeto ou pela concessionária",
  "Tensão máxima do equipamento e nível de isolamento",
  "Frequência nominal",
  "Corrente de curto-circuito prevista e fator térmico",
  "Diâmetro interno mínimo e diâmetro externo máximo, definidos pelo condutor ou barramento e pelo espaço no painel",
  "Quantidade de núcleos para medição e para proteção",
  "Condição ambiental de instalação: interna, externa ou industrial agressiva",
  "Necessidade de instalação bipartida, sem desenergizar o circuito",
  "Tipo de acabamento",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Qual a diferença entre TC de medição e TC de proteção?",
    resposta:
      "Um TC de medição precisa manter exatidão em condição normal de operação. Um TC de proteção precisa de comportamento previsível em condição de falta, incluindo corrente de curto-circuito muito acima da nominal, para que o relé atue no tempo certo. A ABNT NBR6856 classifica os dois como categorias distintas.",
  },
  {
    pergunta: "Como se calcula a relação de transformação de um TC?",
    resposta:
      "É a razão entre a corrente primária nominal e a corrente secundária nominal. Em um TC 100/5 A, a relação é 20, então o valor lido no secundário precisa ser multiplicado por 20 para representar a corrente que circula no primário.",
  },
  {
    pergunta: "O que é classe de exatidão em um transformador de corrente?",
    resposta:
      "É o erro máximo admissível entre a corrente real do circuito e a corrente indicada pelo TC, dentro da faixa de operação especificada. A linha Toroid parte de 0,3%.",
  },
  {
    pergunta: "O que é saturação em um transformador de corrente?",
    resposta:
      "É o limite acima do qual o núcleo deixa de acompanhar a corrente primária e o TC perde suas características elétricas originais. A partir daí o secundário não reproduz mais fielmente o primário, a exatidão declarada deixa de valer e o instrumento precisa ser substituído.",
  },
  {
    pergunta: "O que acontece se o secundário de um TC ficar aberto?",
    resposta:
      "Sem carga conectada para consumir a energia induzida no núcleo, a tensão no secundário sobe a valores perigosos. Isso pode gerar arco elétrico interno, superaquecimento e falha de isolação, além de risco de choque para quem opera o equipamento. O secundário precisa estar sempre conectado a uma carga nominal apropriada.",
  },
  {
    pergunta: "TC bipartido pode ser instalado sem desenergizar o circuito?",
    resposta:
      "Sim. O TC bipartido abre em torno do condutor já energizado, o que elimina a necessidade de desconexão para instalação ou manutenção. Em contrapartida, os dois cortes no núcleo reduzem a exatidão em relação a um TC tipo janela, de núcleo contínuo.",
  },
  {
    pergunta: "Qual norma rege o transformador de corrente no Brasil?",
    resposta:
      "A ABNT NBR6856 é a norma específica de transformadores de corrente. A ABNT NBR5356-5 trata da capacidade de resistência a curto-circuito, relevante para TC de proteção.",
  },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Transformador de Corrente (TC)",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Transformador de corrente para medição, proteção e automação industrial, com classe de exatidão a partir de 0,3%, fabricação nacional e garantia de 3 anos.",
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
        name: "Transformadores de Corrente",
        item: absoluteUrl("/transformador-de-corrente"),
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

export default function TransformadorDeCorrentePage() {
  return (
    <>
      <PillarHero
        icone="tc"
        nomeCategoria="Transformadores de Corrente"
        eyebrow="Medição, proteção e automação"
        titulo={
          <>
            O transformador de corrente errado vira ruído, aquecimento e{" "}
            <span style={{ color: "var(--color-green-light)" }}>retrabalho no painel</span>
          </>
        }
        lead="Um transformador de corrente mal especificado não avisa antes de falhar. Ele aparece como ruído elétrico que ninguém consegue rastrear, como aquecimento acima do esperado dentro do painel, ou como um projeto que não fecha porque não há espaço para o modelo de catálogo. A pergunta certa não é qual modelo comprar. É qual especificação a sua aplicação exige."
        fatos={FATOS}
      />

      {/* <PillarProof /> */}
      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose
          id="o-que-resolve"
          titulo="O que um transformador de corrente resolve no seu circuito"
          arte={
            <PillarFoto
              src="/images/produtos/tc-toroidal-janela.webp"
              alt="Transformador de corrente tipo janela, com núcleo toroidal enrolado em cobre e dois cabos de saída no secundário"
              legenda="TC tipo janela: o condutor do circuito passa pelo núcleo toroidal, que não tem corte."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Um transformador de corrente reduz uma corrente elevada, difícil e perigosa de medir diretamente, para um
            sinal secundário proporcional que instrumentos de medição, proteção e automação conseguem interpretar com
            segurança. A isolação galvânica entre o circuito de potência e o circuito de controle não é um detalhe de
            construção: é a camada de segurança que protege o operador e a instrumentação a jusante.
          </p>
          <p>
            O princípio é a indução eletromagnética descrita pela lei de Faraday: a corrente que circula no primário
            cria no núcleo ferromagnético um campo proporcional a ela, e esse campo induz no secundário uma corrente
            definida pela relação de transformação. Em um TC 100/5 A, a relação é 20, ou seja, o valor lido no
            secundário precisa ser multiplicado por 20 para representar a corrente real do circuito.
          </p>
          <p>
            A dúvida que chega até a nossa engenharia quase nunca é qual TC comprar. É qual TC resolve o problema real:
            ruído que satura o sinal, aquecimento acima do projetado, ou um painel desenhado sem espaço de sobra para o
            transformador.
          </p>
        </Prose>

        <Prose
          id="medicao-ou-protecao"
          titulo="TC de medição ou TC de proteção: a aplicação decide tudo"
          arte={
            <PillarFoto
              src="/images/produtos/tc-linha-completa.webp"
              alt="Quatro transformadores de corrente Toroid lado a lado: um com cabos de saída, um de núcleo encapsulado, um com invólucro plástico e um toroidal aberto"
              legenda="Medição e proteção saem da mesma linha. O que muda entre um TC e outro é a especificação, não o catálogo."
              largura={1200}
              altura={750}
            />
          }
        >
          <p>
            Um TC de medição precisa manter exatidão dentro de uma faixa estreita em condição normal de operação. É o
            que garante que a leitura de energia, potência ou corrente reflita o que realmente circula no sistema. Um TC
            de proteção precisa de outra coisa: comportamento previsível em condição de falta, incluindo corrente de
            curto-circuito muito acima da nominal, para que o relé atue no tempo certo.
          </p>
          <p>
            Tratar os dois como o mesmo produto é uma causa comum de retrabalho. Um TC dimensionado apenas para medição
            pode saturar exatamente no momento em que a proteção mais precisa de um sinal confiável. A especificação
            correta parte da aplicação, não do que está em estoque.
          </p>
          <p>
            A diferença aparece também no tempo de resposta. O TC de proteção precisa de atuação praticamente
            instantânea, porque alimenta um relé que decide abrir o circuito em condição de falta. O TC de medição
            trabalha no outro extremo: prioriza leitura precisa e estável para monitoramento e análise do sistema
            elétrico, em regime normal.
          </p>
          <p>
            A ABNT NBR6856 é a norma que rege transformadores de corrente no Brasil e classifica o TC exatamente nessas
            duas categorias, medição e proteção. É a referência usada em toda a linha de TCs da Toroid, da classe de
            exatidão ao comportamento em sobrecorrente.
          </p>
        </Prose>

        <Prose
          id="classe-de-exatidao"
          titulo="Classe de exatidão: o número que decide se a sua medição é confiável"
          arte={
            <PillarFoto
              src="/images/produtos/tc-etiqueta-classe.webp"
              alt="Transformador de corrente Toroid com isolação laranja e etiqueta de identificação com relação 300/0,2 A, classe 1,2C12,5, 50/60 Hz e número de lote"
              legenda="Relação, classe de exatidão, carga nominal e lote saem impressos na peça."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            A classe de exatidão expressa o erro máximo admissível entre a corrente real do circuito e a corrente
            indicada pelo TC, dentro da faixa de operação especificada. Na linha Toroid a precisão parte de 0,3%, o
            suficiente para medição de faturamento e para malhas de proteção que não toleram erro de leitura acima do
            previsto em projeto.
          </p>
          <p>
            Para quem especifica, esse número se traduz em confiabilidade de dado de campo sem ajuste posterior: menos
            retrabalho de calibração, menos contestação de faturamento de energia, menos risco de uma decisão de
            proteção tomada sobre leitura errada.
          </p>
        </Prose>

        <Prose id="saturacao" titulo="Saturação e proteção: como evitar leitura errada no curto-circuito">
          <p>
            Corrente de curto-circuito é o cenário em que um TC mal dimensionado falha sem avisar. O núcleo satura, o
            sinal secundário deixa de ser proporcional à corrente real, e o relé de proteção pode não atuar no tempo
            certo, ou atuar quando não deveria.
          </p>
          <p>
            Saturação é o limite acima do qual o instrumento deixa de sustentar suas características elétricas
            originais. Passado esse ponto, a corrente do secundário não reproduz mais fielmente a corrente do primário,
            a exatidão declarada em projeto deixa de valer e o TC precisa ser substituído. Não é um desvio que se
            corrige na calibração.
          </p>
          <p>
            A robustez elétrica frente a curto-circuito, tratada na ABNT NBR5356-5, entra no dimensionamento de um TC de
            proteção ao lado da classe de exatidão e do fator de sobrecorrente. Em automação industrial e integração de
            sistemas isso pesa mais do que qualquer folha de especificação isolada: um projeto de proteção é tão
            confiável quanto o elo mais fraco da cadeia de medição.
          </p>

          <Pullquote fonte="Toroid do Brasil">
            Especificação correta não é burocracia. É a diferença entre um projeto que funciona e um que gera
            retrabalho.
          </Pullquote>
        </Prose>

        <PillarAviso id="secundario-aberto" titulo="Nunca deixe o secundário do TC aberto">
          <p>
            Com o TC já instalado, o secundário nunca deve ficar aberto. Sem carga conectada para consumir a energia
            induzida pelo fluxo magnético no núcleo, a tensão no secundário sobe muito acima do previsto, e três coisas
            passam a ser possíveis ao mesmo tempo:
          </p>
          <ul>
            <li>
              <strong>Tensão elevada.</strong> A tensão induzida sem carga pode gerar arco elétrico interno,
              superaquecimento e falha de isolação, comprometendo o transformador e gerando custo de reparo ou de
              substituição.
            </li>
            <li>
              <strong>Perda de precisão na medição.</strong> Com o secundário aberto, a corrente proporcional deixa de
              poder ser medida ou monitorada corretamente, o que propaga erro para os sistemas de proteção e controle
              que dependem dessa leitura.
            </li>
            <li>
              <strong>Risco à segurança pessoal.</strong> Tensão elevada e falha estrutural no transformador expõem
              quem opera e quem faz manutenção a choque elétrico grave.
            </li>
          </ul>
          <p>
            A regra prática é simples: o secundário de um transformador de corrente fica sempre conectado a uma carga
            nominal apropriada. É o que preserva o equipamento, a exatidão da medição e a segurança de quem trabalha no
            painel.
          </p>
        </PillarAviso>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose
          id="tipos-de-tc"
          titulo="Tipos construtivos de transformador de corrente"
          arte={
            <PillarFoto
              src="/images/produtos/tc-com-involucro.webp"
              alt="Transformador de corrente com invólucro plástico preto, janela central para passagem do condutor e bornes secundários na parte superior"
              legenda="Construção tipo janela com invólucro, com os bornes do secundário protegidos para montagem em painel."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Antes de falar de faixa e de exatidão, vale separar as construções. O tipo construtivo define como o TC é
            inserido no circuito e, por consequência, quanta precisão ele consegue entregar e quanta intervenção a
            instalação exige.
          </p>
          <ul>
            <li>
              <strong>Janela.</strong> Núcleo toroidal atravessado pelo próprio condutor do circuito. Como o núcleo não
              tem nenhum corte, é a construção de menor erro de medição. Em compensação, a instalação exige intervenção
              no sistema para passar o condutor pela janela.
            </li>
            <li>
              <strong>Bipartido.</strong> Núcleo dividido em duas partes que se fecham em torno do condutor, o que torna
              a instalação e a manutenção bem menos invasivas. Os dois cortes no núcleo custam precisão em relação ao
              tipo janela.
            </li>
            <li>
              <strong>Barra.</strong> O primário é uma barra condutora, de material de alta condutividade e baixa
              resistividade para minimizar perdas, e o secundário gera o sinal proporcional à corrente que passa por
              ela. Construção usada em medição de correntes elevadas.
            </li>
            <li>
              <strong>Bucha.</strong> Encapsulado em resina ou em isolante robusto, aplicado em equipamento de alta
              tensão como disjuntores e transformadores de força, onde a própria bucha isolante precisa suportar o
              nível de tensão do sistema.
            </li>
            <li>
              <strong>Enrolado.</strong> Primário e secundário bobinados, ligados em série com o circuito a ser medido.
              Exige abertura do circuito para inserção, então é a construção mais invasiva, e por isso costuma ser
              aplicada em correntes menores.
            </li>
          </ul>
          <p>
            A linha Toroid é construída em torno das construções janela e bipartida, com ou sem encapsulamento em
            resina, dentro da classe de tensão de até 1,5 kV. As demais entram aqui como referência de especificação.
            Se o seu projeto pede outra construção, vale descrever a aplicação para a engenharia avaliar.
          </p>
        </Prose>

        <Prose id="tc-compacto" titulo="TC compacto para painel">
          <p>
            Pouco espaço no painel não deveria comprometer o desempenho do sistema. O TC compacto da Toroid foi
            desenvolvido para caber em quadro elétrico com espaço já definido pelo projeto, sem obrigar o projetista a
            redesenhar o painel para acomodar o transformador.
          </p>
          <p>
            O diâmetro interno de 5 mm a 350 mm cobre desde condutores individuais até barramentos de maior seção. Isso
            permite manter a mesma linha do menor ao maior painel de um mesmo projeto, o que significa menos variação de
            fornecedor e menos código de item para compras administrar. Quando o padrão não cobre a instalação,
            avaliamos customização sob medida.
          </p>
        </Prose>

        <Prose
          id="tc-bipartido"
          titulo="TC bipartido: quando instalar sem desenergizar o circuito"
          arte={
            <PillarFoto
              src="/images/produtos/tc-resinado-bipartido.webp"
              alt="Dois transformadores de corrente encapsulados em resina epóxi preta: à esquerda um tipo janela de núcleo contínuo, à direita um bipartido com parafusos borboleta que abrem o núcleo"
              legenda="À esquerda, o tipo janela de núcleo contínuo. À direita, o bipartido, que abre em torno do condutor já energizado."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Existe projeto em que desligar o circuito para instalar ou substituir um transformador de corrente custa
            mais do que a peça em si. Numa planta que não pode parar, cada hora de parada tem preço. O TC bipartido abre
            em torno do condutor já energizado e elimina a necessidade de desconexão para instalação ou manutenção.
          </p>
          <p>
            É uma característica de construção que resolve um problema operacional, não apenas elétrico: retrofit em
            painel existente, manutenção programada sem desligar a carga, substituição em campo sem impacto na produção.
          </p>
          <p>
            O contraponto está nos tipos construtivos acima: os dois cortes no núcleo custam exatidão em relação ao tipo
            janela. Quando a aplicação exige o menor erro de medição possível, é essa variável que decide entre as duas
            construções.
          </p>
        </Prose>

        <Prose
          id="tc-resinado"
          titulo="TC resinado: proteção extra em ambiente agressivo"
          arte={
            <PillarFoto
              src="/images/produtos/tc-bipartido-resinado.webp"
              alt="Transformador de corrente bipartido encapsulado em resina epóxi preta, com parafusos de fixação que fecham o núcleo em torno do condutor e dois cabos de saída"
              legenda="Encapsulamento em resina epóxi: a mesma peça ganha proteção mecânica e isolação contra umidade e poeira condutiva."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Ambiente com poeira condutiva, umidade ou variação térmica acentuada desgasta isolação convencional mais
            rápido do que o previsto em projeto. O encapsulamento em resina epóxi adiciona uma camada de proteção
            mecânica e de isolação contra esses fatores, o mesmo princípio de acabamento aplicado na linha de
            transformadores de potência para aplicação crítica.
          </p>
          <p>
            Para quem especifica equipamento que vai operar em ambiente industrial não controlado, essa é a diferença
            entre uma peça que dura o ciclo de vida do projeto e uma que exige substituição antes do previsto. O impacto
            aparece no custo total de propriedade do painel, não na cotação inicial.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose
          id="tc-em-scada"
          titulo="TC em SCADA: dado de campo em que a automação pode confiar"
          arte={
            <PillarFoto
              src="/images/produtos/tc-montado-em-placa.webp"
              alt="Conjunto de três transformadores de corrente toroidais fixados em uma placa de fenolite, ligados a uma régua de bornes numerada"
              legenda="Conjunto de três TCs montado em placa, com régua de bornes identificada, pronto para entrar no painel."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Um sistema SCADA é tão bom quanto o dado que chega até ele. Um transformador de corrente com classe de
            exatidão inadequada para o ponto de medição gera um erro que se propaga por toda a cadeia de supervisão, e
            que ninguém percebe até o dado de campo deixar de bater com o balanço de energia.
          </p>
          <p>
            Especificar o TC para o ponto de instrumentação, e não apenas para o painel em geral, é o que dá
            estabilidade ao sistema de supervisão desde o primeiro dia de operação.
          </p>
        </Prose>

        <Prose id="religadores" titulo="TC para religadores automáticos: robustez em rede de distribuição">
          <p>
            Religador automático opera em rede de distribuição, exposto a curto-circuito, sobrecorrente transitória e
            ciclos de religamento sucessivos em intervalo curto. O transformador de corrente que alimenta a proteção
            desse equipamento precisa manter exatidão e confiabilidade sob esse regime, que é mais exigente do que a
            operação normal de um painel industrial.
          </p>
          <p>
            É um dos casos em que a robustez frente a curto-circuito pesa tanto quanto a classe de exatidão na decisão
            de especificação.
          </p>
        </Prose>

        <Prose id="como-testamos" titulo="Como testamos cada TC antes do embarque">
          <p>
            100% dos transformadores de corrente produzidos passam por teste elétrico antes de sair da fábrica, não
            por amostragem. O laboratório mede tensão e corrente a vazio, erro e comportamento em saturação, ângulo de
            defasagem, indutância, isolação e polaridade.
          </p>
          <p>
            São os mesmos parâmetros que definem se um TC vai se comportar como previsto em campo: erro e saturação
            confirmam a classe de exatidão declarada, e o ângulo de defasagem e a polaridade evitam retrabalho de
            instalação em painel e em malha de proteção.
          </p>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes da cotação"
        titulo="Como especificar um transformador de corrente"
        lead="Estas são as informações que a nossa engenharia pede para transformar uma cotação genérica em especificação sob medida. Quanto mais completa a lista, menor o risco de retrabalho depois da instalação."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <PillarSpecTable
          id="especificacoes"
          titulo="Especificações da linha de transformadores de corrente"
          linhas={ESPECIFICACOES}
          nota="Parâmetros da linha padrão. Aplicação fora dessas faixas é avaliada caso a caso pela engenharia."
        />
      </PillarBody>

      <PillarBody>
        <Perguntas id="perguntas" titulo="Perguntas que aparecem nesta especificação" itens={PERGUNTAS} />
      </PillarBody>

      {/* <PillarObjections id="objecoes" /> */}

      <PillarClosing id="fecho" titulo="Comece pela restrição, não pelo código do produto">
        <p>
          Se o seu painel tem restrição de espaço, exigência de exatidão específica, ou histórico de TC que não durou o
          esperado, descreva a restrição para a nossa engenharia antes de fechar a especificação. É mais rápido do que
          comparar catálogos.
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

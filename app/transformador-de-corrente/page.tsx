import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import {
  PillarBody,
  PillarChecklist,
  PillarClosing,
  PillarHero,
  PillarIndex,
  PillarSpecTable,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// ATENÇÃO, VERIFICAR ENGENHARIA: os valores técnicos desta página (classe de
// exatidão a partir de 0,3%, classe de tensão até 1,5 kV, tensão de isolamento
// até 4 kV, classes térmicas A e B, diâmetro interno de 5 mm a 350 mm) vêm do
// brand book e ainda NÃO passaram por validação formal da engenharia.
// Confirmar antes do primeiro deploy em produção e antes de qualquer uso em
// proposta comercial vinculante. Ver CLAUDE.md e brand-book/05-glossario-tecnico.md.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Transformador de Corrente (TC) sob Medida | Toroid",
  description:
    "Transformador de corrente para medição e proteção, com classe de exatidão a partir de 0,3%, fabricação nacional e garantia de 3 anos. Peça seu orçamento técnico.",
  alternates: { canonical: "/transformador-de-corrente" },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-resolve", titulo: "O que um TC resolve no seu circuito" },
  { id: "medicao-ou-protecao", titulo: "TC de medição ou de proteção" },
  { id: "classe-de-exatidao", titulo: "Classe de exatidão" },
  { id: "saturacao", titulo: "Saturação e curto-circuito" },
  { id: "tc-compacto", titulo: "TC compacto para painel" },
  { id: "tc-bipartido", titulo: "TC bipartido" },
  { id: "tc-resinado", titulo: "TC resinado para ambiente agressivo" },
  { id: "toroidal-ou-convencional", titulo: "Núcleo toroidal ou convencional" },
  { id: "tc-em-scada", titulo: "TC em sistemas SCADA" },
  { id: "religadores", titulo: "TC para religadores automáticos" },
  { id: "como-especificar", titulo: "Como especificar um TC" },
  { id: "especificacoes", titulo: "Tabela de especificações" },
  { id: "objecoes", titulo: "Objeções mais comuns" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Projetado conforme ABNT NBR6856" },
  { icon: Factory, texto: "Fabricação nacional sob medida" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Classe de exatidão", "a partir de 0,3%"],
  ["Classe de tensão", "até 1,5 kV"],
  ["Tensão de isolamento", "até 4 kV"],
  ["Classe térmica", "A (105 °C); B (130 °C, sob consulta)"],
  ["Diâmetro interno", "5 mm a 350 mm"],
  ["Norma específica de TC", "ABNT NBR6856"],
  ["Robustez a curto-circuito", "conforme ABNT NBR5356-5"],
];

const CHECKLIST = [
  "Aplicação: medição, proteção, ou ambas",
  "Corrente primária nominal e corrente de curto-circuito prevista",
  "Classe de exatidão exigida pelo projeto ou pela concessionária",
  "Diâmetro do condutor ou barramento, que define o diâmetro interno do TC",
  "Espaço disponível no painel",
  "Condição ambiental de instalação: interna, externa ou industrial agressiva",
  "Necessidade de instalação bipartida, sem desenergizar o circuito",
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
      { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores de Corrente",
        item: "https://toroid.com.br/transformador-de-corrente",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Qual a diferença entre TC de medição e TC de proteção?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Um TC de medição precisa manter exatidão em condição normal de operação. Um TC de proteção precisa de comportamento previsível em condição de falta, incluindo corrente de curto-circuito muito acima da nominal, para que o relé atue no tempo certo.",
        },
      },
      {
        "@type": "Question",
        name: "O que é classe de exatidão em um transformador de corrente?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "É o erro máximo admissível entre a corrente real do circuito e a corrente indicada pelo TC, dentro da faixa de operação especificada. A linha Toroid parte de 0,3%.",
        },
      },
      {
        "@type": "Question",
        name: "TC bipartido pode ser instalado sem desenergizar o circuito?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. O TC bipartido abre em torno do condutor já energizado, o que elimina a necessidade de desconexão para instalação ou manutenção.",
        },
      },
      {
        "@type": "Question",
        name: "Qual norma rege o transformador de corrente no Brasil?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A ABNT NBR6856 é a norma específica de transformadores de corrente. A ABNT NBR5356-5 trata da capacidade de resistência a curto-circuito, relevante para TC de proteção.",
        },
      },
    ],
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
        <Prose id="o-que-resolve" titulo="O que um transformador de corrente resolve no seu circuito">
          <p>
            Um transformador de corrente reduz uma corrente elevada, difícil e perigosa de medir diretamente, para um
            sinal secundário proporcional que instrumentos de medição, proteção e automação conseguem interpretar com
            segurança. A isolação galvânica entre o circuito de potência e o circuito de controle não é um detalhe de
            construção: é a camada de segurança que protege o operador e a instrumentação a jusante.
          </p>
          <p>
            A dúvida que chega até a nossa engenharia quase nunca é qual TC comprar. É qual TC resolve o problema real:
            ruído que satura o sinal, aquecimento acima do projetado, ou um painel desenhado sem espaço de sobra para o
            transformador.
          </p>
        </Prose>

        <Prose id="medicao-ou-protecao" titulo="TC de medição ou TC de proteção: a aplicação decide tudo">
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
            A ABNT NBR6856 é a norma que rege transformadores de corrente no Brasil e é a referência usada em toda a
            linha de TCs da Toroid, da classe de exatidão ao comportamento em sobrecorrente.
          </p>
        </Prose>

        <Prose id="classe-de-exatidao" titulo="Classe de exatidão: o número que decide se a sua medição é confiável">
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
      </PillarBody>

      <PillarBody tone="tint">
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

        <Prose id="tc-bipartido" titulo="TC bipartido: quando instalar sem desenergizar o circuito">
          <p>
            Existe projeto em que desligar o circuito para instalar ou substituir um transformador de corrente custa
            mais do que a peça em si. Numa planta que não pode parar, cada hora de parada tem preço. O TC bipartido abre
            em torno do condutor já energizado e elimina a necessidade de desconexão para instalação ou manutenção.
          </p>
          <p>
            É uma característica de construção que resolve um problema operacional, não apenas elétrico: retrofit em
            painel existente, manutenção programada sem desligar a carga, substituição em campo sem impacto na produção.
          </p>
        </Prose>

        <Prose id="tc-resinado" titulo="TC resinado: proteção extra em ambiente agressivo">
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
        <Prose id="toroidal-ou-convencional" titulo="Núcleo toroidal ou bobinado convencional: qual atende o projeto">
          <p>
            A construção toroidal reduz o volume ocupado pelo núcleo e distribui o campo magnético de forma mais
            uniforme, o que favorece exatidão em espaço reduzido de painel. A construção convencional pode ser a escolha
            certa quando o projeto já está consolidado em torno dela, ou quando o custo por unidade pesa mais do que o
            ganho de espaço.
          </p>
          <p>
            Cada tecnologia atende necessidades diferentes. A pergunta útil não é qual núcleo é melhor em abstrato, e
            sim qual gera mais valor para os objetivos deste projeto: espaço no painel, exatidão exigida, ou custo total
            ao longo do ciclo de vida do equipamento.
          </p>
        </Prose>

        <Prose id="tc-em-scada" titulo="TC em SCADA: dado de campo em que a automação pode confiar">
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

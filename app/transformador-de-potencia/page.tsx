import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
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

// ATENÇÃO, VERIFICAR ENGENHARIA: os valores técnicos desta página (faixa de
// 5 VA a 15 kVA, 50 Hz a 800 Hz, tensão de isolamento até 4 kV, eficiência até
// 98%, regulação até 1%) vêm do brand book e ainda NÃO passaram por validação
// formal da engenharia. Confirmar antes do primeiro deploy em produção e antes
// de qualquer uso em proposta comercial vinculante. Ver CLAUDE.md e
// brand-book/05-glossario-tecnico.md. Esses valores viviam antes na página de
// Transformadores Toroidais; migraram pra aqui porque descrevem a linha de
// potência em geral, não uma vantagem específica do núcleo toroidal.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Transformador de Potência sob Medida | Toroid do Brasil",
  description:
    "Transformador de potência com isolação galvânica, eficiência até 98% e núcleo toroidal ou convencional conforme o projeto. Peça orçamento técnico com a nossa engenharia.",
  alternates: { canonical: "/transformador-de-potencia" },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-resolve", titulo: "O que um transformador de potência resolve no seu projeto" },
  { id: "isolacao-e-eficiencia", titulo: "Isolação galvânica e eficiência" },
  { id: "nucleo-toroidal-ou-convencional", titulo: "Núcleo toroidal ou convencional" },
  { id: "materias-primas", titulo: "Matérias-primas: aço e cobre" },
  { id: "acabamentos", titulo: "Encapsulado, resinado ou simples" },
  { id: "medico", titulo: "Equipamento médico" },
  { id: "solar", titulo: "Energia solar e geração distribuída" },
  { id: "como-especificar", titulo: "Como especificar um transformador de potência" },
  { id: "especificacoes", titulo: "Tabela de especificações" },
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
  "Potência necessária e faixa de tensão de entrada e de saída",
  "Frequência de operação: rede padrão ou frequência específica do equipamento",
  "Espaço físico disponível no gabinete ou no produto final",
  "Ambiente de instalação: padrão, industrial, externo ou médico",
  "Necessidade de blindagem adicional contra EMI",
  "Volume do pedido e prazo do projeto",
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
      { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores de Potência",
        item: "https://toroid.com.br/transformador-de-potencia",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Qual a eficiência de um transformador de potência Toroid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A linha Toroid opera com eficiência de até 98% e regulação de até 1%.",
        },
      },
      {
        "@type": "Question",
        name: "Transformador de potência pode ser usado em equipamento médico?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. A construção tipo seco, sem óleo isolante, é enquadrada na ABNT NBR5356-11, e a linha Toroid é RoHS Compliant.",
        },
      },
      {
        "@type": "Question",
        name: "Qual a diferença entre acabamento Mylar e resina epóxi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mylar oferece isolação elétrica em aplicação padrão. O encapsulamento em resina epóxi adiciona proteção mecânica e resistência a umidade, poeira e variação térmica, indicado para ambiente agressivo.",
        },
      },
      {
        "@type": "Question",
        name: "O transformador de potência pode ter núcleo toroidal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. A linha pode ser fornecida em núcleo toroidal ou em construção convencional E/I, dependendo da restrição do projeto. Cada tecnologia atende necessidades diferentes.",
        },
      },
    ],
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
        <Prose id="o-que-resolve" titulo="O que um transformador de potência resolve no seu projeto">
          <p>
            Um transformador de potência entrega a tensão e a corrente que o restante do circuito precisa, isolando
            galvanicamente o lado de alimentação do lado de carga. Essa isolação não é um detalhe construtivo: é a
            camada de segurança que protege equipamento e operador contra falha do lado de potência.
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

        <Prose id="nucleo-toroidal-ou-convencional" titulo="Núcleo toroidal ou convencional: qual atende o projeto">
          <p>
            A linha de transformadores de potência Toroid pode ser fornecida em núcleo toroidal ou em construção
            convencional E/I. A escolha entre as duas depende da restrição real do projeto: espaço no gabinete, peso
            do produto final, ruído audível ou custo por unidade.
          </p>
          <p>
            Cada tecnologia atende necessidades diferentes, e não existe resposta genérica que valha para todo
            projeto. O comparativo completo entre núcleo toroidal e convencional, incluindo quando cada um gera mais
            valor, está em{" "}
            <Link href="/transformadores-toroidais">Transformadores Toroidais</Link>.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="materias-primas" titulo="Matérias-primas: aço silício e cobre esmaltado">
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

        <Prose id="acabamentos" titulo="Encapsulado, resinado ou simples: qual acabamento protege o projeto">
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

        <Prose id="medico" titulo="Transformador de potência para equipamento médico">
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
        <Prose id="solar" titulo="Transformador de potência para energia solar e geração distribuída">
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

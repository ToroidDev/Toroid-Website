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

// ATENÇÃO, VERIFICAR ENGENHARIA: os valores técnicos desta página (faixa de
// 50 Hz a 800 Hz, tensão de isolamento até 4 kV, eficiência até 98%, regulação
// até 1%, redução de tamanho e peso de 30% a 60% em relação ao E/I, faixa de
// 5 VA a 15 kVA) vêm do brand book e ainda NÃO passaram por validação formal da
// engenharia. Confirmar antes do primeiro deploy em produção e antes de
// qualquer uso em proposta comercial vinculante.
// Ver CLAUDE.md e brand-book/05-glossario-tecnico.md.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Transformador Toroidal sob Medida | Toroid do Brasil",
  description:
    "Transformador toroidal com isolação galvânica, eficiência até 98% e até 60% menos peso que o convencional. Peça orçamento técnico com a nossa engenharia.",
  alternates: { canonical: "/produtos/transformadores-toroidais" },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-muda", titulo: "O que muda com um núcleo toroidal" },
  { id: "toroidal-ou-convencional", titulo: "Toroidal ou convencional E/I" },
  { id: "isolacao-e-eficiencia", titulo: "Isolação galvânica e eficiência" },
  { id: "acabamentos", titulo: "Encapsulado, resinado ou simples" },
  { id: "iluminacao", titulo: "Iluminação arquitetônica" },
  { id: "audio", titulo: "Áudio profissional" },
  { id: "medico", titulo: "Equipamento médico" },
  { id: "solar", titulo: "Energia solar" },
  { id: "como-dimensionar", titulo: "Como dimensionar um toroidal" },
  { id: "especificacoes", titulo: "Tabela de especificações" },
  { id: "objecoes", titulo: "Objeções mais comuns" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Tipo seco conforme ABNT NBR5356-11" },
  { icon: Factory, texto: "Acabamento em Mylar ou resina epóxi" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Faixa de potência", "5 VA a 15 kVA"],
  ["Frequência de operação", "50 Hz a 800 Hz"],
  ["Isolação", "galvânica, com blindagem eletrostática e eletromagnética"],
  ["Tensão de isolamento", "até 4 kV"],
  ["Eficiência", "até 98%"],
  ["Regulação", "até 1%"],
  ["Redução de tamanho e peso frente ao E/I", "30% a 60%"],
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
    name: "Transformador Toroidal",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Transformador toroidal com isolação galvânica, eficiência até 98% e redução de tamanho e peso de 30% a 60% em relação ao convencional E/I.",
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
        name: "Transformadores Toroidais",
        item: "https://toroid.com.br/produtos/transformadores-toroidais",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Transformador toroidal é melhor que o convencional E/I?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cada tecnologia atende necessidades diferentes. O toroidal reduz tamanho, peso e ruído audível. O convencional pode ser mais adequado quando o custo por unidade pesa mais que o ganho de espaço, ou quando o projeto já está consolidado em torno dele.",
        },
      },
      {
        "@type": "Question",
        name: "Qual a eficiência de um transformador toroidal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A linha Toroid opera com eficiência de até 98% e regulação de até 1%.",
        },
      },
      {
        "@type": "Question",
        name: "Transformador toroidal pode ser usado em equipamento médico?",
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
    ],
  },
];

export default function TransformadoresToroidaisPage() {
  return (
    <>
      <PillarHero
        icone="toroidal"
        nomeCategoria="Transformadores Toroidais"
        eyebrow="Isolação galvânica e baixa irradiação"
        titulo={
          <>
            Transformador toroidal ou convencional? A resposta depende{" "}
            <span style={{ color: "var(--color-green-light)" }}>da restrição do seu projeto</span>
          </>
        }
        lead="Se o seu projeto já roda com transformador convencional e alguém sugeriu migrar para um transformador toroidal, a pergunta que importa não é qual tecnologia é melhor. É qual delas resolve a restrição real do projeto: espaço no gabinete, peso do equipamento final, ruído audível, ou eficiência energética."
        fatos={FATOS}
      />

      {/* <PillarProof /> */}
      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo="O que muda na engenharia com um núcleo toroidal">
          <p>
            Um transformador toroidal enrola primário e secundário sobre um núcleo em forma de anel, no lugar da
            construção E/I tradicional com núcleo laminado empilhado. Essa geometria distribui o campo magnético de
            forma mais uniforme ao redor do núcleo, o que reduz a irradiação para fora do equipamento e diminui as
            perdas em vazio.
          </p>
          <p>
            Para quem especifica, isso aparece como três características mensuráveis: menos ruído audível em operação,
            menos calor dissipado para o mesmo nível de potência, e volume físico menor para a mesma faixa de trabalho.
          </p>
        </Prose>

        <Prose id="toroidal-ou-convencional" titulo="Toroidal ou convencional: qual gera mais valor para o projeto">
          <p>
            A construção toroidal reduz tamanho e peso de 30% a 60% em relação ao convencional E/I, elimina o gap de
            entreferro do núcleo laminado e opera de forma mais silenciosa. São vantagens relevantes quando o projeto
            tem restrição de espaço, limite de peso no produto final ou baixa tolerância a ruído audível.
          </p>
          <p>
            A construção convencional continua sendo a escolha certa em outros cenários: quando o custo por unidade pesa
            mais do que o ganho de espaço, ou quando o projeto já está validado em torno dela e migrar significaria
            requalificar todo o restante do equipamento.
          </p>
          <p>
            Cada tecnologia atende necessidades diferentes. A pergunta útil não é qual núcleo é superior em abstrato, e
            sim qual gera mais valor para os objetivos específicos deste projeto. Essa resposta muda de aplicação para
            aplicação.
          </p>
        </Prose>

        <Prose id="isolacao-e-eficiencia" titulo="Isolação galvânica e eficiência: o que protege o sistema">
          <p>
            A isolação galvânica entre primário e secundário protege o circuito de controle contra falha do lado de
            potência. É requisito de segurança, não recurso opcional. Combinada com blindagem eletrostática e
            eletromagnética, essa isolação também reduz a interferência que o transformador introduz no restante do
            sistema, o que importa especialmente em equipamento sensível a ruído elétrico.
          </p>
          <p>
            A linha Toroid opera com eficiência de até 98% e regulação de até 1%, com tensão de isolamento de até 4 kV e
            faixa de frequência de 50 Hz a 800 Hz. Isso cobre tanto aplicação de rede padrão quanto equipamento que
            opera em frequência não convencional.
          </p>

          <Pullquote fonte="Toroid do Brasil">
            Operações críticas não esperam apenas energia. Esperam estabilidade.
          </Pullquote>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="acabamentos" titulo="Encapsulado, resinado ou simples: qual acabamento protege o projeto">
          <p>
            O acabamento muda o que o transformador resiste no ambiente de instalação, não a tecnologia em si. O Mylar
            oferece isolação elétrica em aplicação padrão. O encapsulamento em resina epóxi adiciona proteção mecânica e
            resistência a umidade, poeira e variação térmica, o que aumenta a durabilidade em ambiente agressivo.
          </p>
          <p>
            Especificar o acabamento pelo ambiente real de instalação evita um problema comum: transformador que
            funciona bem em bancada de teste e degrada antes do previsto em campo.
          </p>
        </Prose>

        <Prose id="iluminacao" titulo="Transformador toroidal para iluminação arquitetônica">
          <p>
            Projeto de iluminação arquitetônica, em museu, fachada ou ambiente de exposição, costuma exigir o
            transformador mais discreto possível: sem ruído audível perceptível a poucos metros e sem aquecimento que
            force ventilação adicional no gabinete. O funcionamento silencioso e a redução de tamanho da construção
            toroidal atendem essa restrição sem comprometer a regulação de tensão da luminária alimentada.
          </p>
        </Prose>

        <Prose id="audio" titulo="Transformador toroidal para áudio profissional">
          <p>
            Em equipamento de áudio profissional o transformador de alimentação é uma fonte conhecida de ruído induzido
            quando mal isolado. A baixa irradiação de campo magnético do núcleo toroidal reduz o acoplamento indesejado
            com estágios de sinal sensíveis. É por comportamento eletromagnético mensurável, não por preferência de
            mercado, que boa parte dos fabricantes de amplificador de referência parte do toroidal como padrão de
            projeto.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose id="medico" titulo="Transformador toroidal para equipamento médico">
          <p>
            Equipamento médico tem exigência de segurança elétrica que não deixa margem para interpretação: isolação
            galvânica robusta, baixa corrente de fuga e comportamento previsível sob falha. A construção toroidal tipo
            seco, sem óleo isolante, enquadrada na ABNT NBR5356-11, atende esse perfil de aplicação. A certificação RoHS
            Compliant é relevante para quem fabrica para mercado regulado.
          </p>
          <p>
            Aqui a especificação técnica documentada pesa mais do que preço unitário. Homologação de equipamento médico
            não tolera fornecedor que não sustente o dado técnico com norma.
          </p>
        </Prose>

        <Prose id="solar" titulo="Transformador toroidal para energia solar">
          <p>
            Em geração distribuída e energia solar, a eficiência do transformador se acumula ao longo de milhares de
            horas de operação. Um ponto percentual de perda a mais é energia gerada e não entregue. A eficiência de até
            98%, combinada com regulação de até 1%, contribui diretamente para o desempenho global do sistema,
            especialmente em instalação com espaço já restrito por definição de projeto.
          </p>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-dimensionar"
        eyebrow="Antes da cotação"
        titulo="Como dimensionar um transformador toroidal"
        lead="É esse conjunto de informações que separa uma cotação de catálogo de uma especificação sob medida, inclusive quando o padrão não cabe no gabinete do produto final e o projeto exige customização."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <PillarSpecTable
          id="especificacoes"
          titulo="Especificações da linha de transformadores toroidais"
          linhas={ESPECIFICACOES}
          nota="Parâmetros da linha padrão. Aplicação fora dessas faixas é avaliada caso a caso pela engenharia."
        />
      </PillarBody>

      {/* <PillarObjections id="objecoes" /> */}

      <PillarClosing id="fecho" titulo="Energia que chega eficiente, sistema que dura mais">
        <p>
          Se o seu projeto tem restrição real de espaço, peso, ruído ou eficiência, vale revisar a especificação antes
          de decidir entre toroidal e convencional. Depois que o restante do equipamento é validado em torno da escolha,
          mudar custa muito mais.
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

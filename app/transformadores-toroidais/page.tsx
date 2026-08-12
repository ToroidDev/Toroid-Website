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
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// Esta página não é mais uma das 3 famílias de produto (essa família agora é
// Transformador de Potência, ver app/transformador-de-potencia/page.tsx). O
// núcleo toroidal é uma tecnologia que atravessa TC, TP e Indutores, não uma
// linha própria — por isso esta página explica a tecnologia e compara com o
// convencional, sem tabela de especificações e sem schema Product isolado.
// A URL/canonical NÃO muda: já é indexada e ranqueia, então fica exatamente
// aqui, só muda o papel do conteúdo.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Transformador Toroidal: Como Funciona e Quando Escolher | Toroid do Brasil",
  description:
    "Entenda como funciona o núcleo toroidal, quando ele gera mais valor que o convencional E/I, e em quais linhas da Toroid essa tecnologia está disponível.",
  alternates: { canonical: "/transformadores-toroidais" },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-muda", titulo: "O que muda com um núcleo toroidal" },
  { id: "toroidal-ou-convencional", titulo: "Toroidal ou convencional E/I" },
  { id: "iluminacao", titulo: "Iluminação arquitetônica" },
  { id: "audio", titulo: "Áudio profissional" },
  { id: "como-escolher", titulo: "Como decidir entre toroidal e convencional" },
  { id: "objecoes", titulo: "Objeções mais comuns" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Tipo seco conforme ABNT NBR5356-11" },
  { icon: Factory, texto: "Até 60% menos peso que o convencional E/I" },
];

const CHECKLIST = [
  "Restrição de espaço ou peso no gabinete ou no produto final",
  "Tolerância a ruído audível na aplicação",
  "Sensibilidade do sistema a interferência eletromagnética no entorno",
  "Se o restante do equipamento já está validado em torno de um núcleo convencional",
  "Peso do custo por unidade frente ao ganho de espaço e peso",
  "Volume do pedido e prazo do projeto",
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
        name: "Transformadores Toroidais",
        item: "https://toroid.com.br/transformadores-toroidais",
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
        name: "Um núcleo toroidal é mais eficiente que um convencional E/I?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tende a ser: a geometria toroidal reduz as perdas em vazio por distribuir o campo magnético de forma mais uniforme e não ter entreferro. Para os valores de eficiência e regulação da linha Toroid, veja Transformadores de Potência.",
        },
      },
      {
        "@type": "Question",
        name: "Em que aplicações o núcleo toroidal faz mais diferença?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Em aplicações sensíveis a ruído audível ou a interferência eletromagnética, como áudio profissional e iluminação arquitetônica, e em projetos com restrição real de espaço ou peso. Nesses casos a redução de tamanho, peso e ruído da construção toroidal costuma justificar a troca.",
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

          <Pullquote fonte="Toroid do Brasil">
            A pergunta certa não é qual núcleo é melhor. É qual gera mais valor para este projeto.
          </Pullquote>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
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

      <PillarChecklist
        id="como-escolher"
        eyebrow="Antes de decidir"
        titulo="Como decidir entre toroidal e convencional"
        lead="Estas são as perguntas que realmente separam um núcleo toroidal de um convencional para o seu projeto. A resposta raramente é sobre qual tecnologia é “melhor” em abstrato."
        itens={CHECKLIST}
      />

      {/* <PillarObjections id="objecoes" /> */}

      <PillarClosing id="fecho" titulo="Núcleo toroidal, disponível nas três linhas Toroid">
        <p>
          O núcleo toroidal não é uma linha isolada: pode ser aplicado em{" "}
          <Link href="/transformador-de-corrente">Transformadores de Corrente</Link>,{" "}
          <Link href="/transformador-de-potencia">Transformadores de Potência</Link> e{" "}
          <Link href="/indutores-filtros-e-chokes">Indutores &amp; Reatores</Link>, dependendo da restrição do seu
          projeto. Se depois de ler isso você já sabe qual linha precisa, as especificações completas estão em cada
          uma dessas páginas.
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

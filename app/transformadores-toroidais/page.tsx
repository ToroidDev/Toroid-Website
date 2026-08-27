import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import { PillarBody, PillarClosing, PillarHero, PillarIndex, Prose, type SecaoPilar } from "@/components/produtos/Pillar";
import { CampoUniforme } from "@/components/produtos/CampoUniforme";
import { SinalAudio } from "@/components/produtos/SinalAudio";
import { HeroToroid } from "@/components/ui/HeroToroid";
import { ZigZagSecao } from "@/components/ui/ZigZagSecao";

// Esta página não é mais uma das 3 famílias de produto (essa família agora é
// Transformador de Potência, ver app/transformador-de-potencia/page.tsx). O
// núcleo toroidal é uma tecnologia que atravessa TC, TP e Indutores, não uma
// linha própria — por isso esta página explica a tecnologia em si (como
// funciona, como é fabricada, em que aplicações se destaca), sem tabela de
// especificações e sem schema Product isolado. Por decisão comercial, o
// conteúdo NÃO compara com o núcleo convencional E/I nem sugere que o
// toroidal seja superior — cada linha de produto trata dessa escolha, quando
// relevante, sem contrapor tecnologias.
// A URL/canonical NÃO muda: já é indexada e ranqueia, então fica exatamente
// aqui, só muda o papel do conteúdo.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (getProdutoPorSlug)
// quando WP_API_URL estiver validado, sem mudar URL nem estrutura desta página.

export const metadata: Metadata = {
  title: "Transformador Toroidal: Como Funciona e Onde Aplicar | Toroid do Brasil",
  description:
    "Entenda como funciona o núcleo toroidal, como a Toroid fabrica esse núcleo, e em quais aplicações essa tecnologia faz mais diferença.",
  alternates: {
    canonical: "/transformadores-toroidais",
    languages: {
      "pt-BR": absoluteUrl("/transformadores-toroidais"),
      es: absoluteUrl("/es/transformadores-toroidais"),
      "x-default": absoluteUrl("/transformadores-toroidais"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-muda", titulo: "O que muda com um núcleo toroidal" },
  { id: "como-fabricamos", titulo: "Como fabricamos o núcleo toroidal" },
  { id: "refrigeracao", titulo: "Refrigeração" },
  { id: "medicao-de-corrente", titulo: "Medição e proteção de corrente" },
  { id: "audio", titulo: "Áudio profissional" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Tipo seco conforme ABNT NBR5356-11" },
  { icon: Factory, texto: "Núcleo compacto e de baixo ruído audível" },
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
        name: "Como funciona um núcleo toroidal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O núcleo toroidal tem formato de anel, com primário e secundário enrolados sobre ele. Essa geometria distribui o campo magnético de forma mais uniforme, o que reduz a irradiação para fora do equipamento e diminui as perdas em vazio.",
        },
      },
      {
        "@type": "Question",
        name: "Em que aplicações o núcleo toroidal faz mais diferença?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Em aplicações sensíveis a ruído audível ou a interferência eletromagnética, como áudio profissional e painéis de equipamentos de refrigeração, e em projetos com restrição real de espaço ou peso. Nesses casos a redução de tamanho, peso e ruído da construção toroidal costuma justificar a troca.",
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
            Núcleo toroidal: como funciona, como fabricamos{" "}
            <span style={{ color: "var(--color-green-light)" }}>e onde essa tecnologia faz mais diferença</span>
          </>
        }
        lead="Espaço no gabinete, peso do equipamento final, ruído audível ou eficiência energética: entenda como a geometria do núcleo toroidal responde a cada uma dessas restrições, e em que aplicações ela costuma fazer mais diferença."
        fatos={FATOS}
        arte={<HeroToroid variant="dark" />}
      />

      {/* <PillarProof /> */}
      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo="O que muda na engenharia com um núcleo toroidal" arte={<CampoUniforme />}>
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
      </PillarBody>

      <ZigZagSecao
        id="como-fabricamos"
        eyebrow="Fabricação do núcleo"
        titulo="Como fabricamos o núcleo toroidal"
        imagens={[{ src: "/images/nucleo.webp", alt: "Núcleo em processo de fabricação na fábrica da Toroid" }]}
        lado="direita"
      >
        <p>
          O núcleo toroidal da Toroid é fabricado internamente, com diâmetro externo de 15 mm a 350 mm, o que
          permite cobrir desde componentes pequenos até núcleos de maior porte sem depender de fornecedor externo
          para essa etapa.
        </p>
      </ZigZagSecao>

      <ZigZagSecao
        id="tratamento-termico"
        eyebrow="Enrolamento e tratamento térmico"
        titulo="Da bobinagem ao tratamento térmico em atmosfera de nitrogênio"
        imagens={[{ src: "/images/bobinando.webp", alt: "Operador bobinando um núcleo toroidal na fábrica da Toroid" }]}
        lado="esquerda"
        tone="tint"
      >
        <p>
          Depois de enrolado, o núcleo passa por tratamento térmico em atmosfera de nitrogênio, com rampa de
          aquecimento de até 820 °C. O processo expulsa o oxigênio, fixa a geometria do núcleo e restabelece as
          propriedades elétricas e magnéticas do aço, alteradas pelo próprio processo de corte e enrolamento.
        </p>
      </ZigZagSecao>

      <ZigZagSecao
        id="refrigeracao"
        eyebrow="Refrigeração"
        titulo="Transformador de potência com núcleo toroidal em equipamentos de refrigeração"
        imagens={[
          {
            src: "/images/transformadorpotencia.jpg",
            alt: "Transformadores de potência com núcleo toroidal, do tipo usado em painéis de equipamentos de refrigeração",
          },
        ]}
        lado="direita"
      >
        <p>
          Equipamento de refrigeração comercial e industrial costuma concentrar o transformador de potência dentro de
          um painel fechado, junto do compressor e dos demais componentes elétricos. Volume físico menor e menos
          calor dissipado para o mesmo nível de potência facilitam esse encaixe, sem exigir ventilação extra só para
          o transformador.
        </p>
      </ZigZagSecao>

      <ZigZagSecao
        id="medicao-de-corrente"
        eyebrow="Medição e proteção de corrente"
        titulo="Núcleo toroidal em transformadores de corrente resinados e bipartidos"
        imagens={[
          {
            src: "/images/tc-resinado-bipartido.jpg",
            alt: "Transformadores de corrente com núcleo toroidal: um modelo resinado inteiriço e um modelo resinado bipartido, com terminais de conexão",
          },
        ]}
        lado="esquerda"
        tone="tint"
      >
        <p>
          O transformador de corrente parte do mesmo núcleo em anel: a diferença está em como ele se instala em volta
          do condutor. Na versão resinada, o núcleo vem encapsulado em resina antes da instalação; na versão
          resinada bipartida, o núcleo se abre em duas metades, o que permite instalar o TC em volta de um condutor
          já energizado, sem precisar desconectá-lo.
        </p>
        <p>
          Os dois modelos medem a corrente que passa pelo condutor ou protegem o circuito contra corrente elevada,
          sem um segmento único de aplicação — aparecem tanto em geração de energia elétrica e usinas termelétricas
          quanto em instalações elétricas diversas. O encapsulamento em resina eleva o nível de isolamento
          suportado, reduz vibração e ruído nas peças internas, e aumenta a resistência a impacto.
        </p>
      </ZigZagSecao>

      <PillarBody>
        <Prose id="audio" titulo="Transformador toroidal para áudio profissional" arte={<SinalAudio />}>
          <p>
            Em equipamento de áudio profissional o transformador de alimentação é uma fonte conhecida de ruído induzido
            quando mal isolado. A baixa irradiação de campo magnético do núcleo toroidal reduz o acoplamento indesejado
            com estágios de sinal sensíveis. É por comportamento eletromagnético mensurável, não por preferência de
            mercado, que boa parte dos fabricantes de amplificador de referência parte do toroidal como padrão de
            projeto.
          </p>
        </Prose>
      </PillarBody>

      {/* <PillarObjections id="objecoes" /> */}

      <PillarClosing id="fecho" titulo="Núcleo toroidal, disponível nas três linhas Toroid" tone="dark">
        <p>
          O núcleo toroidal pode ser aplicado em{" "}
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

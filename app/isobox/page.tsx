import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import {
  PillarBody,
  PillarChecklist,
  PillarClosing,
  PillarFoto,
  PillarHero,
  PillarIndex,
  PillarSpecTable,
  Prose,
  type SecaoPilar,
} from "@/components/produtos/Pillar";
import pillarStyles from "@/components/produtos/Pillar.module.css";

// Página nova (2026-09-04): o comercial pediu um card para o Isobox na home,
// antecipando a prioridade que o ROADMAP.md registrava como backlog sem data
// (ver nota lá). Conteúdo técnico levantado a partir da página equivalente no
// WordPress atual (toroid.com.br/isobox), a mesma fonte que ainda hospeda
// `Linha-padrao-TC.pdf`. Estático por decisão do projeto, mesmo motivo das
// outras páginas de produto: troca por lib/wordpress.ts quando WP_API_URL
// cobrir o CPT `produto`, sem mudar URL nem estrutura.

export const metadata: Metadata = {
  title: "Isobox: Transformador de Corrente de Linha Padrão | Toroid",
  description:
    "Isobox, a linha padrão de transformador de corrente toroidal da Toroid do Brasil: corrente secundária de 5 A, isolamento de 600 V e três tipos de montagem em painel. Peça seu orçamento técnico.",
  alternates: {
    canonical: "/isobox",
    languages: {
      "pt-BR": absoluteUrl("/isobox"),
      es: absoluteUrl("/es/isobox"),
      "x-default": absoluteUrl("/isobox"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-e", titulo: "O que é o Isobox" },
  { id: "linha-padrao-x-sob-medida", titulo: "Linha padrão ou projeto sob medida" },
  { id: "tipos-de-montagem", titulo: "Tipos de montagem disponíveis" },
  { id: "como-especificar", titulo: "Como especificar um Isobox" },
  { id: "especificacoes", titulo: "Tabela de especificações" },
  { id: "perguntas", titulo: "Perguntas frequentes" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Projetado conforme ABNT NBR6856" },
  { icon: Factory, texto: "Linha padrão, pronta para os 3 tipos de montagem" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Corrente secundária", "5 A"],
  ["Isolamento", "600 V (ensaiado a 4 kV)"],
  ["Classe de temperatura", "A (105 °C)"],
  ["Frequência nominal", "60 Hz"],
  ["Tipo construtivo", "Janela, núcleo toroidal"],
  ["Montagem disponível", "Trilho DIN, fundo de painel ou barramento"],
];

const CHECKLIST = [
  "Corrente primária nominal do circuito",
  "Tipo de montagem desejado: trilho DIN, fundo de painel ou barramento",
  "Diâmetro do condutor ou barramento que vai passar pelo orifício central",
  "Carga nominal do secundário em VA, o burden que o Isobox precisa alimentar",
  "Frequência nominal do sistema",
  "Condição ambiental de instalação: interna, externa ou industrial agressiva",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "O Isobox é o mesmo transformador de corrente da linha sob medida?",
    resposta:
      "É a mesma tecnologia de núcleo toroidal tipo janela e o mesmo teste elétrico aplicado a toda a linha Toroid. A diferença é que o Isobox já vem com corrente secundária, isolamento e montagem definidos na linha padrão, sem passar pela etapa de especificação sob medida.",
  },
  {
    pergunta: "Quais tipos de montagem o Isobox aceita?",
    resposta:
      "Trilho DIN, fundo de painel ou barramento. Os três tipos atendem os arranjos mais comuns de quadro elétrico, sem exigir adaptação de suporte no painel.",
  },
  {
    pergunta: "O condutor precisa ser interrompido para instalar o Isobox?",
    resposta:
      "Não. Como é um TC tipo janela, o condutor passa pelo orifício central do núcleo sem interrupção. A instalação exige apenas passar o condutor já existente pela janela do transformador.",
  },
  {
    pergunta: "Quando o Isobox não é a opção certa?",
    resposta:
      "Quando o projeto exige diâmetro interno fora da faixa padrão, classe de exatidão específica, isolamento acima de 600 V ou outro tipo construtivo. Nesses casos, o caminho é um projeto sob medida com a engenharia da Toroid, como nas famílias de Transformadores de Corrente, Transformadores de Potência e Indutores & Reatores.",
  },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Isobox",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Isobox, a linha padrão de transformador de corrente toroidal da Toroid do Brasil, com três tipos de montagem em painel já definidos.",
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
      { "@type": "ListItem", position: 2, name: "Isobox", item: absoluteUrl("/isobox") },
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

export default function IsoboxPage() {
  return (
    <>
      <PillarHero
        icone="isobox"
        nomeCategoria="Isobox"
        eyebrow="Linha padrão de transformador de corrente"
        titulo={
          <>
            O Isobox chega pronto para o painel, com a mesma{" "}
            <span style={{ color: "var(--color-green-light)" }}>engenharia testada</span> de toda a linha Toroid
          </>
        }
        lead="O Isobox é a linha padrão de transformador de corrente toroidal da Toroid do Brasil: corrente secundária de 5 A, isolamento de 600 V testado a 4 kV e três tipos de montagem já definidos, trilho DIN, fundo de painel ou barramento. Quando a aplicação pede parâmetros fora dessas faixas, o caminho passa a ser um projeto sob medida, não uma adaptação de catálogo."
        fatos={FATOS}
      />

      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose
          id="o-que-e"
          titulo="O que é o Isobox"
          arte={
            <PillarFoto
              src="/images/ISOBOXXX.png"
              alt="Transformador de corrente Isobox, linha padrão da Toroid do Brasil, com núcleo toroidal tipo janela"
              legenda="Isobox: transformador de corrente de linha padrão, pronto para montagem em painel."
              largura={1200}
              altura={800}
            />
          }
        >
          <p>
            O Isobox é um transformador de corrente toroidal, tipo janela: o condutor do circuito passa pelo orifício
            central do núcleo, sem interrupção e sem necessidade de abrir o circuito para instalar. Ele reduz uma
            corrente primária elevada, difícil de medir diretamente, para uma corrente secundária de 5 A, proporcional,
            que instrumentos de medição e proteção conseguem interpretar com segurança.
          </p>
          <p>
            A isolação de 600 V, testada a 4 kV, e a classe térmica A (105 °C) definem até onde o Isobox opera com
            segurança elétrica e térmica dentro do painel. A frequência nominal é 60 Hz, a mesma da rede brasileira.
          </p>
        </Prose>

        <Prose id="linha-padrao-x-sob-medida" titulo="Linha padrão ou projeto sob medida">
          <p>
            Nem toda aplicação exige uma especificação nova. Quando a corrente secundária, o isolamento e o tipo de
            montagem do Isobox já atendem o projeto, a linha padrão elimina a etapa de desenvolvimento e mantém a mesma
            engenharia e o mesmo teste elétrico de 100% das peças que saem da fábrica.
          </p>
          <p>
            Quando o painel exige diâmetro interno fora da faixa padrão, classe de exatidão específica ou construção
            diferente das disponíveis aqui, o caminho passa a ser um projeto sob medida, como nas famílias de
            Transformadores de Corrente, Transformadores de Potência e Indutores &amp; Reatores da Toroid.
          </p>
        </Prose>

        <Prose id="tipos-de-montagem" titulo="Tipos de montagem disponíveis">
          <p>
            O Isobox está disponível em três tipos de montagem, para atender os arranjos mais comuns de quadro
            elétrico sem exigir adaptação de suporte no painel:
          </p>
          <ul>
            <li>
              <strong>Trilho DIN.</strong> Instala direto no trilho padrão do quadro elétrico, sem furação adicional.
            </li>
            <li>
              <strong>Fundo de painel.</strong> Fixa direto na chapa de fundo do quadro, para projetos que não usam
              trilho.
            </li>
            <li>
              <strong>Barramento.</strong> Acompanha a geometria de um barramento de corrente elevada, sem adaptação de
              suporte.
            </li>
          </ul>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes da cotação"
        titulo="Como especificar um Isobox"
        lead="Estas são as informações que a nossa engenharia pede para confirmar se a linha padrão atende o seu painel, ou se o projeto precisa ser sob medida."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <PillarSpecTable
          id="especificacoes"
          titulo="Especificações da linha padrão Isobox"
          linhas={ESPECIFICACOES}
          nota="Parâmetros da linha padrão. Aplicação fora dessas faixas é avaliada como projeto sob medida pela engenharia."
        />
        <p className={pillarStyles.specNote}>
          <a
            href="https://toroid.com.br/wp-content/uploads/2023/07/Linha-padrao-TC.pdf"
            target="_blank"
            rel="noopener"
            style={{ color: "var(--color-blue)", fontWeight: 600, textDecoration: "underline" }}
          >
            Baixar especificação técnica (PDF)
          </a>
        </p>
      </PillarBody>

      <PillarBody>
        <Perguntas id="perguntas" titulo="Perguntas que aparecem antes da cotação" itens={PERGUNTAS} />
      </PillarBody>

      <PillarClosing id="fecho" titulo="Se a linha padrão não atende, o próximo passo é um projeto sob medida">
        <p>
          Diâmetro fora da faixa, classe de exatidão específica ou isolamento diferente do padrão? Descreva a
          aplicação para o nosso time avaliar um projeto sob medida, com a mesma engenharia que testa cada Isobox
          antes do embarque.
        </p>
      </PillarClosing>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

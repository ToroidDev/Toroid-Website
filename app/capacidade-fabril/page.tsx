import type { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { CapacidadeHero } from "@/components/capacidade-fabril/CapacidadeHero";
import { ZigZagSecao } from "@/components/ui/ZigZagSecao";
import { PillarChecklist } from "@/components/produtos/Pillar";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Capacidade Fabril | Toroid do Brasil",
  description:
    "Da matéria-prima ao teste elétrico: conheça o processo de fabricação de transformadores e indutores da Toroid do Brasil, engenharia aplicada e fabricação sob medida em São José dos Pinhais, PR.",
  alternates: { canonical: "/capacidade-fabril" },
};

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Capacidade fabril", item: absoluteUrl("/capacidade-fabril") },
    ],
  },
];

export default function CapacidadeFabrilPage() {
  return (
    <>
      <CapacidadeHero />

      <ZigZagSecao
        id="materias-primas"
        eyebrow="Matérias-primas"
        titulo="Aço silício de grão orientado e cobre esmaltado, na especificação certa"
        imagens={[
          { src: "/images/acosilicio.webp", alt: "Bobinas de aço silício de grão orientado estocadas na fábrica da Toroid" },
          { src: "/images/cobre.webp", alt: "Bobinas de cobre esmaltado estocadas na fábrica da Toroid" },
        ]}
        lado="direita"
      >
        <p>
          O núcleo parte de lâminas de aço silício de grão orientado, nas espessuras <strong>M3 (0,23 mm)</strong> e{" "}
          <strong>M4 (0,27 mm)</strong>, cortadas em larguras de 10 mm a 80 mm conforme a especificação de cada
          projeto. É essa lâmina de alta permeabilidade magnética que sustenta o desempenho elétrico declarado em
          cada linha.
        </p>
        <p>
          O enrolamento usa cobre esmaltado G2, de alta isolação e condutividade, com bitola de{" "}
          <strong>5 AWG a 36 AWG</strong>. A faixa completa cobre desde circuitos de instrumentação de baixa corrente
          até enrolamentos que precisam suportar carga mais pesada, sem trocar de fornecedor entre uma ponta e outra
          da linha.
        </p>
      </ZigZagSecao>

      <ZigZagSecao
        id="nucleos"
        eyebrow="Núcleos e tratamento térmico"
        titulo="Núcleo fabricado internamente, com tratamento térmico próprio"
        imagens={[{ src: "/images/nucleo.webp", alt: "Núcleo em processo de fabricação na fábrica da Toroid" }]}
        lado="esquerda"
        tone="tint"
      >
        <p>
          Núcleos toroidais, com diâmetro externo de <strong>15 mm a 350 mm</strong>, e núcleos retangulares sob
          medida são fabricados dentro da própria planta, sem depender de fornecedor externo nessa etapa.
        </p>
        <p>
          Depois de enrolado, cada núcleo passa por tratamento térmico em atmosfera de nitrogênio, com rampa de
          aquecimento de até <strong>820 °C</strong>. O processo expulsa o oxigênio, fixa a geometria do núcleo e
          restabelece as propriedades elétricas e magnéticas do aço, alteradas pelo próprio corte e enrolamento.
        </p>
      </ZigZagSecao>

      <ZigZagSecao
        id="isolamento-e-resinagem"
        eyebrow="Isolamento, enrolamento e resinagem"
        titulo="Do isolamento ao encapsulamento, célula por célula"
        imagens={[
          { src: "/images/enrolamento.webp", alt: "Máquina de enrolamento aplicando fio de cobre em um núcleo toroidal" },
          { src: "/images/imersao.webp", alt: "Peças em processo de imersão em verniz e resina na fábrica da Toroid" },
        ]}
        lado="direita"
      >
        <p>
          <strong>8 máquinas</strong> aplicam filme de poliéster (Mylar) nas larguras de 6, 10, 17 e 25 mm, e{" "}
          <strong>18 máquinas de enrolamento</strong>, organizadas por célula conforme bitola de fio e dimensão do
          núcleo, cobrem a produção do menor ao maior componente da linha.
        </p>
        <p>
          A imersão em verniz e resina reforça a isolação elétrica, elimina vibração e reduz ruído audível.
          Resinagem parcial ou total aumenta a resistência mecânica de transformadores de tensão, e o encapsulamento
          reforça a proteção dielétrica e ambiental dos transformadores de corrente.
        </p>
      </ZigZagSecao>

      <ZigZagSecao
        id="cnc-e-pcp"
        eyebrow="CNC, ferramentaria e controle de produção"
        titulo="Ferramentaria própria e rastreabilidade de lote"
        imagens={[{ src: "/images/cnc-ferramentaria.webp", alt: "Operador usinando componente em máquina CNC na fábrica da Toroid" }]}
        lado="esquerda"
        tone="tint"
      >
        <p>
          Máquinas CNC próprias usinam moldes para encapsulamento em resina, placas de identificação e componentes
          de fixação e montagem, com uma oficina interna dedicada à manutenção preventiva e ao ajuste contínuo dos
          equipamentos.
        </p>
        <p>
          O planejamento e controle da produção é automatizado, com leitura de código de barras em cada etapa, para
          rastreabilidade total do lote, do enrolamento ao teste elétrico final.
        </p>
      </ZigZagSecao>

      <ZigZagSecao
        id="laboratorio"
        eyebrow="Laboratório de testes e qualidade"
        titulo="Teste elétrico rigoroso, peça por peça"
        imagens={[{ src: "/images/laboratorio-testes.webp", alt: "Núcleos toroidais conectados a instrumentos de teste elétrico no laboratório da Toroid" }]}
        lado="direita"
      >
        <p>
          Cada transformador e indutor passa por teste elétrico completo antes de sair da fábrica, com
          instrumentação conectada a cada peça para garantir conformidade técnica com a especificação de origem.
        </p>
        <p>
          É a mesma disciplina que sustenta um sistema de gestão certificado, e que dá à engenharia do cliente um
          dado de campo em que ela pode confiar sem margem de dúvida. Conheça a engenharia aplicada a cada
          transformador Toroid do Brasil.
        </p>
      </ZigZagSecao>

      <PillarChecklist
        id="laboratorio-de-testes"
        eyebrow="Antes do embarque"
        titulo="100% das peças testadas eletricamente, sem amostragem"
        lead="Todo transformador e indutor produzido passa pelo laboratório antes de sair da fábrica. É o mesmo padrão que sustenta a certificação ISO 9001, pela RINA."
        itens={[
          "Tensão e corrente a vazio",
          "Erro e comportamento em saturação",
          "Ângulo de defasagem",
          "Indutância e isolação",
          "Polaridade",
        ]}
      />

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

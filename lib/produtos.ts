export type ProdutoIcone = "tc" | "toroidal" | "indutor" | "potencia" | "isobox";

export interface Produto {
  id: string;
  nome: string;
  descricaoCurta: string;
  /** Legenda curta usada no placeholder e na sobreposição do carrossel. */
  resumo: string;
  /**
   * Caminho da imagem do produto em /public (fotos reais do site antigo).
   * Quando `WP_API_URL` for confirmado (Fase 2 do ROADMAP), passa a receber
   * a URL do WordPress em vez do asset local, sem alteração de marcação.
   */
  imagem?: string;
  href: string;
  icone: ProdutoIcone;
}

export const produtos: Produto[] = [
  {
    id: "transformadores-de-corrente",
    nome: "Transformadores de Corrente",
    descricaoCurta:
      "Medição e proteção com classe de exatidão definida por aplicação, do painel de distribuição ao instrumento de bancada.",
    resumo: "Medição e proteção com classe de exatidão",
    imagem: "/images/TRANSFORMADORES-DE-CORRENTE.png",
    href: "/transformador-de-corrente",
    icone: "tc",
  },
  {
    id: "transformador-de-potencia",
    nome: "Transformadores de Potência",
    descricaoCurta:
      "Isolação, tensão e eficiência calculadas para o seu equipamento, com ensaio elétrico documentado antes do embarque.",
    resumo: "Isolação e eficiência sob especificação",
    imagem: "/images/TENSAO.png",
    href: "/transformador-de-potencia",
    icone: "potencia",
  },
  {
    id: "indutores-e-reatores",
    nome: "Indutores & Reatores",
    descricaoCurta:
      "Filtragem e limitação de corrente com indutância especificada em faixa de operação real, não em valor nominal isolado.",
    resumo: "Indutância definida por faixa de operação",
    imagem: "/images/INDUTORES.png",
    href: "/indutores-filtros-e-chokes",
    icone: "indutor",
  },
  {
    id: "isobox",
    nome: "Isobox",
    descricaoCurta:
      "Transformador de corrente de linha padrão, pronto para os três tipos de montagem mais comuns em painel: trilho DIN, fundo de painel ou barramento.",
    resumo: "Linha padrão pronta para montagem em painel",
    imagem: "/images/ISOBOXXX.png",
    href: "/isobox",
    icone: "isobox",
  },
];

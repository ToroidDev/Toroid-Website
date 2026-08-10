export type ProdutoIcone = "tc" | "toroidal" | "indutor";

export interface Produto {
  id: string;
  nome: string;
  descricaoCurta: string;
  /** Legenda curta usada no placeholder e na sobreposição do carrossel. */
  resumo: string;
  /**
   * URL da imagem do produto. Ausente nesta fase (placeholders institucionais);
   * na Fase 3 recebe a URL do WordPress e os componentes passam a usar next/image
   * com esse valor, sem alteração de marcação.
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
    href: "/produtos/transformadores-de-corrente",
    icone: "tc",
  },
  {
    id: "transformadores-toroidais",
    nome: "Transformadores Toroidais",
    descricaoCurta:
      "Isolação, tensão e volume calculados para o seu equipamento, com ensaio elétrico documentado antes do embarque.",
    resumo: "Isolação e blindagem sob especificação",
    href: "/produtos/transformadores-toroidais",
    icone: "toroidal",
  },
  {
    id: "indutores-e-reatores",
    nome: "Indutores & Reatores",
    descricaoCurta:
      "Filtragem e limitação de corrente com indutância especificada em faixa de operação real, não em valor nominal isolado.",
    resumo: "Indutância definida por faixa de operação",
    href: "/produtos/indutores-e-reatores",
    icone: "indutor",
  },
];

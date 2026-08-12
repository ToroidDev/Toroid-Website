import { z } from "zod";

// Formulário ativo: nome, e-mail e WhatsApp. O comercial ainda vai validar se o
// formulário deve virar mais descritivo (empresa, mensagem, tipo de produto e
// campos técnicos por categoria) ou continuar direto assim. Ver ROADMAP.md.
export const orcamentoSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  telefone: z.string().trim().min(8, "Informe um WhatsApp válido."),
  observacao: z.string().trim().max(2000).optional(),
});

export type OrcamentoPayload = z.infer<typeof orcamentoSchema>;

// ══════════════════════════════════════════════════════════════════════════
// Versão completa, esperando validação comercial. Mantida aqui comentada para
// reativar com os campos técnicos por categoria já prontos, em vez de
// reconstruir do zero quando a decisão sair.
//
// const camposComuns = {
//   nome: z.string().trim().min(2, "Informe seu nome."),
//   empresa: z.string().trim().min(2, "Informe a empresa."),
//   email: z.string().trim().email("Informe um e-mail válido."),
//   telefone: z.string().trim().min(8, "Informe um WhatsApp válido."),
//   observacao: z.string().trim().max(2000).optional(),
// };
//
// // Discriminador usa os mesmos códigos curtos já tipados em ProdutoIcone
// // (lib/produtos.ts), para não criar uma segunda taxonomia de categorias.
// export const orcamentoSchemaCompleto = z.discriminatedUnion("categoria", [
//   z.object({
//     categoria: z.literal("tc"),
//     ...camposComuns,
//     correntePrimaria: z.string().trim().min(1, "Informe a corrente primária."),
//     correnteSecundaria: z.string().trim().min(1, "Informe a corrente secundária."),
//     classeExatidao: z.string().trim().min(1, "Informe a classe de exatidão."),
//     aplicacao: z.enum(["medicao", "protecao"]),
//   }),
//   z.object({
//     categoria: z.literal("toroidal"),
//     ...camposComuns,
//     tensaoPrimaria: z.string().trim().min(1, "Informe a tensão primária."),
//     tensaoSecundaria: z.string().trim().min(1, "Informe a tensão secundária."),
//     potencia: z.string().trim().min(1, "Informe a potência."),
//     frequencia: z.string().trim().min(1, "Informe a frequência."),
//   }),
//   z.object({
//     categoria: z.literal("indutor"),
//     ...camposComuns,
//     indutanciaAlvo: z.string().trim().min(1, "Informe a indutância alvo."),
//     correnteOperacao: z.string().trim().min(1, "Informe a corrente de operação."),
//     frequencia: z.string().trim().min(1, "Informe a frequência."),
//     finalidade: z.enum(["filtragem", "limitacao"]),
//   }),
// ]);
//
// export type OrcamentoPayloadCompleto = z.infer<typeof orcamentoSchemaCompleto>;
// ══════════════════════════════════════════════════════════════════════════

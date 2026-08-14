import nodemailer from "nodemailer";
import type { OrcamentoPayload } from "./orcamento-schema";
import type { LeadDocument } from "./leads-schema";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("SMTP não configurado. Defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASSWORD.");
  }

  const port = Number(SMTP_PORT);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

export async function enviarOrcamentoPorEmail(payload: OrcamentoPayload) {
  const destinatarios = process.env.ORCAMENTO_DESTINATARIOS;
  if (!destinatarios) {
    throw new Error("ORCAMENTO_DESTINATARIOS não configurada.");
  }

  const transport = getTransport();

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: destinatarios.split(",").map((endereco) => endereco.trim()),
    replyTo: payload.email,
    subject: `Novo pedido de orçamento: ${payload.nome}`,
    text: [
      `Nome: ${payload.nome}`,
      `E-mail: ${payload.email}`,
      `WhatsApp: ${payload.telefone}`,
      payload.observacao ? `Observação: ${payload.observacao}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  // Quando a versão completa de orcamento-schema.ts (empresa, mensagem,
  // categoria e campos técnicos) for reativada, o assunto e o corpo passam a
  // usar `produtos.find(p => p.icone === payload.categoria)` para o nome do
  // produto e a listar os campos técnicos correspondentes.
}

// Disparado por app/api/orcamento/whatsapp/route.ts quando a mesma pessoa que
// já enviou o formulário clica na CTA de WhatsApp da tela de sucesso. Não é
// um lead novo — é só um aviso pro comercial não contar esse contato duas
// vezes (ver CLAUDE.md, duplicidade de lead).
export async function enviarAvisoWhatsappAposEnvio(lead: LeadDocument["lead"]) {
  const destinatarios = process.env.ORCAMENTO_DESTINATARIOS;
  if (!destinatarios) {
    throw new Error("ORCAMENTO_DESTINATARIOS não configurada.");
  }

  const transport = getTransport();

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: destinatarios.split(",").map((endereco) => endereco.trim()),
    replyTo: lead.email,
    subject: `Mesmo lead, não é novo: ${lead.nome} também chamou no WhatsApp`,
    text: [
      `${lead.nome} enviou o formulário de orçamento e, na sequência, também clicou`,
      `na opção de WhatsApp da tela de confirmação. É o mesmo contato — não conte`,
      `como um segundo lead.`,
      "",
      `Nome: ${lead.nome}`,
      `E-mail: ${lead.email}`,
      `WhatsApp: ${lead.telefone}`,
    ].join("\n"),
  });
}

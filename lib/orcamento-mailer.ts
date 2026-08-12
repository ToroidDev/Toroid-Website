import nodemailer from "nodemailer";
import type { OrcamentoPayload } from "./orcamento-schema";

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

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

// Nome de exibição do remetente — o e-mail em si continua sendo a caixa
// configurada em SMTP_USER/SMTP_FROM, só o "de" fica mais claro pra quem
// recebe do que um endereço cru.
function montarRemetente(): string {
  const endereco = process.env.SMTP_FROM || process.env.SMTP_USER || "";
  return `"Formulário Site" <${endereco}>`;
}

// Os campos abaixo vêm de texto digitado pelo visitante do site, não de
// conteúdo confiável — escapar antes de interpolar no HTML do e-mail evita
// que alguém injete markup/script no corpo da mensagem.
function escapeHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type LinhaEmail = { rotulo: string; valor: string };

// Layout único compartilhado pelos dois e-mails deste arquivo (notificação de
// lead e aviso de WhatsApp pós-envio) — mesma identidade visual do site
// (CLAUDE.md, "Identidade visual"): azul institucional no cabeçalho, verde só
// como detalhe (nunca atrás de texto), Karla/Arial como fallback de e-mail
// (fontes via next/font não chegam em cliente de e-mail).
function montarEmailHtml(params: { eyebrow: string; titulo: string; introducao?: string; linhas: LinhaEmail[] }): string {
  const { eyebrow, titulo, introducao, linhas } = params;

  const linhasHtml = linhas
    .map(
      (linha) => `
        <tr>
          <td style="padding:8px 0;font-size:13px;font-weight:700;color:#6B7280;width:110px;vertical-align:top;white-space:nowrap;">
            ${escapeHtml(linha.rotulo)}
          </td>
          <td style="padding:8px 0;font-size:14px;color:#393738;vertical-align:top;">
            ${escapeHtml(linha.valor)}
          </td>
        </tr>`,
    )
    .join("");

  return `
<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#F4F6FB;font-family:Arial,Helvetica,sans-serif;color:#393738;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E3E8F0;">
            <tr>
              <td style="background:#1A4B8C;padding:20px 28px;">
                <span style="font-size:17px;font-weight:700;color:#ffffff;">Toroid do Brasil</span><br />
                <span style="font-size:13px;color:#BBD5F2;">${escapeHtml(eyebrow)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 16px;font-size:18px;line-height:1.4;color:#1A4B8C;">${escapeHtml(titulo)}</h1>
                ${introducao ? `<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#393738;">${escapeHtml(introducao)}</p>` : ""}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${linhasHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="height:4px;background:#5EA75E;line-height:4px;font-size:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:14px 28px;background:#F4F6FB;">
                <span style="font-size:12px;color:#8A8F98;">E-mail automático do formulário de orçamento do site.</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function enviarOrcamentoPorEmail(payload: OrcamentoPayload) {
  const destinatarios = process.env.ORCAMENTO_DESTINATARIOS;
  if (!destinatarios) {
    throw new Error("ORCAMENTO_DESTINATARIOS não configurada.");
  }

  const transport = getTransport();

  const linhas: LinhaEmail[] = [
    { rotulo: "Nome", valor: payload.nome },
    { rotulo: "E-mail", valor: payload.email },
    { rotulo: "WhatsApp", valor: payload.telefone },
  ];
  if (payload.observacao) linhas.push({ rotulo: "Observação", valor: payload.observacao });

  await transport.sendMail({
    from: montarRemetente(),
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
    html: montarEmailHtml({
      eyebrow: "Novo pedido de orçamento",
      titulo: `Novo pedido de orçamento: ${payload.nome}`,
      linhas,
    }),
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

  const introducao = `${lead.nome} enviou o formulário de orçamento e, na sequência, também clicou na opção de WhatsApp da tela de confirmação. É o mesmo contato — não conte como um segundo lead.`;
  const linhas: LinhaEmail[] = [
    { rotulo: "Nome", valor: lead.nome },
    { rotulo: "E-mail", valor: lead.email },
    { rotulo: "WhatsApp", valor: lead.telefone },
  ];

  await transport.sendMail({
    from: montarRemetente(),
    to: destinatarios.split(",").map((endereco) => endereco.trim()),
    replyTo: lead.email,
    subject: `Mesmo lead, não é novo: ${lead.nome} também chamou no WhatsApp`,
    text: [introducao, "", `Nome: ${lead.nome}`, `E-mail: ${lead.email}`, `WhatsApp: ${lead.telefone}`].join("\n"),
    html: montarEmailHtml({
      eyebrow: "Aviso de acompanhamento",
      titulo: "Mesmo lead, não é um novo contato",
      introducao,
      linhas,
    }),
  });
}

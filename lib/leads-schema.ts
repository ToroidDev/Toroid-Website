import { z } from "zod";
import type { ObjectId } from "mongodb";
import type { OrcamentoPayload } from "./orcamento-schema";

export type AttributionSnapshot = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  timestamp: string;
};

export type AttributionBundle = {
  firstTouch: AttributionSnapshot | null;
  lastTouch: AttributionSnapshot | null;
};

export type LeadContext = {
  userAgent: string | null;
  ipHash: string | null;
  device: "mobile" | "tablet" | "desktop" | null;
};

export type LeadStatus = "novo" | "qualificado" | "proposta" | "ganho" | "perdido";

// Marca se a mesma pessoa também usou a CTA de WhatsApp da tela de sucesso do
// formulário (components/forms/OrcamentoForm.tsx) logo após o envio. Existe
// pra evitar que esse clique vire um segundo lead contado à parte — ver
// app/api/orcamento/whatsapp/route.ts, que atualiza este mesmo documento em
// vez de criar um novo.
export type WhatsappAposEnvio = {
  clicado: boolean;
  em: Date | null;
};

export type LeadDocument = {
  _id: ObjectId;
  lead: {
    nome: string;
    empresa: string | null;
    email: string;
    telefone: string;
    segmento: string | null;
    mensagem: string | null;
  };
  attribution: AttributionBundle;
  context: LeadContext;
  consent: { lgpd: boolean };
  status: LeadStatus;
  whatsappAposEnvio: WhatsappAposEnvio;
  criadoEm: Date;
};

// Validação defensiva do bloco de atribuição que chega do client
// (components/forms/OrcamentoForm.tsx via lib/attribution.ts). Não é dado
// digitado por humano como nome/email/telefone — esses continuam validados
// por orcamentoSchema com erro 400 de verdade. Isto é telemetria best-effort
// montada pelo próprio client a partir de localStorage/sessionStorage: se vier
// ausente, malformada ou adulterada, cai no fallback abaixo em vez de
// derrubar a solicitação de orçamento inteira por causa de um campo
// secundário. Ver política de falha parcial em app/api/orcamento/route.ts.
const instantaneoAtribuicaoSchema = z
  .object({
    utm_source: z.string().trim().max(300).nullable(),
    utm_medium: z.string().trim().max(300).nullable(),
    utm_campaign: z.string().trim().max(300).nullable(),
    utm_term: z.string().trim().max(300).nullable(),
    utm_content: z.string().trim().max(300).nullable(),
    gclid: z.string().trim().max(300).nullable(),
    fbclid: z.string().trim().max(300).nullable(),
    timestamp: z.string(),
  })
  .nullable();

export const attributionBundleSchema = z
  .object({
    firstTouch: instantaneoAtribuicaoSchema,
    lastTouch: instantaneoAtribuicaoSchema,
  })
  .catch({ firstTouch: null, lastTouch: null });

export function montarLeadDocument(params: {
  _id: ObjectId;
  payload: OrcamentoPayload;
  attribution: AttributionBundle;
  context: LeadContext;
}): LeadDocument {
  const { _id, payload, attribution, context } = params;
  return {
    _id,
    lead: {
      nome: payload.nome,
      // Sem campo de empresa no formulário ativo hoje (ver
      // components/forms/OrcamentoForm.tsx) — null em vez de inventar valor,
      // até a validação comercial reativar os campos completos.
      empresa: null,
      email: payload.email,
      telefone: payload.telefone,
      // Idem: sem select de categoria/segmento no formulário ativo hoje.
      segmento: null,
      mensagem: payload.observacao?.trim() ? payload.observacao : null,
    },
    attribution,
    context,
    // Sem checkbox de consentimento no formulário, por decisão (2026-08-25):
    // o site mantém só o consentimento básico de cookies, sem desenvolver
    // política de privacidade completa nem este checkbox. Sempre false, por
    // design permanente, não é bug. Ver CLAUDE.md.
    consent: { lgpd: false },
    status: "novo",
    // Preenchido depois, se o usuário clicar na CTA de WhatsApp da tela de
    // sucesso — ver app/api/orcamento/whatsapp/route.ts.
    whatsappAposEnvio: { clicado: false, em: null },
    criadoEm: new Date(),
  };
}

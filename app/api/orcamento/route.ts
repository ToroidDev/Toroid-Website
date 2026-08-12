import { NextResponse, after } from "next/server";
import { createHash, createHmac } from "node:crypto";
import { orcamentoSchema } from "@/lib/orcamento-schema";
import { enviarOrcamentoPorEmail } from "@/lib/orcamento-mailer";
import {
  attributionBundleSchema,
  montarLeadDocument,
  type LeadContext,
  type LeadDocument,
} from "@/lib/leads-schema";
import { getDb } from "@/lib/mongodb";

// nodemailer e o driver do mongodb dependem de módulos nativos do Node
// (net/tls/crypto), incompatíveis com o runtime Edge.
export const runtime = "nodejs";

function obterIp(request: Request): string | null {
  const encaminhado = request.headers.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip");
}

function hashearIp(ip: string | null): string | null {
  if (!ip) return null;
  const segredo = process.env.LEAD_IP_HASH_SECRET;
  // Sem LEAD_IP_HASH_SECRET, cai pra hash simples: funciona, mas é
  // reversível por força bruta (IPv4 tem só ~4,3 bilhões de valores; uma
  // rainbow table pré-computada quebra SHA-256 puro em segundos). Configurar
  // o segredo em produção fecha essa brecha.
  return segredo
    ? createHmac("sha256", segredo).update(ip).digest("hex")
    : createHash("sha256").update(ip).digest("hex");
}

function detectarDispositivo(userAgent: string | null): LeadContext["device"] {
  if (!userAgent) return null;
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

function montarContexto(request: Request): LeadContext {
  const userAgent = request.headers.get("user-agent");
  const ip = obterIp(request);
  return { userAgent, ipHash: hashearIp(ip), device: detectarDispositivo(userAgent) };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const parsed = orcamentoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  // MongoDB é o registro de sistema (CRM/atribuição): roda independente do
  // e-mail, nunca segura nem derruba a resposta ao visitante. after() agenda
  // a escrita pra depois da resposta já ter sido enviada.
  const attribution = attributionBundleSchema.parse(body.attribution);
  const leadDocument: LeadDocument = montarLeadDocument({
    payload: parsed.data,
    attribution,
    context: montarContexto(request),
  });

  after(async () => {
    try {
      const leads = (await getDb()).collection<LeadDocument>("leads");
      await leads.insertOne(leadDocument);
    } catch (err) {
      console.error("Falha ao salvar lead no MongoDB:", err, {
        nome: parsed.data.nome,
        email: parsed.data.email,
      });
    }
  });

  try {
    await enviarOrcamentoPorEmail(parsed.data);
  } catch (err) {
    console.error("Falha ao enviar e-mail de orçamento:", err);
    return NextResponse.json(
      { ok: false, error: "Não foi possível enviar sua solicitação agora. Tente pelo WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

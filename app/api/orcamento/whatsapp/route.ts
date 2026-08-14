import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "@/lib/mongodb";
import { enviarAvisoWhatsappAposEnvio } from "@/lib/orcamento-mailer";
import type { LeadDocument } from "@/lib/leads-schema";

// nodemailer e o driver do mongodb dependem de módulos nativos do Node
// (net/tls/crypto), incompatíveis com o runtime Edge.
export const runtime = "nodejs";

const corpoSchema = z.object({ leadId: z.string() });

// Chamado por OrcamentoForm.tsx quando a mesma pessoa que acabou de enviar o
// formulário clica na CTA de WhatsApp da tela de sucesso. Não cria um lead
// novo: marca ESTE MESMO documento (leadId veio da resposta de POST
// /api/orcamento) e avisa o comercial por e-mail que é o mesmo contato — ver
// CLAUDE.md, seção de duplicidade de lead. Best-effort de ponta a ponta: o
// link do WhatsApp já abriu em nova aba antes desta chamada terminar, então
// nenhuma falha aqui deve virar erro visível pro usuário.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = corpoSchema.safeParse(body);
  if (!parsed.success || !ObjectId.isValid(parsed.data.leadId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const leads = (await getDb()).collection<LeadDocument>("leads");
    // Filtro por clicado:false garante idempotência: cliques repetidos na
    // mesma sessão não reenviam o e-mail de acompanhamento nem sobrescrevem o
    // timestamp do primeiro clique.
    const resultado = await leads.findOneAndUpdate(
      { _id: new ObjectId(parsed.data.leadId), "whatsappAposEnvio.clicado": false },
      { $set: { whatsappAposEnvio: { clicado: true, em: new Date() } } },
      { returnDocument: "after" },
    );

    if (resultado) {
      await enviarAvisoWhatsappAposEnvio(resultado.lead);
    }
  } catch (err) {
    console.error("Falha ao marcar clique de WhatsApp pós-envio:", err, {
      leadId: parsed.data.leadId,
    });
  }

  return NextResponse.json({ ok: true });
}

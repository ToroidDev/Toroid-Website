import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CATEGORIAS_PRODUTO } from "@/lib/wordpress";

// Alvo do webhook do WordPress (CLAUDE.md → "Revalidação sob demanda").
// Espera POST com body { post_type: "produto" | "aplicacao" | "post", slug: string }
// e o segredo em X-Revalidate-Secret (ou ?secret= na query, pra plugin de
// webhook que só configura URL, sem headers customizados).

function tagsParaPostType(postType: string, slug: string): string[] {
  switch (postType) {
    case "produto":
      return ["produtos", `produto-${slug}`, ...CATEGORIAS_PRODUTO.map((c) => `produtos-${c}`)];
    case "aplicacao":
      return ["aplicacoes", `aplicacao-${slug}`];
    case "post":
      return ["posts", `post-${slug}`];
    default:
      return [];
  }
}

function autorizado(request: Request): boolean {
  const segredo = process.env.REVALIDATE_SECRET;
  if (!segredo) return false;
  const doHeader = request.headers.get("x-revalidate-secret");
  const daQuery = new URL(request.url).searchParams.get("secret");
  return doHeader === segredo || daQuery === segredo;
}

export async function POST(request: Request) {
  if (!autorizado(request)) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const postType = body?.post_type;
  const slug = body?.slug;
  if (typeof postType !== "string" || typeof slug !== "string" || !slug) {
    return NextResponse.json({ ok: false, error: "Body esperado: { post_type, slug }." }, { status: 400 });
  }

  const tags = tagsParaPostType(postType, slug);
  if (tags.length === 0) {
    return NextResponse.json({ ok: false, error: `post_type desconhecido: ${postType}` }, { status: 400 });
  }

  // { expire: 0 } expira o cache imediatamente. É o padrão recomendado pela
  // doc do Next.js especificamente para webhook/serviço externo — profile:"max"
  // (o padrão recomendado nos outros casos) só invalida no próximo acesso à
  // página, o que aqui deixaria o conteúdo desatualizado até alguém visitar.
  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
  return NextResponse.json({ ok: true, revalidated: tags });
}

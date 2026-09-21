import { NextResponse, type NextRequest } from "next/server";
import { GEO_LOCALE_COOKIE, localeFromCountry } from "@/lib/i18n";
import { prefersMarkdown, handleMarkdownRequest } from "@/lib/agent-content";

// Só existe pra resolver um caso: visitante com o navegador num idioma fora
// de pt/es/en (ex.: alemão, francês) cai direto no DEFAULT_LOCALE (pt) hoje,
// mesmo estando num país onde inglês ou espanhol seria mais compreensível.
// Este proxy não decide o idioma exibido — só grava, na borda, um cookie de
// SUGESTÃO geográfica (x-vercel-ip-country → locale) que o LocaleProvider usa
// como terceiro critério, depois da escolha explícita do visitante e do
// idioma do navegador (ver LocaleProvider.tsx). Nunca toca no cookie de
// escolha explícita (toroid_locale).
//
// Roda uma vez por visitante: se o cookie de geo já existe, sai sem fazer
// nada. Não lê cookies()/headers() dentro de um Server Component — a página
// continua estática/ISR, só a borda decide um Set-Cookie antes da requisição
// seguir (ver nota de performance em lib/i18n.ts e CLAUDE.md).
export function proxy(request: NextRequest) {
  // Negociação de conteúdo pra agente (Accept: text/markdown): só a home e um
  // 404 genérico respondem em Markdown hoje, ver lib/agent-content.ts. Fica
  // antes do cookie de geo porque não faz sentido gravar preferência de
  // idioma pra um consumidor que não é navegador.
  if (prefersMarkdown(request.headers.get("accept"))) {
    return handleMarkdownRequest(request);
  }

  if (request.cookies.has(GEO_LOCALE_COOKIE)) {
    return NextResponse.next();
  }

  const country = request.headers.get("x-vercel-ip-country");
  const response = NextResponse.next();
  response.cookies.set(GEO_LOCALE_COOKIE, localeFromCountry(country), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|.*\\.[\\w]+$).*)"],
};

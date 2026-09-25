export type RedeSocial = "linkedin" | "instagram" | "youtube";

const URL_REDE: Record<RedeSocial, string> = {
  linkedin: "https://www.linkedin.com/company/toroidbrasil/",
  instagram: "https://www.instagram.com/toroidbrasil/",
  youtube: "https://www.youtube.com/@toroiddobrasil3985",
};

// UTM fixo (não é o de último toque de lib/attribution.ts, que serve pra medir
// canal de origem do visitante) — aqui o objetivo é o oposto: marcar, do lado
// de fora, que quem chegou no LinkedIn/Instagram/YouTube veio do site, pra
// aparecer nos Insights de audiência de cada rede em vez de cair como
// "direto"/desconhecido. `contexto` diferencia qual seção do site gerou o
// clique (footer, blog, contato, carreiras).
export function linkSocial(rede: RedeSocial, contexto: string): string {
  const params = new URLSearchParams({
    utm_source: "toroid.com.br",
    utm_medium: "referral",
    utm_campaign: "social_follow",
    utm_content: contexto,
  });
  return `${URL_REDE[rede]}?${params.toString()}`;
}

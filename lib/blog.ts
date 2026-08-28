// Metadados de apresentação da listagem de /blog, derivados no servidor.
//
// Por que derivar o tema em vez de ler a taxonomia do WP: os 64 posts reais
// estão todos em "sem-categoria" (confirmado via curl em 2026-08-28, as 11
// categorias criadas no admin têm count 0). Enquanto o comercial não
// recategorizar o acervo no WordPress, um chip vindo da taxonomia diria
// "Sem categoria" em todo card. A heurística abaixo lê o título e devolve a
// família de produto de que o post fala, que é a informação que o visitante
// usa para escolher o que ler. Quando a taxonomia for arrumada no WP (ver
// ROADMAP.md, Trilha B), trocar `temaDoPost` por uma leitura de
// `post.categories` sem mexer em nenhum componente.

export type TemaId = "corrente" | "potencia" | "indutores" | "toroidal" | "engenharia";

export interface Tema {
  id: TemaId;
  rotulo: string;
}

// Sem `href` de propósito: o chip aparece dentro de um card que já é um <a>
// inteiro, e âncora dentro de âncora é HTML inválido. O cruzamento
// post → família de produto fica no corpo do post, não no chip.
const TEMAS: Record<TemaId, Tema> = {
  corrente: { id: "corrente", rotulo: "Transformador de Corrente" },
  potencia: { id: "potencia", rotulo: "Transformador de Potência" },
  indutores: { id: "indutores", rotulo: "Indutores & Reatores" },
  toroidal: { id: "toroidal", rotulo: "Núcleo Toroidal" },
  engenharia: { id: "engenharia", rotulo: "Engenharia Toroid" },
};

// A ordem é a regra: quase todo título cita "toroidal", então esse padrão vem
// por último entre os técnicos, senão engoliria os posts que falam de uma
// família específica ("Transformadores de Corrente Toroidais" é corrente,
// não toroidal). "engenharia" é o fallback, nunca um padrão.
const REGRAS: Array<{ id: TemaId; padrao: RegExp }> = [
  { id: "corrente", padrao: /transformador(es)?\s+de\s+corrente|\btc\b|medi[cç][aã]o\s+de\s+corrente/i },
  { id: "indutores", padrao: /indutor|reator|choke/i },
  { id: "potencia", padrao: /transformador(es)?\s+de\s+pot[eê]ncia|regulador\s+de\s+tens[aã]o/i },
  { id: "toroidal", padrao: /toroidal|toroidais/i },
];

export function temaDoPost(titulo: string): Tema {
  const texto = decodificarEntidades(titulo);
  const regra = REGRAS.find((r) => r.padrao.test(texto));
  return TEMAS[regra ? regra.id : "engenharia"];
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/**
 * O WP devolve a data no fuso do site, sem offset ("2025-09-23T15:35:30").
 * Passar isso por `new Date()` faria o resultado depender do fuso de quem
 * renderiza (UTC na Vercel, outro no dev), então a formatação é feita direto
 * sobre a string: mesma saída em qualquer máquina.
 */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia} ${MESES[Number(mes) - 1]} ${ano}`;
}

/** Valor do atributo `dateTime` de <time>, no formato que o HTML espera. */
export function dataISO(iso: string): string {
  return iso.slice(0, 10);
}

// Título e resumo vêm renderizados pelo WP, com entidade HTML no meio
// ("&#8211;", "&hellip;"). Onde o texto entra como string (alt de imagem,
// metadata, heurística de tema) a entidade apareceria crua.
export function decodificarEntidades(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

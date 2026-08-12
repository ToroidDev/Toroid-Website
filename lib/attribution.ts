import type { AttributionBundle, AttributionSnapshot } from "./leads-schema";

const CHAVE_PRIMEIRO_TOQUE = "toroid:atribuicao:primeiro-toque";
const CHAVE_ULTIMO_TOQUE = "toroid:atribuicao:ultimo-toque";

const CAMPOS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

function lerParametrosDaURL(): AttributionSnapshot | null {
  const params = new URLSearchParams(window.location.search);
  const valores = {} as Record<(typeof CAMPOS)[number], string | null>;
  let encontrouAlgum = false;
  for (const campo of CAMPOS) {
    const valor = params.get(campo);
    valores[campo] = valor;
    if (valor !== null) encontrouAlgum = true;
  }
  if (!encontrouAlgum) return null;
  return { ...valores, timestamp: new Date().toISOString() };
}

function lerDoStorage(storage: Storage, chave: string): AttributionSnapshot | null {
  try {
    const bruto = storage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as AttributionSnapshot) : null;
  } catch {
    return null;
  }
}

// Chamado uma vez por carregamento de página inteira (ver
// components/layout/AttributionCapture.tsx, montado no RootLayout). Só grava
// alguma coisa quando a URL atual carrega pelo menos um parâmetro de
// campanha; navegação interna sem esses parâmetros não sobrescreve nada — é
// assim que o último toque "sobrevive à navegação interna" sem lógica extra.
export function capturarAtribuicao(): void {
  if (typeof window === "undefined") return;
  const atual = lerParametrosDaURL();
  if (!atual) return;

  try {
    if (!window.localStorage.getItem(CHAVE_PRIMEIRO_TOQUE)) {
      window.localStorage.setItem(CHAVE_PRIMEIRO_TOQUE, JSON.stringify(atual));
    }
  } catch {
    // localStorage indisponível (modo privado, quota) — não é fatal, só
    // perde o primeiro toque desta visita.
  }

  try {
    window.sessionStorage.setItem(CHAVE_ULTIMO_TOQUE, JSON.stringify(atual));
  } catch {
    // idem, para o último toque.
  }
}

// Lido no submit de OrcamentoForm.tsx pra anexar ao payload do POST.
export function obterAtribuicaoAtual(): AttributionBundle {
  if (typeof window === "undefined") {
    return { firstTouch: null, lastTouch: null };
  }
  return {
    firstTouch: lerDoStorage(window.localStorage, CHAVE_PRIMEIRO_TOQUE),
    lastTouch: lerDoStorage(window.sessionStorage, CHAVE_ULTIMO_TOQUE),
  };
}

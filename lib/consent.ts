export type ConsentChoice = {
  analytics: boolean;
  date: number;
};

export const CONSENT_KEY = "toroid-consent";
export const CONSENT_MAX_AGE_DAYS = 365;

// Evento global pra reabrir o banner de cookies em modo de edição (link
// "Preferências de cookies" no rodapé) — nome compartilhado entre
// CookieConsentBanner.tsx (quem escuta e reabre) e WhatsAppButton.tsx (quem
// escuta pra se esconder enquanto o banner cobre o canto inferior direito).
export const EVENTO_ABRIR_CONSENTIMENTO = "toroid:open-consent-settings";

// Disparado por saveConsent() sempre que o visitante decide (aceitar, recusar
// ou salvar preferências) — WhatsAppButton.tsx escuta pra voltar a aparecer
// assim que o banner some.
export const EVENTO_CONSENTIMENTO_SALVO = "toroid:consent-saved";

export function getSavedConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed: ConsentChoice = JSON.parse(raw);

    const ageDays = (Date.now() - parsed.date) / (1000 * 60 * 60 * 24);
    if (ageDays > CONSENT_MAX_AGE_DAYS) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean) {
  const choice: ConsentChoice = { analytics, date: Date.now() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));

  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
  });

  window.dispatchEvent(new Event(EVENTO_CONSENTIMENTO_SALVO));

  return choice;
}

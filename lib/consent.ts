export type ConsentChoice = {
  analytics: boolean;
  date: number;
};

export const CONSENT_KEY = "toroid-consent";
export const CONSENT_MAX_AGE_DAYS = 365;

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

  return choice;
}

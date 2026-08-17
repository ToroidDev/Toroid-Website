"use client";

import { EVENTO_ABRIR_CONSENTIMENTO } from "@/lib/consent";

// Único motivo de "use client" aqui: reabrir o banner de cookies dispara um
// evento no window. O resto do Footer continua Server Component.
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR_CONSENTIMENTO))}
    >
      Preferências de cookies
    </button>
  );
}

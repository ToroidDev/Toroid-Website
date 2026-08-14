"use client";

// Único motivo de "use client" aqui: reabrir o banner de cookies dispara um
// evento no window. O resto do Footer continua Server Component.
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("toroid:open-consent-settings"))}
    >
      Preferências de cookies
    </button>
  );
}

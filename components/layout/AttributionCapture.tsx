"use client";

import { useEffect } from "react";
import { capturarAtribuicao } from "@/lib/attribution";

// Monta uma vez no RootLayout (app/layout.tsx) porque UTM/gclid/fbclid podem
// chegar em qualquer URL de entrada do site, não só na home. Não renderiza
// nada — só grava em localStorage/sessionStorage pro OrcamentoForm ler no
// submit (lib/attribution.ts).
export function AttributionCapture() {
  useEffect(() => {
    capturarAtribuicao();
  }, []);
  return null;
}

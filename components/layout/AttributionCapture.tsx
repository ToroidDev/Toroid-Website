"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { capturarAtribuicao } from "@/lib/attribution";

// usePathname/useSearchParams no dependency array: reexecuta a captura em
// toda navegação (não só na carga de página inteira), porque o RootLayout não
// remonta em transição client-side do App Router — sem isso, um UTM que
// chegasse numa navegação client-side (ex.: link interno com parâmetro de
// campanha) nunca seria lido depois da primeira carga da sessão.
function CapturaComRota() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    capturarAtribuicao();
  }, [pathname, searchParams]);

  return null;
}

// Suspense é obrigatório em volta de useSearchParams (regra do Next.js) e,
// aqui, isola esse componente do resto da página: o restante do RootLayout
// continua estático, só esta folha faz bailout pra client-side rendering —
// sem isso, o site inteiro perderia o pré-render estático (CLAUDE.md exige
// performance como prioridade número um).
export function AttributionCapture() {
  return (
    <Suspense fallback={null}>
      <CapturaComRota />
    </Suspense>
  );
}

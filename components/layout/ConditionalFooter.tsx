"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Só decide se renderiza; o Footer em si continua Server Component, sem JS
// extra nele. /contato pede a página inteira em um azul contínuo, sem a
// costura clara do rodapé.
export function ConditionalFooter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/contato") return null;
  return <>{children}</>;
}

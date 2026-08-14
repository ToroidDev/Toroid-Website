import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Página não encontrada | Toroid do Brasil",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className={styles.section}>
      <InstitutionalPattern spiral opacity={0.05} stroke="#BBD5F2" className={styles.pattern} />
      <div className={styles.inner}>
        <Link href="/" className={styles.voltar}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Voltar para a home
        </Link>
        <h1 className={styles.headline}>Não encontramos a página que você procura.</h1>
      </div>
    </section>
  );
}

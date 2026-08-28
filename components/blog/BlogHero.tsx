import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import styles from "./BlogHero.module.css";

/**
 * Faixa azul de abertura de /blog. Mesma matéria dos heros de aplicação e das
 * páginas-pilar (gradiente azul profundo, grão de 160px, pattern institucional,
 * curva de fechamento), para a listagem deixar de ser a única página do site
 * que começa em branco puro. É também o que faz o header nascer no modo escuro
 * nessa rota, sem entrar em heroClaroPath (ver components/layout/Nav.tsx).
 */
export function BlogHero({ totalPosts }: { totalPosts: number }) {
  return (
    <section className={styles.hero}>
      <InstitutionalPattern spiral opacity={0.05} stroke="#9FC2EA" className={styles.pattern} />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        <ol className={styles.breadcrumb}>
          <li>
            <Link href="/">Início</Link>
            <span className={styles.sep} aria-hidden="true">
              /
            </span>
          </li>
          <li>
            <span aria-current="page">Blog</span>
          </li>
        </ol>

        <p className={styles.eyebrow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          Blog técnico
        </p>

        <h1 className={styles.titulo}>Especificação explicada por quem fabrica.</h1>
        <p className={styles.lead}>
          Classe térmica, saturação, isolação, redução de EMI. O que a engenharia da Toroid confere antes de
          produzir, escrito para quem precisa decidir uma especificação e não quer retrabalho depois.
        </p>

        <div className={styles.rodape}>
          {totalPosts > 0 ? (
            <p className={styles.contagem}>
              <strong>{totalPosts}</strong> artigos publicados
            </p>
          ) : null}
          <Link href="/produtos" className={styles.atalho}>
            Ver as três famílias de produto
            <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Curva preenchida na cor da seção seguinte (o azul rebaixado do bloco
          de destaque), então não há emenda de cor contra o gradiente. */}
      <div className={styles.onda} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" width="100%" height="100%">
          <path
            d="M0 80 L0 46 C 180 22 340 64 520 50 C 700 36 860 10 1050 28 C 1222 45 1332 68 1440 54 L1440 80 Z"
            fill="var(--color-bg-tint)"
          />
        </svg>
      </div>
    </section>
  );
}

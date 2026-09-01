import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./AplicacaoHero.module.css";

/**
 * Hero das páginas de aplicação/segmento. Herda o mundo das páginas-pilar de
 * produto (faixa azul invertida, grão, pattern institucional, mesmo par de CTAs)
 * e muda três coisas que são próprias do template de segmento:
 *
 *  - prova institucional em UMA linha, não o bloco completo. Decisão de conteúdo:
 *    repetir a lista inteira de selo em cada segmento desgasta a prova e rouba
 *    espaço do argumento técnico.
 *  - a arte do hero vem por prop, porque cada segmento tem um desenho próprio.
 *    Opcional: o padrão dinâmico /aplicacoes/[slug] não tem campo de arte no
 *    CPT `aplicacao`, então renderiza sem ela (`.inner` vira coluna única).
 *  - a borda inferior é uma curva, não um corte reto: é a assinatura orgânica que
 *    liga o azul ao corpo branco da página.
 */

export function AplicacaoHero({
  trilha,
  eyebrow,
  titulo,
  lead,
  prova,
  ctaPrimario,
  ctaWhatsapp,
  arte,
}: {
  trilha: string;
  eyebrow: string;
  titulo: ReactNode;
  lead: ReactNode;
  prova: string[];
  ctaPrimario: string;
  ctaWhatsapp: string;
  arte?: ReactNode;
}) {
  return (
    <section className={styles.hero}>
      <InstitutionalPattern spiral opacity={0.05} stroke="#9FC2EA" className={styles.pattern} />
      <div className={styles.grain} aria-hidden="true" />

      <div className={arte ? styles.inner : `${styles.inner} ${styles.innerSemArte}`}>
        <div>
          <ol className={styles.breadcrumb}>
            <li>
              <Link href="/">Início</Link>
              <span className={styles.breadcrumbSep} aria-hidden="true">
                /
              </span>
            </li>
            <li>
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {trilha}
              </span>
            </li>
          </ol>

          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 className={styles.titulo}>{titulo}</h1>
          <p className={styles.lead}>{lead}</p>

          <p className={styles.prova}>
            <BadgeCheck size={16} strokeWidth={1.9} className={styles.provaIcon} aria-hidden="true" />
            {prova.map((item, i) => (
              <span key={item}>
                {item}
                {i < prova.length - 1 ? (
                  <span className={styles.provaSep} aria-hidden="true">
                    ·
                  </span>
                ) : null}
              </span>
            ))}
          </p>

          <div className={styles.acoes}>
            <a href="#orcamento" className={styles.primario}>
              {ctaPrimario}
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            {/* `trilha` é o nome do segmento no breadcrumb ("Transformadores
                para nobreaks", ou o título vindo do CPT `aplicacao` na rota
                dinâmica): serve como contexto da mensagem sem exigir mais uma
                prop por página. */}
            <WhatsAppLink
              className={styles.secundario}
              mensagem={`Olá! Vim pela página ${trilha} e gostaria de falar com a engenharia.`}
            >
              {ctaWhatsapp}
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            </WhatsAppLink>
          </div>
        </div>

        {arte ? <div className={styles.arte}>{arte}</div> : null}
      </div>

      {/* Curva de fechamento: preenchida em #fff, a mesma cor da seção seguinte,
          para não haver emenda de cor contra o gradiente do hero. */}
      <div className={styles.onda} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" width="100%" height="100%">
          <path
            d="M0 80 L0 46 C 180 22 340 64 520 50 C 700 36 860 10 1050 28 C 1222 45 1332 68 1440 54 L1440 80 Z"
            fill="#fff"
          />
        </svg>
      </div>
    </section>
  );
}

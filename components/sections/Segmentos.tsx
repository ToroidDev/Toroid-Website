import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import { T } from "@/components/i18n/T";
import { SEGMENTOS } from "@/lib/segmentos";
import styles from "./Segmentos.module.css";

export function Segmentos() {
  return (
    <section id="segmentos" className={styles.section}>
      <InstitutionalPattern opacity={0.06} className={styles.pattern} />
      <div className={styles.inner}>
        <SectionHeading eyebrow={<T pt="Segmentos atendidos" es="Segmentos atendidos" en="Segments served" />}>
          <T
            pt="Cada aplicação impõe uma restrição diferente. O projeto começa por ela."
            es="Cada aplicación impone una restricción diferente. El proyecto empieza por ella."
            en="Each application imposes a different constraint. The design starts there."
          />
        </SectionHeading>

        <div className={styles.grid}>
          {SEGMENTOS.map(({ id, titulo, texto, icon: Icon, href }) => {
            const conteudo = (
              <>
                <span className={styles.iconWrap} aria-hidden="true">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <h3 className={styles.cardTitle}>
                  <T pt={titulo.pt} es={titulo.es} en={titulo.en} />
                </h3>
                <p className={styles.cardText}>
                  <T pt={texto.pt} es={texto.es} en={texto.en} />
                </p>
                {href && (
                  <span className={styles.cardLink}>
                    <T pt="Ver aplicação" es="Ver aplicación" en="View application" />
                    <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                )}
              </>
            );

            return href ? (
              <Link key={id} href={href} className={styles.card}>
                {conteudo}
              </Link>
            ) : (
              <article key={id} className={styles.card}>
                {conteudo}
              </article>
            );
          })}
        </div>

        {/* CTA discreto, não um botão: o pedido do comercial foi "de maneira
            discreta", então segue o mesmo espírito do link de WhatsApp do
            Footer (ícone + texto, cor secundária) em vez do padrão de botão
            usado no Hero/CTA. */}
        <div className={styles.shareCtaWrap}>
          <WhatsAppLink
            className={styles.shareCta}
            mensagem={{
              pt: "Olá! Gostaria de compartilhar um projeto com a Toroid do Brasil e avaliar a engenharia de aplicação.",
              es: "¡Hola! Me gustaría compartir un proyecto con Toroid do Brasil y evaluar la ingeniería de aplicación.",
              en: "Hi! I'd like to share a project with Toroid do Brasil and have your application engineering take a look.",
            }}
          >
            <MessageCircle size={16} strokeWidth={1.9} aria-hidden="true" />
            <T
              pt="Compartilhe seu projeto com a Toroid do Brasil e avalie nossa engenharia de aplicação."
              es="Comparta su proyecto con Toroid do Brasil y evalúe nuestra ingeniería de aplicación."
              en="Share your project with Toroid do Brasil and put our application engineering to the test."
            />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}

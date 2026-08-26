import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { LinkedinIcon } from "@/components/ui/SocialIcons";
import { Valores } from "@/components/quem-somos/Valores";
import { getAnosDeMercado } from "@/lib/institucional";
import styles from "./page.module.css";

// Conteúdo institucional mínimo, de propósito: a página equivalente no
// WordPress antigo (wp-json/wp/v2/pages?slug=trabalhe-conosco) só tinha um
// título e uma linha, com vaga divulgada no Instagram. Canal corrigido em
// 2026-08-25: vagas são divulgadas no LinkedIn da Toroid do Brasil, não mais
// no Instagram. Não há vaga aberta publicada nem processo seletivo
// formalizado no site. Em vez de inventar cargo/processo, a página
// reaproveita dado real já confirmado em produção: e-mail de RH
// (components/contato/ContatoInfo.tsx) e o LinkedIn oficial (Footer.tsx),
// mais a seção de valores de /quem-somos (mesma fonte, sem duplicar texto).
// Sem i18n aqui, mesmo padrão de /quem-somos, /contato e /blog: só home e as
// 4 páginas de produto têm mirror em espanhol hoje.

export const metadata: Metadata = {
  title: "Trabalhe Conosco | Toroid do Brasil",
  description:
    "Oportunidades na Toroid do Brasil: fabricante de transformadores e indutores em São José dos Pinhais, PR. Vagas no LinkedIn, currículo por e-mail.",
  alternates: { canonical: "/trabalhe-conosco" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
    { "@type": "ListItem", position: 2, name: "Trabalhe Conosco", item: "https://toroid.com.br/trabalhe-conosco" },
  ],
};

export default function TrabalheConoscoPage() {
  return (
    <>
      <section className={styles.hero}>
        <InstitutionalPattern spiral opacity={0.05} stroke="#9FC2EA" className={styles.heroPattern} />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            Carreiras
          </p>
          <h1 className={styles.heroTitle}>Trabalhe Conosco</h1>
          <p className={styles.heroLead}>
            Há {getAnosDeMercado()} anos fabricando transformadores de corrente, de potência e indutores em São José
            dos Pinhais, PR, numa lógica de crescimento contínuo que vem desde a fundação. Crescemos com gente que
            valoriza especificação bem-feita e trabalho de precisão, dentro e fora da linha de produção.
          </p>

          <div className={styles.heroActions}>
            <a href="mailto:rh@toroid.com.br" className={styles.primary}>
              Enviar currículo
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/company/toroidbrasil/"
              target="_blank"
              rel="noopener"
              className={styles.secondary}
            >
              <LinkedinIcon size={17} />
              Ver vagas no LinkedIn
            </a>
          </div>
        </div>
      </section>

      <Valores />

      <section className={styles.nota}>
        <div className={styles.notaInner}>
          <p>
            Novas vagas são divulgadas primeiro no <strong>LinkedIn da Toroid do Brasil</strong>. Sem processo aberto
            no momento? Envie seu currículo para <a href="mailto:rh@toroid.com.br">rh@toroid.com.br</a> e ele fica no
            nosso banco de talentos para a próxima oportunidade que combinar com o seu perfil.
          </p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}

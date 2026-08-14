import Image from "next/image";
import { ArrowRight, ClipboardCheck, Factory, MapPin, MessageCircle } from "lucide-react";
import { HeroToroid } from "@/components/ui/HeroToroid";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./Hero.module.css";

// Barra do pé do hero. Ocupa o lugar do `contactInfo` do componente de referência,
// mas com fatos verificáveis em vez de telefone/endereço: PRODUCT.md marca telefone,
// e-mail e WhatsApp como placeholders não confirmados. Também não repete o que a
// seção de prova logo abaixo já carrega (anos, projetos, certificações).
const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: Factory, texto: "Produtos 100% personalizados" },
  { icon: ClipboardCheck, texto: "Garantia de 3 anos" },
];

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <Image
        src="/images/sede-toroid.webp"
        alt="Sede e fábrica da Toroid do Brasil em São José dos Pinhais"
        fill
        priority
        sizes="100vw"
        className={styles.bgImage}
      />
      <div className={styles.scrim} aria-hidden="true" />
      {/* Pattern institucional espiral, em traço claro por estar sobre azul profundo:
          dá textura ao chapado sem competir com a foto nem com o texto. */}
      {/* <InstitutionalPattern spiral opacity={0.055} stroke="#9FC2EA" className={styles.pattern} /> */}
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.slogan}>
            <span className={styles.sloganRule} aria-hidden="true" />
            Engenharia nacional · ISO 9001
          </p>

          {/* O verde entra só em "o desempenho", duas palavras. Espalhado pela
              frase inteira ele empatava em peso visual com o azul, o que a
              identidade proíbe: azul é base, verde é detalhe. */}
          <h1 className={styles.headline}>
            Pouco espaço no painel não deveria comprometer{" "}
            <span className={styles.headlineAccent}>o desempenho</span> do sistema.
          </h1>

          <p className={styles.subtitle}>
            Transformadores de corrente, transformadores de potência e indutores projetados a partir da sua aplicação,
            não de um catálogo. Especificação conferida antes de produzir, mais de 30 anos fabricando no Brasil.
          </p>

          <div className={styles.actions}>
            <a href="#orcamento" className={styles.primary}>
              Solicitar Orçamento Técnico
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            <WhatsAppLink className={styles.secondary}>
              Falar com nosso time
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            </WhatsAppLink>
          </div>
        </div>

        <div className={styles.art}>
          <HeroToroid variant="dark" />
        </div>
      </div>

      <ul className={styles.fatos}>
        {FATOS.map(({ icon: Icon, texto }) => (
          <li key={texto} className={styles.fato}>
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" className={styles.fatoIcon} />
            {texto}
          </li>
        ))}
      </ul>
    </section>
  );
}

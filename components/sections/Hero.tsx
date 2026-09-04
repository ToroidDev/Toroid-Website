import { ArrowRight, ClipboardCheck, Factory, MapPin, MessageCircle } from "lucide-react";
// import { HeroToroid } from "@/components/ui/HeroToroid"; // animação anterior (render isométrico do núcleo), mantida no repo, ver HeroToroidLogo abaixo
import { HeroToroidLogo } from "@/components/ui/HeroToroidLogo";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import { T } from "@/components/i18n/T";
import { HeroHeadline } from "./HeroHeadline";
import styles from "./Hero.module.css";

// Barra do pé do hero. Ocupa o lugar do `contactInfo` do componente de referência,
// mas com fatos verificáveis em vez de telefone/endereço: PRODUCT.md marca telefone,
// e-mail e WhatsApp como placeholders não confirmados. Também não repete o que a
// seção de prova logo abaixo já carrega (anos, projetos, certificações).
const FATOS = [
  { id: "local", icon: MapPin, pt: "São José dos Pinhais · PR", es: "São José dos Pinhais · PR", en: "São José dos Pinhais · PR" },
  { id: "custom", icon: Factory, pt: "Produtos 100% personalizados", es: "Productos 100% personalizados", en: "100% customized products" },
  { id: "garantia", icon: ClipboardCheck, pt: "Garantia de 3 anos", es: "Garantía de 3 años", en: "3-year warranty" },
];

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      {/* Gradiente azul institucional. Era o scrim que velava a foto da sede;
          sem a foto, é o próprio fundo do hero. */}
      <div className={styles.scrim} aria-hidden="true" />
      {/* Pattern institucional espiral, em traço claro por estar sobre azul profundo:
          dá textura ao chapado sem competir com o texto. */}
      {/* <InstitutionalPattern spiral opacity={0.055} stroke="#9FC2EA" className={styles.pattern} /> */}
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          {/* O selo, o H1 (dores) e o parágrafo de valor + CTA moram juntos em
              HeroHeadline.tsx: os três giram no mesmo relógio (ver o arquivo),
              incluindo o selo, que troca a cada duas mudanças de dor. O verde
              entra só no trecho de destaque de cada frase (ex.: "o
              desempenho"), nunca na frase inteira — espalhado ele empatava em
              peso visual com o azul, o que a identidade proíbe. */}
          <HeroHeadline />

          <div className={styles.actions}>
            <a href="#orcamento" className={styles.primary}>
              <T pt="Solicitar Orçamento Técnico" es="Solicitar Presupuesto Técnico" en="Request a Technical Quote" />
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            <WhatsAppLink
              className={styles.secondary}
              mensagem={{
                pt: "Olá! Vim pelo site da Toroid e gostaria de falar com o time sobre um transformador sob medida.",
                es: "¡Hola! Vine por el sitio de Toroid y me gustaría hablar con el equipo sobre un transformador a medida.",
                en: "Hi! I came from the Toroid website and I would like to talk to your team about a custom transformer.",
              }}
            >
              <T pt="Falar com nosso time" es="Hablar con nuestro equipo" en="Talk to our team" />
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            </WhatsAppLink>
          </div>
        </div>

        <div className={styles.art}>
          {/* <HeroToroid variant="dark" /> */}
          <HeroToroidLogo />
        </div>
      </div>

      <ul className={styles.fatos}>
        {FATOS.map(({ id, icon: Icon, pt, es, en }) => (
          <li key={id} className={styles.fato}>
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" className={styles.fatoIcon} />
            <T pt={pt} es={es} en={en} />
          </li>
        ))}
      </ul>
    </section>
  );
}

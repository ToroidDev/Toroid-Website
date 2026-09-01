import Link from "next/link";
import { ArrowRight, Factory, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import { getAnosDeMercado } from "@/lib/institucional";
import styles from "./QuemSomosHero.module.css";

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: Factory, texto: "Fundada em 1994" },
  { icon: ShieldCheck, texto: "ISO 9001 certificada pela RINA" },
];

// Hero fica `position: sticky` e a próxima seção (Historia) segue no fluxo
// normal logo abaixo: o resultado é a seção seguinte deslizando por cima
// deste azul enquanto ele permanece fixo, sem JS de scroll. Ver
// QuemSomosHero.module.css para o mecanismo completo.
export function QuemSomosHero() {
  const anos = getAnosDeMercado();

  return (
    <section className={styles.hero}>
      <InstitutionalPattern spiral opacity={0.07} stroke="#9FC2EA" className={styles.pattern} />
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        <ol className={styles.breadcrumb}>
          <li>
            <Link href="/">Início</Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              /
            </span>
          </li>
          <li>
            <span aria-current="page">Quem somos</span>
          </li>
        </ol>

        <p className={styles.eyebrow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          Toroid do Brasil
        </p>

        <h1 className={styles.headline}>
          De 1994, em São José dos Pinhais, a <span className={styles.headlineAccent}>{anos} anos</span> de
          engenharia nacional.
        </h1>

        <p className={styles.lead}>
          Fundada em 1994, a Toroid do Brasil bobina, encapsula e testa eletricamente cada transformador e indutor na
          própria planta, com rastreabilidade de lote e sistema de gestão certificado. Hoje são cerca de 80
          colaboradores, mais de 3.000 clientes atendidos e mais de 18.000 projetos entregues.
        </p>

        <div className={styles.actions}>
          <a href="#orcamento" className={styles.primary}>
            Solicitar Orçamento Técnico
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </a>
          <WhatsAppLink
            className={styles.secondary}
            mensagem="Olá! Vim pela página Quem somos e gostaria de conhecer melhor a Toroid e falar com a engenharia."
          >
            Falar com nosso time
            <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
          </WhatsAppLink>
        </div>
      </div>

      {/* <ul className={styles.fatos}>
        {FATOS.map(({ icon: Icon, texto }) => (
          <li key={texto} className={styles.fato}>
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" className={styles.fatoIcon} />
            {texto}
          </li>
        ))}
      </ul> */}

      <p className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollCueLabel}>Nossa história</span>
        <span className={styles.scrollCueLine} />
      </p>
    </section>
  );
}

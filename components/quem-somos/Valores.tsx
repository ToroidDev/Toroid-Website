import { Award, Handshake, HeartHandshake, Home } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Valores.module.css";

const VALORES = [
  {
    icon: Handshake,
    nome: "Comprometimento",
    texto: "Trabalhar com dedicação e eficácia.",
    tom: "blue",
  },
  {
    icon: HeartHandshake,
    nome: "Respeito",
    texto: "Tratar o próximo com educação, considerando as diferenças.",
    tom: "green",
  },
  {
    icon: Award,
    nome: "Reconhecimento",
    texto: "O combustível que impulsiona a ser cada vez melhor.",
    tom: "copper",
  },
  {
    icon: Home,
    nome: "Família",
    texto: "A base para alcançar sonhos e superar dificuldades.",
    tom: "blueSoft",
  },
] as const;

export function Valores() {
  return (
    <section className={styles.section} id="valores">
      <div className={styles.inner}>
        <SectionHeading eyebrow="O que nos guia" lead="Os quatro princípios que orientam como a Toroid trabalha, todos os dias, dentro e fora da fábrica.">
          Princípios e valores
        </SectionHeading>

        <div className={styles.grid}>
          {VALORES.map(({ icon: Icon, nome, texto, tom }) => (
            <div key={nome} className={styles.card} data-tom={tom}>
              <span className={styles.iconWrap}>
                <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className={styles.nome}>{nome}</p>
              <p className={styles.texto}>{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

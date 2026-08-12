import Image from "next/image";
import styles from "./ContatoHero.module.css";

export function ContatoHero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/transformador-toroidal.svg"
        alt=""
        fill
        sizes="100vw"
        className={styles.textura}
      />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.rule} aria-hidden="true" />
          Toroid do Brasil
        </p>
        <h1 className={styles.titulo}>Fale conosco</h1>
        <p className={styles.lead}>
          Vendas, engenharia ou uma dúvida sobre um projeto em andamento. A equipe responde pelo canal que for mais
          rápido para você.
        </p>
      </div>
    </section>
  );
}

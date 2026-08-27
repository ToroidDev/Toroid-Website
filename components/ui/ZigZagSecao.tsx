import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./CapacidadeSecao.module.css";

interface Imagem {
  src: string;
  alt: string;
}

export function CapacidadeSecao({
  id,
  eyebrow,
  titulo,
  imagens,
  lado = "direita",
  tone = "light",
  children,
}: {
  id: string;
  eyebrow: string;
  titulo: string;
  imagens: Imagem[];
  lado?: "esquerda" | "direita";
  tone?: "light" | "tint";
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={[styles.secao, lado === "esquerda" ? styles.ladoEsquerda : "", tone === "tint" ? styles.tint : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.grid}>
        <div className={styles.texto}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 className={styles.titulo}>{titulo}</h2>
          <div className={styles.prosa}>{children}</div>
        </div>

        <div className={imagens.length > 1 ? styles.mediaDuo : styles.media}>
          {imagens.map((imagem) => (
            <figure key={imagem.src} className={styles.tile}>
              <Image
                src={imagem.src}
                alt={imagem.alt}
                fill
                sizes="(min-width: 900px) 46vw, 100vw"
                className={styles.tileImg}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

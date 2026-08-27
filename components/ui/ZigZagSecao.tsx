import type { ReactNode } from "react";
import Image from "next/image";
import { ImagePlaceholder } from "./ImagePlaceholder";
import styles from "./ZigZagSecao.module.css";

type ItemImagem = { src: string; alt: string } | { placeholder: string };

export function ZigZagSecao({
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
  imagens: ItemImagem[];
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
          {imagens.map((imagem) =>
            "placeholder" in imagem ? (
              <figure key={imagem.placeholder} className={styles.tile}>
                <ImagePlaceholder legenda={imagem.placeholder} />
              </figure>
            ) : (
              <figure key={imagem.src} className={styles.tile}>
                <Image
                  src={imagem.src}
                  alt={imagem.alt}
                  fill
                  sizes="(min-width: 900px) 46vw, 100vw"
                  className={styles.tileImg}
                />
              </figure>
            )
          )}
        </div>
      </div>
    </section>
  );
}

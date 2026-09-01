"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./VideoInstitucional.module.css";

// Fachada, não iframe direto. O embed do YouTube custa cerca de 1 MB de JS de
// terceiro e vários requests, e esta seção fica no meio de uma página com meta
// de LCP abaixo de 2,5s. Até o visitante clicar, existe só uma imagem local de
// 33 KB; o iframe entra no DOM depois do clique, já com autoplay para o clique
// valer como "play". Domínio nocookie porque o site tem banner de consentimento
// e o embed padrão grava cookie antes de qualquer reprodução.
const VIDEO_ID = "mgUk-NY4QDo";
const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
const TITULO_VIDEO = "Vídeo institucional da Toroid do Brasil";

export function VideoInstitucional() {
  const [tocando, setTocando] = useState(false);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Vídeo institucional"
          tone="dark"
          // lead="Uma volta pela fábrica em São José dos Pinhais: as pessoas, as máquinas e as etapas por trás de cada transformador que sai daqui."
        >
          Toroid do Brasil
        </SectionHeading>

        <div className={styles.palco}>
          {tocando ? (
            <iframe
              className={styles.player}
              src={EMBED_SRC}
              title={TITULO_VIDEO}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className={styles.capa}
              onClick={() => setTocando(true)}
              aria-label="Assistir ao vídeo institucional da Toroid do Brasil"
            >
              <Image
                src="/images/video-institucional-poster.webp"
                alt="Operador da Toroid bobinando um núcleo toroidal na máquina de enrolamento"
                fill
                sizes="(min-width: 1040px) 960px, 100vw"
                className={styles.capaImg}
              />
              <span className={styles.veu} aria-hidden="true" />
              <span className={styles.play} aria-hidden="true">
                <Play size={26} strokeWidth={2} fill="currentColor" />
              </span>
              <span className={styles.rotulo} aria-hidden="true">
                Assistir ao vídeo institucional
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

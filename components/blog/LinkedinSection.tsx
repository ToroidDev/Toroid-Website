import { ArrowUpRight } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/SocialIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./LinkedinSection.module.css";

const LINKEDIN_URL = "https://www.linkedin.com/company/toroidbrasil/";

// PENDENTE: atualizar a cada post novo. Texto copiado do post, e o link é a
// URL pública dele (no LinkedIn, "..." > "Copiar link para esta publicação").
const POST_TEXTO =
  "Mais eficiência energética: menos perda de energia significa menor custo operacional ao longo do tempo, um diferencial competitivo real para o seu produto final.";
const POST_URL = "https://www.linkedin.com/feed/update/urn:li:share:7497992822365716480/";

// Sem <iframe> embeddado de propósito: o embed oficial do LinkedIn depende de
// cookie de terceiro e de um script interno pra se ajustar à largura do
// container, e cai num modo degradado (tamanho fixo pequeno, fora do nosso
// controle de CSS) sob qualquer ad blocker ou navegador com cookies de
// terceiro bloqueados — bem comum. Card com texto e link nossos, sem nada de
// terceiro pra carregar, garante a mesma aparência pra qualquer visitante.
export function LinkedinSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading eyebrow="LinkedIn">Mais conteúdo técnico, direto do LinkedIn.</SectionHeading>

        <a href={POST_URL} target="_blank" rel="noopener" className={styles.post}>
          <span className={styles.postTopo}>
            <LinkedinIcon size={18} className={styles.postIcone} />
            Toroid do Brasil no LinkedIn
          </span>
          <p className={styles.postTexto}>{POST_TEXTO}</p>
          <span className={styles.postLink}>
            Ver publicação completa
            <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </span>
        </a>

        <a href={LINKEDIN_URL} target="_blank" rel="noopener" className={styles.cta}>
          <LinkedinIcon size={20} />
          <span>Nos acompanhe no LinkedIn para mais conteúdo técnico</span>
          <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" className={styles.ctaSeta} />
        </a>
      </div>
    </section>
  );
}

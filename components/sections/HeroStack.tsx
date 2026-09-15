import { Hero } from "./Hero";
import { ProvaInstitucional } from "./ProvaInstitucional";
import styles from "./HeroStack.module.css";

// Mesmo mecanismo de HeroStack.tsx em components/quem-somos: este wrapper
// delimita o bloco de contenção do Hero (`position: sticky`) a exatamente
// Hero + ProvaInstitucional, para o sticky soltar assim que a prova termina
// de cobri-lo, e não reaparecer numa fresta mais abaixo na página.
export function HeroStack() {
  return (
    <div className={styles.wrap}>
      <Hero />
      <ProvaInstitucional />
    </div>
  );
}

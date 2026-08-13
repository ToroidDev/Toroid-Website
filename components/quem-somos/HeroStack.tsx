import { QuemSomosHero } from "./QuemSomosHero";
import { Historia } from "./Historia";
import styles from "./HeroStack.module.css";

// `position: sticky` no Hero só "solta" de verdade quando o navegador
// encontra o fim do bloco de contenção mais próximo. Sem este wrapper, esse
// bloco era a div raiz do RootLayout — que envolve a página inteira mais o
// Footer — então o Hero ficava sticky (escondido atrás das seções seguintes)
// até o fim do documento inteiro, não só até o fim da Historia. Em qualquer
// seção mais baixa que a viewport (Missão, Valores), sobrava uma fresta onde
// esse hero "fantasma" reaparecia. Este `<div>` delimita o bloco de
// contenção a exatamente Hero + Historia, então o Hero solta de vez assim
// que a Historia termina de cobri-lo, e não volta mais.
export function HeroStack() {
  return (
    <div className={styles.wrap}>
      <QuemSomosHero />
      <Historia />
    </div>
  );
}

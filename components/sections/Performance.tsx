import { Thermometer, Volume2, Waves, Zap } from "lucide-react";
import { CurrentWave } from "@/components/ui/CurrentWave";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Performance.module.css";

const BENEFICIOS = [
  {
    titulo: "Maior eficiência energética",
    texto:
      "Fluxo magnético fechado no próprio núcleo reduz a perda a vazio: menos energia dissipada por hora ligada, custo operacional menor no cliente final e um argumento verificável na proposta.",
    icon: Zap,
  },
  {
    titulo: "Menor dispersão magnética",
    texto:
      "Geometria toroidal sem entreferro contém o campo: menos interferência nas placas vizinhas, montagem mais livre dentro do gabinete e menos revisão de layout no meio do projeto.",
    icon: Waves,
  },
  {
    titulo: "Menor ruído acústico",
    texto:
      "Núcleo em fita, sem lâminas empilhadas, elimina a vibração audível: equipamento silencioso em sala ocupada e menos reclamação de operador em campo.",
    icon: Volume2,
  },
  {
    titulo: "Menor aquecimento",
    texto:
      "Enrolamento distribuído em toda a circunferência dissipa melhor: temperatura de regime mais baixa, vida útil maior dos componentes próximos e menos troca em garantia.",
    icon: Thermometer,
  },
];

export function Performance() {
  return (
    <section id="performance" className={styles.section}>
      {/* variante circular, traço claro: textura para o chapado azul */}
      <InstitutionalPattern opacity={0.05} stroke="#9FC2EA" className={styles.pattern} />
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <SectionHeading eyebrow="Performance técnica" tone="dark">
              Estabilidade que aparece no equipamento, não no catálogo.
            </SectionHeading>
            <div className={styles.list}>
              {BENEFICIOS.map(({ titulo, texto, icon: Icon }) => (
                <div key={titulo} className={styles.item}>
                  <span className={styles.itemIcon} aria-hidden="true">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className={styles.itemTitle}>{titulo}</h3>
                    <p className={styles.itemText}>{texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.waveWrap}>
            <p className={styles.waveLabel}></p>
            <CurrentWave variant="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}

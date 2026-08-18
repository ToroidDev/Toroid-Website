import { Thermometer, Volume2, Waves, Zap } from "lucide-react";
import { CurrentWave } from "@/components/ui/CurrentWave";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/i18n/T";
import styles from "./Performance.module.css";

const BENEFICIOS = [
  {
    id: "eficiencia",
    titulo: {
      pt: "Maior eficiência energética",
      es: "Mayor eficiencia energética",
      en: "Higher energy efficiency",
    },
    texto: {
      pt: "Fluxo magnético fechado no próprio núcleo reduz a perda a vazio: menos energia dissipada por hora ligada, custo operacional menor no cliente final e um argumento verificável na proposta.",
      es: "El flujo magnético cerrado en el propio núcleo reduce la pérdida en vacío: menos energía disipada por hora encendida, menor costo operativo para el cliente final y un argumento verificable en la propuesta.",
      en: "Magnetic flux closed within the core itself reduces no-load loss: less energy dissipated per hour running, lower operating cost for the end client and a verifiable argument in the proposal.",
    },
    icon: Zap,
  },
  {
    id: "dispersao",
    titulo: {
      pt: "Menor dispersão magnética",
      es: "Menor dispersión magnética",
      en: "Lower magnetic dispersion",
    },
    texto: {
      pt: "Geometria toroidal sem entreferro contém o campo: menos interferência nas placas vizinhas, montagem mais livre dentro do gabinete e menos revisão de layout no meio do projeto.",
      es: "La geometría toroidal sin entrehierro contiene el campo: menos interferencia en las placas vecinas, montaje más libre dentro del gabinete y menos revisión de layout a mitad del proyecto.",
      en: "Toroidal geometry with no air gap contains the field: less interference with neighboring boards, freer assembly inside the enclosure and fewer layout revisions mid-project.",
    },
    icon: Waves,
  },
  {
    id: "ruido",
    titulo: {
      pt: "Menor ruído acústico",
      es: "Menor ruido acústico",
      en: "Lower acoustic noise",
    },
    texto: {
      pt: "Núcleo em fita, sem lâminas empilhadas, elimina a vibração audível: equipamento silencioso em sala ocupada e menos reclamação de operador em campo.",
      es: "El núcleo en cinta, sin láminas apiladas, elimina la vibración audible: equipo silencioso en sala ocupada y menos quejas del operador en campo.",
      en: "Tape-wound core, with no stacked laminations, eliminates audible vibration: quiet equipment in occupied rooms and fewer operator complaints in the field.",
    },
    icon: Volume2,
  },
  {
    id: "aquecimento",
    titulo: {
      pt: "Menor aquecimento",
      es: "Menor calentamiento",
      en: "Lower heating",
    },
    texto: {
      pt: "Enrolamento distribuído em toda a circunferência dissipa melhor: temperatura de regime mais baixa, vida útil maior dos componentes próximos e menos troca em garantia.",
      es: "El bobinado distribuido en toda la circunferencia disipa mejor: temperatura de régimen más baja, mayor vida útil de los componentes cercanos y menos cambios en garantía.",
      en: "Winding distributed across the whole circumference dissipates better: lower steady-state temperature, longer life for nearby components and fewer warranty replacements.",
    },
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
            <SectionHeading
              eyebrow={
                <T
                  pt="Performance do núcleo toroidal"
                  es="Rendimiento del núcleo toroidal"
                  en="Toroidal core performance"
                />
              }
              tone="dark"
              lead={
                <T
                  pt="Estas características vêm da geometria toroidal. Transformadores de corrente e indutores seguem princípios próprios, cada um dimensionado para a função que exerce no projeto."
                  es="Estas características vienen de la geometría toroidal. Los transformadores de corriente e inductores siguen principios propios, cada uno dimensionado para la función que ejerce en el proyecto."
                  en="These characteristics come from the toroidal geometry. Current transformers and inductors follow their own principles, each sized for the role it plays in the design."
                />
              }
            >
              <T
                pt="Estabilidade que aparece no equipamento, não no catálogo."
                es="Estabilidad que se nota en el equipo, no en el catálogo."
                en="Stability that shows up in the equipment, not in the catalog."
              />
            </SectionHeading>
            <div className={styles.list}>
              {BENEFICIOS.map(({ id, titulo, texto, icon: Icon }) => (
                <div key={id} className={styles.item}>
                  <span className={styles.itemIcon} aria-hidden="true">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className={styles.itemTitle}>
                      <T pt={titulo.pt} es={titulo.es} en={titulo.en} />
                    </h3>
                    <p className={styles.itemText}>
                      <T pt={texto.pt} es={texto.es} en={texto.en} />
                    </p>
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

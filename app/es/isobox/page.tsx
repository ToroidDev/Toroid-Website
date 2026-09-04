import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import {
  PillarBody,
  PillarChecklist,
  PillarClosing,
  PillarFoto,
  PillarHero,
  PillarIndex,
  PillarSpecTable,
  Prose,
  type SecaoPilar,
} from "@/components/produtos/Pillar";
import pillarStyles from "@/components/produtos/Pillar.module.css";

// Espelho en español de app/isobox/page.tsx, ver CLAUDE.md/i18n y
// app/es/page.tsx. Cualquier corrección de dato técnico allá debe replicarse
// aquí también.

export const metadata: Metadata = {
  title: "Isobox: Transformador de Corriente de Línea Estándar | Toroid",
  description:
    "Isobox, la línea estándar de transformador de corriente toroidal de Toroid do Brasil: corriente secundaria de 5 A, aislamiento de 600 V y tres tipos de montaje en tablero. Solicita tu presupuesto técnico.",
  alternates: {
    canonical: absoluteUrl("/es/isobox"),
    languages: {
      "pt-BR": absoluteUrl("/isobox"),
      es: absoluteUrl("/es/isobox"),
      "x-default": absoluteUrl("/isobox"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-e", titulo: "Qué es el Isobox" },
  { id: "linha-padrao-x-sob-medida", titulo: "Línea estándar o proyecto a medida" },
  { id: "tipos-de-montagem", titulo: "Tipos de montaje disponibles" },
  { id: "como-especificar", titulo: "Cómo especificar un Isobox" },
  { id: "especificacoes", titulo: "Tabla de especificaciones" },
  { id: "perguntas", titulo: "Preguntas frecuentes" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Diseñado conforme a la ABNT NBR6856" },
  { icon: Factory, texto: "Línea estándar, lista para los 3 tipos de montaje" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Corriente secundaria", "5 A"],
  ["Aislamiento", "600 V (ensayado a 4 kV)"],
  ["Clase de temperatura", "A (105 °C)"],
  ["Frecuencia nominal", "60 Hz"],
  ["Tipo constructivo", "Ventana, núcleo toroidal"],
  ["Montaje disponible", "Riel DIN, fondo de tablero o barra"],
];

const CHECKLIST = [
  "Corriente primaria nominal del circuito",
  "Tipo de montaje deseado: riel DIN, fondo de tablero o barra",
  "Diámetro del conductor o barra que va a pasar por el orificio central",
  "Carga nominal del secundario en VA, el burden que el Isobox necesita alimentar",
  "Frecuencia nominal del sistema",
  "Condición ambiental de instalación: interior, exterior o industrial agresiva",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "¿El Isobox es el mismo transformador de corriente de la línea a medida?",
    resposta:
      "Es la misma tecnología de núcleo toroidal tipo ventana y el mismo ensayo eléctrico aplicado a toda la línea Toroid. La diferencia es que el Isobox ya viene con corriente secundaria, aislamiento y montaje definidos en la línea estándar, sin pasar por la etapa de especificación a medida.",
  },
  {
    pergunta: "¿Qué tipos de montaje acepta el Isobox?",
    resposta:
      "Riel DIN, fondo de tablero o barra. Los tres tipos cubren los arreglos más comunes de tablero eléctrico, sin exigir adaptación de soporte en el panel.",
  },
  {
    pergunta: "¿Es necesario interrumpir el conductor para instalar el Isobox?",
    resposta:
      "No. Al ser un TC tipo ventana, el conductor pasa por el orificio central del núcleo sin interrupción. La instalación solo exige pasar el conductor ya existente por la ventana del transformador.",
  },
  {
    pergunta: "¿Cuándo el Isobox no es la opción correcta?",
    resposta:
      "Cuando el proyecto exige diámetro interno fuera del rango estándar, clase de exactitud específica, aislamiento por encima de 600 V u otro tipo constructivo. En esos casos, el camino es un proyecto a medida con la ingeniería de Toroid, como en las líneas de Transformadores de Corriente, Transformadores de Potencia e Inductores y Reactores.",
  },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Isobox",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Isobox, la línea estándar de transformador de corriente toroidal de Toroid do Brasil, con tres tipos de montaje en tablero ya definidos.",
    additionalProperty: ESPECIFICACOES.map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/es") },
      { "@type": "ListItem", position: 2, name: "Isobox", item: absoluteUrl("/es/isobox") },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
      "@type": "Question",
      name: pergunta,
      acceptedAnswer: { "@type": "Answer", text: resposta },
    })),
  },
];

export default function IsoboxPageEs() {
  return (
    <>
      <PillarHero
        icone="isobox"
        nomeCategoria="Isobox"
        eyebrow="Línea estándar de transformador de corriente"
        titulo={
          <>
            El Isobox llega listo para el tablero, con la misma{" "}
            <span style={{ color: "var(--color-green-light)" }}>ingeniería ensayada</span> de toda la línea Toroid
          </>
        }
        lead="El Isobox es la línea estándar de transformador de corriente toroidal de Toroid do Brasil: corriente secundaria de 5 A, aislamiento de 600 V ensayado a 4 kV y tres tipos de montaje ya definidos, riel DIN, fondo de tablero o barra. Cuando la aplicación pide parámetros fuera de esos rangos, el camino pasa a ser un proyecto a medida, no una adaptación de catálogo."
        fatos={FATOS}
      />

      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose
          id="o-que-e"
          titulo="Qué es el Isobox"
          arte={
            <PillarFoto
              src="/images/ISOBOXXX.png"
              alt="Transformador de corriente Isobox, línea estándar de Toroid do Brasil, con núcleo toroidal tipo ventana"
              legenda="Isobox: transformador de corriente de línea estándar, listo para montaje en tablero."
              largura={1200}
              altura={800}
            />
          }
        >
          <p>
            El Isobox es un transformador de corriente toroidal, tipo ventana: el conductor del circuito pasa por el
            orificio central del núcleo, sin interrupción y sin necesidad de abrir el circuito para instalarlo.
            Reduce una corriente primaria elevada, difícil de medir directamente, a una corriente secundaria de 5 A,
            proporcional, que los instrumentos de medición y protección pueden interpretar con seguridad.
          </p>
          <p>
            El aislamiento de 600 V, ensayado a 4 kV, y la clase térmica A (105 °C) definen hasta dónde el Isobox opera
            con seguridad eléctrica y térmica dentro del tablero. La frecuencia nominal es 60 Hz, la misma de la red
            brasileña.
          </p>
        </Prose>

        <Prose id="linha-padrao-x-sob-medida" titulo="Línea estándar o proyecto a medida">
          <p>
            No toda aplicación exige una especificación nueva. Cuando la corriente secundaria, el aislamiento y el
            tipo de montaje del Isobox ya cubren el proyecto, la línea estándar elimina la etapa de desarrollo y
            mantiene la misma ingeniería y el mismo ensayo eléctrico del 100% de las piezas que salen de fábrica.
          </p>
          <p>
            Cuando el tablero exige diámetro interno fuera del rango estándar, clase de exactitud específica o
            construcción diferente de las disponibles aquí, el camino pasa a ser un proyecto a medida, como en las
            líneas de Transformadores de Corriente, Transformadores de Potencia e Inductores y Reactores de Toroid.
          </p>
        </Prose>

        <Prose id="tipos-de-montagem" titulo="Tipos de montaje disponibles">
          <p>
            El Isobox está disponible en tres tipos de montaje, para cubrir los arreglos más comunes de tablero
            eléctrico sin exigir adaptación de soporte en el panel:
          </p>
          <ul>
            <li>
              <strong>Riel DIN.</strong> Se instala directo en el riel estándar del tablero eléctrico, sin
              perforación adicional.
            </li>
            <li>
              <strong>Fondo de tablero.</strong> Se fija directo en la chapa de fondo del tablero, para proyectos que
              no usan riel.
            </li>
            <li>
              <strong>Barra.</strong> Acompaña la geometría de una barra de corriente elevada, sin adaptación de
              soporte.
            </li>
          </ul>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes de cotizar"
        titulo="Cómo especificar un Isobox"
        lead="Esta es la información que nuestra ingeniería solicita para confirmar si la línea estándar cubre tu tablero, o si el proyecto necesita ser a medida."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <PillarSpecTable
          id="especificacoes"
          titulo="Especificaciones de la línea estándar Isobox"
          linhas={ESPECIFICACOES}
          nota="Parámetros de la línea estándar. Una aplicación fuera de estos rangos se evalúa como proyecto a medida por la ingeniería."
        />
        <p className={pillarStyles.specNote}>
          <a
            href="https://toroid.com.br/wp-content/uploads/2023/07/Linha-padrao-TC.pdf"
            target="_blank"
            rel="noopener"
            style={{ color: "var(--color-blue)", fontWeight: 600, textDecoration: "underline" }}
          >
            Descargar especificación técnica (PDF)
          </a>
        </p>
      </PillarBody>

      <PillarBody>
        <Perguntas id="perguntas" titulo="Preguntas que aparecen antes de cotizar" itens={PERGUNTAS} />
      </PillarBody>

      <PillarClosing id="fecho" titulo="Si la línea estándar no cubre tu caso, el siguiente paso es un proyecto a medida">
        <p>
          ¿Diámetro fuera de rango, clase de exactitud específica o aislamiento diferente del estándar? Describe la
          aplicación para que nuestro equipo evalúe un proyecto a medida, con la misma ingeniería que ensaya cada
          Isobox antes del embarque.
        </p>
      </PillarClosing>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import {
  PillarBody,
  PillarChecklist,
  PillarClosing,
  PillarHero,
  PillarIndex,
  PillarSpecTable,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// Espelho em espanhol de app/transformador-de-corrente/page.tsx — ver
// CLAUDE.md/i18n e app/es/page.tsx. Mesma ressalva da página em português:
// valores técnicos ainda não passaram por validação formal da engenharia
// (ver o comentário na página em pt), então qualquer correção lá precisa
// ser replicada aqui também.

export const metadata: Metadata = {
  title: "Transformador de Corriente (TC) a Medida | Toroid",
  description:
    "Transformador de corriente para medición y protección, con clase de exactitud desde 0,3%, fabricación nacional y garantía de 3 años. Solicita tu presupuesto técnico.",
  alternates: {
    canonical: absoluteUrl("/es/transformador-de-corrente"),
    languages: {
      "pt-BR": absoluteUrl("/transformador-de-corrente"),
      es: absoluteUrl("/es/transformador-de-corrente"),
      "x-default": absoluteUrl("/transformador-de-corrente"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-resolve", titulo: "Qué resuelve un TC en tu circuito" },
  { id: "medicao-ou-protecao", titulo: "TC de medición o de protección" },
  { id: "classe-de-exatidao", titulo: "Clase de exactitud" },
  { id: "saturacao", titulo: "Saturación y cortocircuito" },
  { id: "tc-compacto", titulo: "TC compacto para tablero" },
  { id: "tc-bipartido", titulo: "TC partido" },
  { id: "tc-resinado", titulo: "TC encapsulado en resina para ambiente agresivo" },
  { id: "tc-em-scada", titulo: "TC en sistemas SCADA" },
  { id: "religadores", titulo: "TC para reconectadores automáticos" },
  { id: "como-testamos", titulo: "Cómo probamos cada TC" },
  { id: "como-especificar", titulo: "Cómo especificar un TC" },
  { id: "especificacoes", titulo: "Tabla de especificaciones" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Diseñado conforme a la ABNT NBR6856" },
  { icon: Factory, texto: "Fabricación nacional a medida" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Clase de exactitud", "desde 0,3%"],
  ["Clase de tensión", "hasta 1,5 kV"],
  ["Tensión de aislamiento", "hasta 4 kV"],
  ["Clase térmica", "A (105 °C); B (130 °C, a consultar)"],
  ["Diámetro interno", "5 mm a 350 mm"],
  ["Norma específica de TC", "ABNT NBR6856"],
  ["Robustez a cortocircuito", "conforme a la ABNT NBR5356-5"],
];

const CHECKLIST = [
  "Aplicación: medición, protección, o ambas",
  "Corriente primaria nominal y corriente de cortocircuito prevista",
  "Clase de exactitud exigida por el proyecto o por la empresa distribuidora",
  "Diámetro del conductor o barra, que define el diámetro interno del TC",
  "Espacio disponible en el tablero",
  "Condición ambiental de instalación: interior, exterior o industrial agresiva",
  "Necesidad de instalación con núcleo partido, sin desenergizar el circuito",
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Transformador de Corriente (TC)",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Transformador de corriente para medición, protección y automatización industrial, con clase de exactitud desde 0,3%, fabricación nacional y garantía de 3 años.",
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://toroid.com.br/es" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores de Corriente",
        item: "https://toroid.com.br/es/transformador-de-corrente",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué diferencia hay entre un TC de medición y un TC de protección?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Un TC de medición necesita mantener exactitud en condición normal de operación. Un TC de protección necesita comportamiento previsible en condición de falla, incluyendo corriente de cortocircuito muy por encima de la nominal, para que el relé actúe en el tiempo correcto.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué es la clase de exactitud en un transformador de corriente?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Es el error máximo admisible entre la corriente real del circuito y la corriente indicada por el TC, dentro del rango de operación especificado. La línea Toroid parte de 0,3%.",
        },
      },
      {
        "@type": "Question",
        name: "¿Se puede instalar un TC partido sin desenergizar el circuito?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. El TC partido se abre alrededor del conductor ya energizado, lo que elimina la necesidad de desconexión para instalación o mantenimiento.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué norma rige el transformador de corriente en Brasil?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La ABNT NBR6856 es la norma específica de transformadores de corriente. La ABNT NBR5356-5 trata la capacidad de resistencia a cortocircuito, relevante para TC de protección.",
        },
      },
    ],
  },
];

export default function TransformadorDeCorrentePageEs() {
  return (
    <>
      <PillarHero
        icone="tc"
        nomeCategoria="Transformadores de Corriente"
        eyebrow="Medición, protección y automatización"
        titulo={
          <>
            El transformador de corriente equivocado se convierte en ruido, calentamiento y{" "}
            <span style={{ color: "var(--color-green-light)" }}>reproceso en el tablero</span>
          </>
        }
        lead="Un transformador de corriente mal especificado no avisa antes de fallar. Aparece como ruido eléctrico que nadie logra rastrear, como calentamiento por encima de lo esperado dentro del tablero, o como un proyecto que no cierra porque no hay espacio para el modelo de catálogo. La pregunta correcta no es qué modelo comprar. Es qué especificación exige tu aplicación."
        fatos={FATOS}
      />

      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose id="o-que-resolve" titulo="Qué resuelve un transformador de corriente en tu circuito">
          <p>
            Un transformador de corriente reduce una corriente elevada, difícil y peligrosa de medir directamente, a
            una señal secundaria proporcional que los instrumentos de medición, protección y automatización pueden
            interpretar con seguridad. El aislamiento galvánico entre el circuito de potencia y el circuito de
            control no es un detalle constructivo: es la capa de seguridad que protege al operador y a la
            instrumentación aguas abajo.
          </p>
          <p>
            La duda que llega a nuestra ingeniería casi nunca es qué TC comprar. Es qué TC resuelve el problema real:
            ruido que satura la señal, calentamiento por encima de lo proyectado, o un tablero diseñado sin espacio
            de sobra para el transformador.
          </p>
        </Prose>

        <Prose id="medicao-ou-protecao" titulo="TC de medición o TC de protección: la aplicación lo decide todo">
          <p>
            Un TC de medición necesita mantener exactitud dentro de un rango estrecho en condición normal de
            operación. Es lo que garantiza que la lectura de energía, potencia o corriente refleje lo que realmente
            circula por el sistema. Un TC de protección necesita otra cosa: comportamiento previsible en condición de
            falla, incluyendo corriente de cortocircuito muy por encima de la nominal, para que el relé actúe en el
            tiempo correcto.
          </p>
          <p>
            Tratar los dos como el mismo producto es una causa común de reproceso. Un TC dimensionado solo para
            medición puede saturar justo en el momento en que la protección más necesita una señal confiable. La
            especificación correcta parte de la aplicación, no de lo que hay en stock.
          </p>
          <p>
            La ABNT NBR6856 es la norma que rige los transformadores de corriente en Brasil y es la referencia usada
            en toda la línea de TC de Toroid, desde la clase de exactitud hasta el comportamiento en sobrecorriente.
          </p>
        </Prose>

        <Prose id="classe-de-exatidao" titulo="Clase de exactitud: el número que decide si tu medición es confiable">
          <p>
            La clase de exactitud expresa el error máximo admisible entre la corriente real del circuito y la
            corriente indicada por el TC, dentro del rango de operación especificado. En la línea Toroid la precisión
            parte de 0,3%, suficiente para medición de facturación y para lazos de protección que no toleran error de
            lectura por encima de lo previsto en el proyecto.
          </p>
          <p>
            Para quien especifica, ese número se traduce en confiabilidad del dato de campo sin ajuste posterior:
            menos reproceso de calibración, menos reclamos por facturación de energía, menos riesgo de una decisión
            de protección tomada sobre una lectura errónea.
          </p>
        </Prose>

        <Prose id="saturacao" titulo="Saturación y protección: cómo evitar una lectura errónea en el cortocircuito">
          <p>
            La corriente de cortocircuito es el escenario en que un TC mal dimensionado falla sin avisar. El núcleo
            satura, la señal secundaria deja de ser proporcional a la corriente real, y el relé de protección puede
            no actuar en el tiempo correcto, o actuar cuando no debería.
          </p>
          <p>
            La robustez eléctrica frente a cortocircuito, tratada en la ABNT NBR5356-5, entra en el dimensionamiento
            de un TC de protección junto con la clase de exactitud y el factor de sobrecorriente. En automatización
            industrial e integración de sistemas esto pesa más que cualquier hoja de especificación aislada: un
            proyecto de protección es tan confiable como el eslabón más débil de la cadena de medición.
          </p>

          <Pullquote fonte="Toroid do Brasil">
            La especificación correcta no es burocracia. Es la diferencia entre un proyecto que funciona y uno que
            genera reproceso.
          </Pullquote>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="tc-compacto" titulo="TC compacto para tablero">
          <p>
            Poco espacio en el tablero no debería comprometer el desempeño del sistema. El TC compacto de Toroid fue
            desarrollado para caber en un tablero eléctrico con el espacio ya definido por el proyecto, sin obligar
            al proyectista a rediseñar el tablero para alojar el transformador.
          </p>
          <p>
            El diámetro interno de 5 mm a 350 mm cubre desde conductores individuales hasta barras de mayor sección.
            Esto permite mantener la misma línea del tablero más pequeño al más grande de un mismo proyecto, lo que
            significa menos variación de proveedor y menos código de artículo para que compras administre. Cuando el
            estándar no cubre la instalación, evaluamos una personalización a medida.
          </p>
        </Prose>

        <Prose id="tc-bipartido" titulo="TC partido: cuándo instalar sin desenergizar el circuito">
          <p>
            Hay proyectos en los que apagar el circuito para instalar o sustituir un transformador de corriente
            cuesta más que la pieza en sí. En una planta que no puede detenerse, cada hora de parada tiene un precio.
            El TC partido se abre alrededor del conductor ya energizado y elimina la necesidad de desconexión para
            instalación o mantenimiento.
          </p>
          <p>
            Es una característica constructiva que resuelve un problema operativo, no solo eléctrico: retrofit en
            tablero existente, mantenimiento programado sin desconectar la carga, sustitución en campo sin impacto en
            la producción.
          </p>
        </Prose>

        <Prose id="tc-resinado" titulo="TC encapsulado en resina: protección extra en ambiente agresivo">
          <p>
            Un ambiente con polvo conductivo, humedad o variación térmica acentuada desgasta el aislamiento
            convencional más rápido de lo previsto en el proyecto. El encapsulado en resina epóxi agrega una capa de
            protección mecánica y de aislamiento contra esos factores, el mismo principio de acabado aplicado en la
            línea de transformadores de potencia para aplicaciones críticas.
          </p>
          <p>
            Para quien especifica equipos que van a operar en ambiente industrial no controlado, esa es la diferencia
            entre una pieza que dura el ciclo de vida del proyecto y una que exige sustitución antes de lo previsto.
            El impacto aparece en el costo total de propiedad del tablero, no en la cotización inicial.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose id="tc-em-scada" titulo="TC en SCADA: dato de campo en el que la automatización puede confiar">
          <p>
            Un sistema SCADA es tan bueno como el dato que le llega. Un transformador de corriente con clase de
            exactitud inadecuada para el punto de medición genera un error que se propaga por toda la cadena de
            supervisión, y que nadie percibe hasta que el dato de campo deja de coincidir con el balance de energía.
          </p>
          <p>
            Especificar el TC para el punto de instrumentación, y no solo para el tablero en general, es lo que da
            estabilidad al sistema de supervisión desde el primer día de operación.
          </p>
        </Prose>

        <Prose id="religadores" titulo="TC para reconectadores automáticos: robustez en red de distribución">
          <p>
            El reconectador automático opera en red de distribución, expuesto a cortocircuito, sobrecorriente
            transitoria y ciclos de reconexión sucesivos en intervalo corto. El transformador de corriente que
            alimenta la protección de este equipo necesita mantener exactitud y confiabilidad bajo ese régimen, más
            exigente que la operación normal de un tablero industrial.
          </p>
          <p>
            Es uno de los casos en que la robustez frente a cortocircuito pesa tanto como la clase de exactitud en la
            decisión de especificación.
          </p>
        </Prose>

        <Prose id="como-testamos" titulo="Cómo probamos cada TC antes del embarque">
          <p>
            El 100% de los transformadores de corriente producidos pasa por ensayo eléctrico antes de salir de
            fábrica, no por muestreo. El laboratorio mide tensión y corriente en vacío, error y comportamiento en
            saturación, ángulo de desfase, inductancia, aislamiento y polaridad.
          </p>
          <p>
            Son los mismos parámetros que definen si un TC se va a comportar como lo previsto en campo: error y
            saturación confirman la clase de exactitud declarada, y el ángulo de desfase y la polaridad evitan
            reprocesos de instalación en el tablero y en el lazo de protección.
          </p>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes de la cotización"
        titulo="Cómo especificar un transformador de corriente"
        lead="Esta es la información que nuestra ingeniería solicita para transformar una cotización genérica en una especificación a medida. Cuanto más completa la lista, menor el riesgo de reproceso después de la instalación."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <PillarSpecTable
          id="especificacoes"
          titulo="Especificaciones de la línea de transformadores de corriente"
          linhas={ESPECIFICACOES}
          nota="Parámetros de la línea estándar. Aplicaciones fuera de estos rangos se evalúan caso por caso con la ingeniería."
        />
      </PillarBody>

      <PillarClosing id="fecho" titulo="Empieza por la restricción, no por el código del producto">
        <p>
          Si tu tablero tiene restricción de espacio, requisito de exactitud específico, o antecedentes de un TC que
          no duró lo esperado, describe la restricción a nuestra ingeniería antes de cerrar la especificación. Es más
          rápido que comparar catálogos.
        </p>
      </PillarClosing>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

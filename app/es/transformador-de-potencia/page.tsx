import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import {
  PillarBody,
  PillarChecklist,
  PillarHero,
  PillarIndex,
  PillarSpecTable,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// Espelho em espanhol de app/transformador-de-potencia/page.tsx — ver
// CLAUDE.md/i18n e app/es/page.tsx. Mesma ressalva da página em português:
// valores técnicos ainda não passaram por validação formal da engenharia
// (ver o comentário na página em pt), então qualquer correção lá precisa
// ser replicada aqui também.

export const metadata: Metadata = {
  title: "Transformador de Potencia a Medida | Toroid do Brasil",
  description:
    "Transformador de potencia con aislamiento galvánico, eficiencia hasta 98% y núcleo toroidal o convencional según el proyecto. Solicita presupuesto técnico con nuestra ingeniería.",
  alternates: {
    canonical: absoluteUrl("/es/transformador-de-potencia"),
    languages: {
      "pt-BR": absoluteUrl("/transformador-de-potencia"),
      es: absoluteUrl("/es/transformador-de-potencia"),
      "x-default": absoluteUrl("/transformador-de-potencia"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-resolve", titulo: "Qué resuelve un transformador de potencia en tu proyecto" },
  { id: "isolacao-e-eficiencia", titulo: "Aislamiento galvánico y eficiencia" },
  { id: "materias-primas", titulo: "Materias primas: acero y cobre" },
  { id: "acabamentos", titulo: "Encapsulado, en resina o simple" },
  { id: "medico", titulo: "Equipos médicos" },
  { id: "solar", titulo: "Energía solar y generación distribuida" },
  { id: "como-especificar", titulo: "Cómo especificar un transformador de potencia" },
  { id: "especificacoes", titulo: "Tabla de especificaciones" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Tipo seco conforme a la ABNT NBR5356-11" },
  { icon: Factory, texto: "Fabricación nacional a medida" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Rango de potencia", "5 VA a 15 kVA"],
  ["Frecuencia de operación", "50 Hz a 800 Hz"],
  ["Aislamiento", "galvánico, con blindaje electrostático y electromagnético"],
  ["Tensión de aislamiento", "hasta 4 kV"],
  ["Eficiencia", "hasta 98%"],
  ["Regulación", "hasta 1%"],
  ["Acabados disponibles", "Mylar o resina epóxi"],
  ["Norma de referencia (tipo seco)", "ABNT NBR5356-11"],
];

const CHECKLIST = [
  "Potencia necesaria y rango de tensión de entrada y salida",
  "Frecuencia de operación: red estándar o frecuencia específica del equipo",
  "Espacio físico disponible en el gabinete o en el producto final",
  "Ambiente de instalación: estándar, industrial, exterior o médico",
  "Necesidad de blindaje adicional contra EMI",
  "Volumen del pedido y plazo del proyecto",
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Transformador de Potencia",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Transformador de potencia con aislamiento galvánico, eficiencia hasta 98%, disponible en núcleo toroidal o convencional según el proyecto.",
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
        name: "Transformadores de Potencia",
        item: "https://toroid.com.br/es/transformador-de-potencia",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuál es la eficiencia de un transformador de potencia Toroid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La línea Toroid opera con eficiencia de hasta 98% y regulación de hasta 1%.",
        },
      },
      {
        "@type": "Question",
        name: "¿Se puede usar un transformador de potencia en equipos médicos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. La construcción tipo seco, sin aceite aislante, está enmarcada en la ABNT NBR5356-11, y la línea Toroid es RoHS Compliant.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la diferencia entre el acabado Mylar y la resina epóxi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El Mylar ofrece aislamiento eléctrico en aplicaciones estándar. El encapsulado en resina epóxi agrega protección mecánica y resistencia a humedad, polvo y variación térmica, indicado para ambientes agresivos.",
        },
      },
      {
        "@type": "Question",
        name: "¿El transformador de potencia puede tener núcleo toroidal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. La línea puede fabricarse con núcleo toroidal o en construcción convencional E/I, según la restricción del proyecto. Cada tecnología atiende necesidades diferentes.",
        },
      },
    ],
  },
];

export default function TransformadorDePotenciaPageEs() {
  return (
    <>
      <PillarHero
        icone="potencia"
        nomeCategoria="Transformadores de Potencia"
        eyebrow="Aislamiento, regulación y eficiencia a medida"
        titulo={
          <>
            Un transformador de potencia mal especificado se convierte en inestabilidad de tensión y calentamiento{" "}
            <span style={{ color: "var(--color-green-light)" }}>que solo aparece después de la instalación</span>
          </>
        }
        lead="Un transformador de potencia dentro del rango nominal todavía puede fallar en lo que importa: regulación inestable bajo carga variable, calentamiento por encima de lo proyectado, o aislamiento insuficiente para el ambiente de instalación. La pregunta correcta no es qué modelo de catálogo comprar. Es qué especificación exige tu aplicación."
        fatos={FATOS}
      />

      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose id="o-que-resolve" titulo="Qué resuelve un transformador de potencia en tu proyecto">
          <p>
            Un transformador de potencia entrega la tensión y la corriente que el resto del circuito necesita,
            aislando galvánicamente el lado de alimentación del lado de carga. Ese aislamiento no es un detalle
            constructivo: es la capa de seguridad que protege al equipo y al operador contra una falla del lado de
            potencia.
          </p>
          <p>
            La duda que llega a nuestra ingeniería raramente es qué transformador comprar. Es qué especificación
            resuelve el problema real del proyecto: regulación de tensión inestable bajo carga variable, calentamiento
            por encima de lo previsto, o aislamiento insuficiente para el ambiente de instalación.
          </p>
        </Prose>

        <Prose id="isolacao-e-eficiencia" titulo="Aislamiento galvánico y eficiencia: qué protege al sistema">
          <p>
            El aislamiento galvánico entre primario y secundario protege el circuito de carga contra una falla del
            lado de alimentación. Es un requisito de seguridad, no un recurso opcional. Combinado con blindaje
            electrostático y electromagnético, ese aislamiento también reduce la interferencia que el transformador
            introduce en el resto del sistema, algo que importa especialmente en equipos sensibles al ruido eléctrico.
          </p>
          <p>
            La línea de transformadores de potencia de Toroid opera con eficiencia de hasta 98% y regulación de hasta
            1%, con tensión de aislamiento de hasta 4 kV y rango de frecuencia de 50 Hz a 800 Hz. Esto cubre tanto
            aplicaciones de red estándar como equipos que operan en frecuencia no convencional.
          </p>

          <Pullquote fonte="Toroid do Brasil">
            Las operaciones críticas no esperan solo energía. Esperan estabilidad.
          </Pullquote>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="materias-primas" titulo="Materias primas: acero al silicio y cobre esmaltado">
          <p>
            El núcleo parte de acero al silicio de grano orientado, en los espesores M3 (0,23 mm) y M4 (0,27 mm),
            cortado en anchos de 10 mm a 80 mm según la especificación del proyecto. Es esa lámina de alta
            permeabilidad magnética la que sostiene el desempeño declarado en la tabla de especificaciones.
          </p>
          <p>
            El bobinado usa cobre esmaltado G2, con calibre de 5 AWG a 36 AWG, para soportar desde corrientes bajas de
            instrumentación hasta cargas más exigentes, sin cambiar de proveedor entre un rango y otro de la línea.
          </p>
        </Prose>

        <Prose id="acabamentos" titulo="Encapsulado, en resina o simple: qué acabado protege el proyecto">
          <p>
            El acabado cambia lo que el transformador resiste en el ambiente de instalación, no la tecnología en sí.
            El Mylar ofrece aislamiento eléctrico en aplicaciones estándar. El encapsulado en resina epóxi agrega
            protección mecánica y resistencia a humedad, polvo y variación térmica, lo que aumenta la durabilidad en
            ambientes agresivos.
          </p>
          <p>
            Especificar el acabado según el ambiente real de instalación evita un problema común: un transformador
            que funciona bien en banco de pruebas y se degrada antes de lo previsto en campo.
          </p>
        </Prose>

        <Prose id="medico" titulo="Transformador de potencia para equipos médicos">
          <p>
            Los equipos médicos tienen una exigencia de seguridad eléctrica que no deja margen para interpretación:
            aislamiento galvánico robusto, baja corriente de fuga y comportamiento previsible bajo falla. La
            construcción tipo seco, sin aceite aislante, enmarcada en la ABNT NBR5356-11, atiende ese perfil de
            aplicación. La certificación RoHS Compliant es relevante para quien fabrica para mercado regulado.
          </p>
          <p>
            Aquí la especificación técnica documentada pesa más que el precio unitario. La homologación de equipos
            médicos no tolera un proveedor que no respalde el dato técnico con una norma.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose id="solar" titulo="Transformador de potencia para energía solar y generación distribuida">
          <p>
            En generación distribuida y energía solar, la eficiencia del transformador se acumula a lo largo de miles
            de horas de operación. Un punto porcentual de pérdida adicional es energía generada y no entregada. La
            eficiencia de hasta 98%, combinada con regulación de hasta 1%, contribuye directamente al desempeño
            global del sistema, especialmente en instalaciones con espacio ya restringido por definición del
            proyecto.
          </p>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes de la cotización"
        titulo="Cómo especificar un transformador de potencia"
        lead="Es este conjunto de información el que separa una cotización de catálogo de una especificación a medida, incluso cuando el estándar no cabe en el gabinete del producto final y el proyecto exige personalización."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <PillarSpecTable
          id="especificacoes"
          titulo="Especificaciones de la línea de transformadores de potencia"
          linhas={ESPECIFICACOES}
          nota="Parámetros de la línea estándar. Aplicaciones fuera de estos rangos se evalúan caso por caso con la ingeniería."
        />
      </PillarBody>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

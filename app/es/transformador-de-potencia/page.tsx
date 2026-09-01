import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import {
  PillarAviso,
  PillarBody,
  PillarChecklist,
  PillarFoto,
  PillarHero,
  PillarIndex,
  PillarSpecTable,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// Espelho em espanhol de app/transformador-de-potencia/page.tsx, ver
// CLAUDE.md/i18n e app/es/page.tsx. Os valores técnicos foram validados pela
// engenharia em 2026-09-01 (ver o comentário na página em pt), e qualquer
// correção lá precisa ser replicada aqui também. A comparação entre núcleo EI
// e núcleo toroidal do documento da engenharia NÃO foi publicada, por decisão:
// não reintroduzir aqui.

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
  { id: "autotransformador-ou-isolador", titulo: "Autotransformador o transformador aislador" },
  { id: "blindagem", titulo: "Blindaje electrostático y magnético" },
  { id: "secundario-em-curto", titulo: "Nunca conectes el secundario en corto" },
  { id: "materias-primas", titulo: "Materias primas: acero y cobre" },
  { id: "acabamentos", titulo: "Encapsulado, en resina o simple" },
  { id: "medico", titulo: "Equipos médicos" },
  { id: "solar", titulo: "Energía solar y generación distribuida" },
  { id: "como-especificar", titulo: "Cómo especificar un transformador de potencia" },
  { id: "especificacoes", titulo: "Tabla de especificaciones" },
  { id: "perguntas", titulo: "Preguntas frecuentes" },
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
  "Tensión nominal de entrada y de salida (V)",
  "Potencia nominal (VA) o corriente de la carga en el secundario (A)",
  "Frecuencia nominal (Hz): red estándar o frecuencia específica del equipo",
  "Clase de aislamiento",
  "Dimensiones mínimas y máximas disponibles en el gabinete o en el producto final (mm)",
  "Tipo de aplicación y ambiente de instalación: estándar, industrial, exterior o médico",
  "Necesidad de blindaje electrostático o magnético",
  "Tipo de acabado",
  "Volumen del pedido y plazo del proyecto",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "¿Cuál es la eficiencia de un transformador de potencia Toroid?",
    resposta: "La línea Toroid opera con eficiencia de hasta 98% y regulación de hasta 1%.",
  },
  {
    pergunta: "¿A partir de qué tensión un circuito se considera de alta tensión?",
    resposta:
      "Según la NR-10, toda tensión en corriente alterna por encima de 1000 V se considera alta tensión, y los valores por debajo son baja tensión. Generación y transmisión trabajan en alta tensión, y es en la distribución donde ocurre el paso a los niveles de baja tensión que alimentan el equipo final.",
  },
  {
    pergunta: "¿Cuál es la diferencia entre autotransformador y transformador aislador?",
    resposta:
      "El autotransformador tiene solo el núcleo y un devanado, y sirve para corregir el nivel de alimentación, por ejemplo de 127 Vca a 220 Vca. El transformador aislador tiene primario y secundario separados, así que además de adecuar la tensión mantiene aislamiento galvánico entre ambos lados, lo que funciona como protección complementaria del equipo.",
  },
  {
    pergunta: "¿Qué es el blindaje electrostático en un transformador?",
    resposta:
      "Es una capa aplicada entre el primario y el secundario que refuerza el aislamiento galvánico entre los devanados, con un cable dedicado para la puesta a tierra del transformador. Sirve principalmente como protección contra descargas atmosféricas que lleguen por la alimentación.",
  },
  {
    pergunta: "¿Qué pasa si el secundario de un transformador de potencia se conecta en corto?",
    resposta:
      "A diferencia del transformador de corriente, el transformador de potencia no está diseñado para operar con el secundario en corto. Conectar los devanados secundarios entre sí eleva la corriente del circuito, daña el transformador y crea riesgo de incendio, de explosión y de choque eléctrico para quien esté manipulando el equipo.",
  },
  {
    pergunta: "¿Se puede usar un transformador de potencia en equipos médicos?",
    resposta:
      "Sí. La construcción tipo seco, sin aceite aislante, está enmarcada en la ABNT NBR5356-11, y la línea Toroid es RoHS Compliant.",
  },
  {
    pergunta: "¿Cuál es la diferencia entre el acabado Mylar y la resina epóxi?",
    resposta:
      "El Mylar ofrece aislamiento eléctrico en aplicaciones estándar. El encapsulado en resina epóxi agrega protección mecánica y resistencia a humedad, polvo y variación térmica, indicado para ambientes agresivos.",
  },
  {
    pergunta: "¿El transformador de potencia puede tener núcleo toroidal?",
    resposta:
      "Sí. La línea puede fabricarse con núcleo toroidal o en construcción convencional E/I, según la restricción del proyecto. Cada tecnología atiende necesidades diferentes.",
  },
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/es") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores de Potencia",
        item: absoluteUrl("/es/transformador-de-potencia"),
      },
    ],
  },
  {
    // Derivado de PERGUNTAS, la misma constante que alimenta la sección visible.
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
      "@type": "Question",
      name: pergunta,
      acceptedAnswer: { "@type": "Answer", text: resposta },
    })),
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
        <Prose
          id="o-que-resolve"
          titulo="Qué resuelve un transformador de potencia en tu proyecto"
          arte={
            <PillarFoto
              src="/images/produtos/tp-toroidal-isolado.webp"
              alt="Transformador de potencia toroidal aislado con cinta, apoyado de lado, con dos mazos de cables de colores saliendo de los bobinados"
              legenda="Transformador de potencia toroidal, con primario y secundario aislados y mazos ya identificados."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Un transformador de potencia entrega la tensión y la corriente que el resto del circuito necesita,
            aislando galvánicamente el lado de alimentación del lado de carga. Ese aislamiento no es un detalle
            constructivo: es la capa de seguridad que protege al equipo y al operador contra una falla del lado de
            potencia.
          </p>
          <p>
            El equipo puede ser elevador, cuando aumenta la tensión aplicada en el primario, o reductor, cuando baja la
            tensión al nivel deseado. Es lo que sostiene todo el Sistema Eléctrico de Potencia: en la generación y la
            transmisión, los transformadores reductores bajan tensiones como 69 kV y 138 kV a niveles normalizados de
            medición y protección; en la distribución, reducen de nuevo hasta los 127 V, 220 V o 380 V que llegan al
            consumidor. Según la NR-10, el umbral entre alta y baja tensión en corriente alterna está en 1000 V.
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

        <Prose
          id="autotransformador-ou-isolador"
          titulo="Autotransformador o transformador aislador: qué cambia en baja tensión"
          arte={
            <PillarFoto
              src="/images/produtos/tp-chicotes.webp"
              alt="Transformador de potencia toroidal con dos mazos separados, cada uno terminado en su propio conector, saliendo hacia lados opuestos"
              legenda="Transformador aislador: primario y secundario salen en mazos separados, cada uno en su conector."
              largura={1200}
              altura={750}
            />
          }
        >
          <p>
            En baja tensión, dos construcciones resuelven problemas diferentes y suelen confundirse a la hora de
            cotizar. El <strong>autotransformador</strong> tiene solo el núcleo y un devanado, y sirve para corregir el
            nivel de alimentación, por ejemplo transformar 127 Vca en 220 Vca o al revés. Es la opción económica cuando
            el objetivo es únicamente adecuar tensión.
          </p>
          <p>
            El <strong>transformador aislador</strong> tiene primario y secundario separados. Además de adecuar la
            tensión, mantiene aislamiento galvánico entre ambos lados, lo que convierte al transformador en protección
            complementaria del equipo aguas abajo. Cuando el proyecto necesita que una falla en la alimentación no
            atraviese hasta la carga, esa separación es lo que decide entre las dos construcciones.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose
          id="blindagem"
          titulo="Blindaje electrostático y blindaje magnético: dos protecciones distintas"
          arte={
            <PillarFoto
              src="/images/produtos/tp-toroidal-multiplos-enrolamentos.webp"
              alt="Transformador de potencia toroidal visto desde arriba, con varios bobinados secundarios llevados a conectores y regletas de bornes identificadas"
              legenda="Transformador con múltiples secundarios. Cada salida se identifica en fábrica, incluido el cable dedicado a la puesta a tierra del blindaje."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            La tabla de especificaciones declara aislamiento galvánico con blindaje electrostático y electromagnético.
            Son dos cosas diferentes, y la elección entre ellas depende de qué problema necesita resolver el proyecto.
          </p>
          <ul>
            <li>
              <strong>Blindaje electrostático.</strong> Aplicado entre el primario y el secundario, refuerza el
              aislamiento galvánico entre los devanados y recibe un cable dedicado para la puesta a tierra del
              transformador. Protege principalmente contra descargas atmosféricas que lleguen por la alimentación.
            </li>
            <li>
              <strong>Blindaje magnético.</strong> Capas de chapa de acero al silicio aplicadas alrededor del
              transformador, para reducir el campo magnético que emite. Sirve para evitar que el propio transformador
              interfiera con los demás componentes del circuito.
            </li>
          </ul>
          <p>
            Uno protege al transformador de lo que viene de afuera, el otro protege lo que está alrededor del
            transformador. En equipos sensibles al ruido eléctrico es común necesitar los dos, y por eso el blindaje
            aparece como ítem propio en el checklist de especificación.
          </p>
        </Prose>

        <PillarAviso id="secundario-em-curto" titulo="Nunca conectes el secundario del TP en corto">
          <p>
            Aquí la regla es la opuesta a la del transformador de corriente, y confundirlas cuesta caro. El
            transformador de potencia no está diseñado para operar con el secundario en corto. Conectar los devanados
            secundarios entre sí eleva la corriente del circuito muy por encima de lo previsto, lo que daña el
            transformador y crea riesgo de incendio, de explosión y de choque eléctrico para quien esté manipulando el
            equipo.
          </p>
          <p>
            En el transformador de corriente vale lo contrario: allí el secundario nunca puede quedar abierto. Cada
            familia tiene su condición prohibida, y la que se aplica a una no se aplica a la otra.
          </p>
        </PillarAviso>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose
          id="materias-primas"
          titulo="Materias primas: acero al silicio y cobre esmaltado"
          arte={
            <PillarFoto
              src="/images/produtos/tp-cobre-em-producao.webp"
              alt="Detalle de transformadores toroidales en producción, con el bobinado de cobre esmaltado a la vista y cables protegidos por conducto corrugado"
              legenda="Cobre esmaltado G2 bobinado sobre núcleo toroidal de acero al silicio de grano orientado, en la línea de producción."
              largura={1200}
              altura={800}
            />
          }
        >
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

        <Prose
          id="acabamentos"
          titulo="Encapsulado, en resina o simple: qué acabado protege el proyecto"
          arte={
            <PillarFoto
              src="/images/produtos/tp-familia.webp"
              alt="Tres transformadores de potencia Toroid uno al lado del otro: uno toroidal aislado en Mylar, uno más pequeño con mazo de cables identificados y uno encapsulado en resina epoxi negra"
              legenda="El mismo transformador, tres acabados: aislado en Mylar, con mazo identificado y encapsulado en resina epoxi."
              largura={1200}
              altura={750}
            />
          }
        >
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

        <Prose
          id="medico"
          titulo="Transformador de potencia para equipos médicos"
          arte={
            <PillarFoto
              src="/images/produtos/tp-em-gabinete.webp"
              alt="Transformador de potencia toroidal montado en la base de un gabinete metálico, bajo la placa de control y el mazo de cables del equipo, con sello verde de aprobación de control de calidad"
              legenda="Transformador ya montado en el gabinete del equipo, con sello de aprobación del control de calidad."
              largura={1000}
              altura={750}
            />
          }
        >
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
        <Prose
          id="solar"
          titulo="Transformador de potencia para energía solar y generación distribuida"
          arte={
            <PillarFoto
              src="/images/produtos/tp-alta-potencia.webp"
              alt="Transformador de potencia de núcleo rectangular aislado en cinta, con cables de gran sección en naranja y negro y soportes metálicos de fijación"
              legenda="Transformador de mayor potencia, con cable de sección compatible y soportes propios de fijación."
              largura={1000}
              altura={750}
            />
          }
        >
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

      <PillarBody>
        <Perguntas id="perguntas" titulo="Preguntas que aparecen en esta especificación" itens={PERGUNTAS} />
      </PillarBody>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import {
  PillarBody,
  PillarChecklist,
  PillarHero,
  PillarIndex,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// Espelho em espanhol de app/indutores-filtros-e-chokes/page.tsx — ver
// CLAUDE.md/i18n e app/es/page.tsx. Mesma ressalva da página em português:
// sem tabela de especificações de propósito, por não haver faixa técnica de
// indutor confirmada pela engenharia ainda.

export const metadata: Metadata = {
  title: "Inductores y Reactores a Medida | Toroid do Brasil",
  description:
    "Inductores y reactores con inductancia especificada según el rango real de operación del circuito, fabricación nacional y garantía de 3 años. Solicita presupuesto técnico.",
  alternates: {
    canonical: absoluteUrl("/es/indutores-filtros-e-chokes"),
    languages: {
      "pt-BR": absoluteUrl("/indutores-filtros-e-chokes"),
      es: absoluteUrl("/es/indutores-filtros-e-chokes"),
      "x-default": absoluteUrl("/indutores-filtros-e-chokes"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "faixa-de-operacao", titulo: "Inductancia según el rango de operación" },
  { id: "filtragem", titulo: "Filtrado de armónicos" },
  { id: "limitacao", titulo: "Limitación de corriente" },
  { id: "nucleo", titulo: "Elección del núcleo" },
  { id: "como-especificar", titulo: "Cómo especificar" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "ISO 9001 certificada por RINA" },
  { icon: Factory, texto: "Diseño a medida" },
];

const CHECKLIST = [
  "Aplicación: filtrado de armónicos, limitación de corriente, o ambas",
  "Rango de corriente y de frecuencia de operación real del circuito",
  "Inductancia objetivo y tolerancia aceptable dentro de ese rango",
  "Corriente de arranque o de cortocircuito prevista, cuando aplique",
  "Espacio físico disponible para la instalación",
  "Ambiente de instalación: estándar, industrial o exterior",
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Inductores y Reactores",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: { "@type": "Organization", name: "Toroid do Brasil" },
    description:
      "Inductores y reactores para filtrado y limitación de corriente, con inductancia especificada según el rango de operación real de la aplicación, fabricación nacional y garantía de 3 años.",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://toroid.com.br/es" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Inductores y Reactores",
        item: "https://toroid.com.br/es/indutores-filtros-e-chokes",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Por qué la inductancia nominal no basta para especificar un inductor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Porque la inductancia varía con la corriente y con la frecuencia de operación. Dos inductores con el mismo valor nominal pueden comportarse de forma diferente en el circuito real, y uno de ellos puede saturar justo en el rango en que el proyecto lo necesita.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la diferencia entre un inductor de filtrado y un reactor de limitación de corriente?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El inductor de filtrado actúa sobre un rango de frecuencia específico para atenuar armónicos. El reactor de limitación actúa sobre la amplitud de la corriente en el arranque de motor o en falla, protegiendo el resto del sistema hasta que la protección actúe.",
        },
      },
    ],
  },
];

export default function IndutoresFiltrosEChokesPageEs() {
  return (
    <>
      <PillarHero
        icone="indutor"
        nomeCategoria="Inductores y Reactores"
        eyebrow="Filtrado y limitación de corriente"
        titulo={
          <>
            La inductancia nominal aislada no garantiza{" "}
            <span style={{ color: "var(--color-green-light)" }}>el desempeño en tu circuito</span>
          </>
        }
        lead="Un inductor o reactor especificado solo por el valor nominal, sin considerar el rango real de operación del circuito, es una causa común de reproceso. El componente cumple la hoja de datos y aun así no filtra el armónico esperado, o no limita la corriente de arranque como lo previsto en el proyecto."
        fatos={FATOS}
      />

      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose id="faixa-de-operacao" titulo="Inductancia según el rango de operación, no por el valor nominal aislado">
          <p>
            Dos inductores con la misma inductancia nominal pueden comportarse de forma completamente diferente
            dentro del circuito real, porque la inductancia varía con la corriente y con la frecuencia de operación.
            Un componente dimensionado solo para el valor de catálogo puede saturar, calentar por encima de lo
            previsto o perder eficacia de filtrado justo en el rango en que el proyecto más lo necesita.
          </p>
          <p>
            Especificar a partir del rango real de operación es lo que garantiza que el inductor o reactor entregue
            el desempeño proyectado una vez instalado, y no solo en la hoja de datos.
          </p>

          <Pullquote fonte="Toroid do Brasil">
            La especificación correcta no es burocracia. Es la diferencia entre un proyecto que funciona y uno que
            genera reproceso.
          </Pullquote>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="filtragem" titulo="Filtrado de armónicos: el inductor depende de la frecuencia que necesita atenuar">
          <p>
            Un inductor de filtrado actúa sobre un rango de frecuencia específico del sistema. Dimensionar este
            componente exige saber qué armónico necesita atenuar el proyecto y cuál es el nivel de corriente
            involucrado, y esa información no aparece en un valor nominal de inductancia aislado.
          </p>
          <p>
            Sin ese dato, el resultado habitual es un componente que reduce la distorsión medida en banco de pruebas
            y decepciona en el punto real de instalación, donde el espectro de corriente es otro.
          </p>
        </Prose>

        <Prose id="limitacao" titulo="Limitación de corriente de arranque y de cortocircuito: el papel del reactor">
          <p>
            Un reactor de limitación protege al resto del sistema en el momento más crítico: arranque de motor o
            falla en el circuito. El dimensionamiento correcto pasa por conocer la corriente de arranque esperada, la
            corriente de cortocircuito prevista y el tiempo que la protección del sistema tarda en actuar.
          </p>
          <p>
            Es la combinación de estos tres datos, y no la inductancia sola, la que define si el reactor sostiene la
            corriente durante el tiempo necesario sin saturar.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody>
        <Prose id="nucleo" titulo="Elección del núcleo: cada construcción atiende necesidades diferentes">
          <p>
            El núcleo toroidal concentra el campo magnético y ocupa menos volumen para el mismo rango de trabajo, lo
            que ayuda cuando hay restricción de espacio o sensibilidad a interferencia electromagnética en el
            entorno. Otras construcciones siguen siendo adecuadas cuando el costo por unidad pesa más, o cuando el
            proyecto ya está validado en torno a ellas.
          </p>
          <p>
            Cada tecnología atiende necesidades diferentes. La decisión es siempre sobre cuál de ellas genera más
            valor para los objetivos de este proyecto, y llega después de conocer el rango de operación, nunca antes.
          </p>
          <p>
            Cuando el núcleo toroidal es la elección correcta, se fabrica internamente, con diámetro externo de 15 mm
            a 350 mm, y el aislamiento y el bobinado también ocurren bajo el mismo techo, sin depender de un
            proveedor externo en ninguna de esas etapas.
          </p>
        </Prose>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes de la cotización"
        titulo="Cómo especificar un inductor o reactor"
        lead="Este conjunto de información es lo que separa una especificación a medida de un componente de catálogo elegido por el valor nominal. También es lo que evita el reproceso de una pieza que cumple la hoja de datos y no resuelve el problema del circuito."
        itens={CHECKLIST}
      />

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

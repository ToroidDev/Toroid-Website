import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import {
  PillarAviso,
  PillarBody,
  PillarChecklist,
  PillarClosing,
  PillarFoto,
  PillarHero,
  PillarIndex,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// Espelho em espanhol de app/indutores-filtros-e-chokes/page.tsx, ver
// CLAUDE.md/i18n e app/es/page.tsx. Mesma ressalva da página em português:
// segue sem tabela de especificações de propósito, por não haver faixa técnica
// de indutor confirmada pela engenharia ainda. O brief de conteúdo recebido em
// 2026-09-01 foi aplicado nas duas versões.

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
  { id: "o-que-e", titulo: "Qué hace un inductor en el circuito" },
  { id: "faixa-de-operacao", titulo: "Inductancia según el rango de operación" },
  { id: "onde-se-aplica", titulo: "Dónde aparece el inductor en el proyecto" },
  { id: "filtragem", titulo: "Filtrado de armónicos" },
  { id: "modo-comum-e-diferencial", titulo: "Modo común y modo diferencial" },
  { id: "limitacao", titulo: "Limitación de corriente" },
  { id: "nucleo", titulo: "Elección del núcleo" },
  { id: "cuidados", titulo: "Cuidados de aplicación" },
  { id: "como-especificar", titulo: "Cómo especificar" },
  { id: "perguntas", titulo: "Preguntas frecuentes" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "ISO 9001 certificada por RINA" },
  { icon: Factory, texto: "Diseño a medida" },
];

const CHECKLIST = [
  "Inductancia objetivo (H) y tolerancia aceptable dentro del rango de operación",
  "Corriente eléctrica nominal (A) y rango real de corriente del circuito",
  "Frecuencia nominal (Hz) y rango de frecuencia que necesita ser atenuado",
  "Aplicación: filtrado de armónicos, limitación de corriente, o ambas",
  "Modo de filtrado, cuando aplique: modo común o modo diferencial",
  "Corriente de arranque o de cortocircuito prevista, cuando aplique",
  "Espacio físico disponible para la instalación",
  "Ambiente de instalación: estándar, industrial o exterior",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "¿Qué es la inductancia y en qué unidad se mide?",
    resposta:
      "La inductancia es la medida de la oposición que un inductor ofrece a la variación de la corriente eléctrica que pasa por él. La unidad es el henry (H). En la práctica, es el parámetro que describe cuánto logra ese componente amortiguar los picos de corriente del circuito.",
  },
  {
    pergunta: "¿Por qué la inductancia nominal no basta para especificar un inductor?",
    resposta:
      "Porque la inductancia varía con la corriente y con la frecuencia de operación. Dos inductores con el mismo valor nominal pueden comportarse de forma diferente en el circuito real, y uno de ellos puede saturar justo en el rango en que el proyecto lo necesita.",
  },
  {
    pergunta: "¿Qué es un choke de filtro?",
    resposta:
      "Es un inductor aplicado para bloquear interferencia electromagnética y ruido en un rango de frecuencia, dejando pasar la señal o la corriente de interés. Aparece con frecuencia en fuentes de alimentación y en entradas de equipos sensibles al ruido conducido.",
  },
  {
    pergunta: "¿Cuál es la diferencia entre un inductor de modo común y uno de modo diferencial?",
    resposta:
      "El inductor de modo común filtra ruido que afecta a los dos conductores del circuito de manera semejante, lo típico de la interferencia de alta frecuencia. El de modo diferencial actúa sobre señales que presentan diferencia entre ambos conductores, con corrientes fluyendo en direcciones opuestas. Son problemas distintos, y el modo de filtrado debe definirse junto con la inductancia.",
  },
  {
    pergunta: "¿Cuál es la diferencia entre un inductor de filtrado y un reactor de limitación de corriente?",
    resposta:
      "El inductor de filtrado actúa sobre un rango de frecuencia específico para atenuar armónicos. El reactor de limitación actúa sobre la amplitud de la corriente en el arranque de motor o en falla, protegiendo el resto del sistema hasta que la protección actúe.",
  },
  {
    pergunta: "¿Por qué se usa el formato toroidal en inductores?",
    resposta:
      "El formato toroidal concentra el campo magnético en el núcleo, lo que reduce la pérdida de energía, minimiza el campo externo y con él la interferencia electromagnética, y mantiene el comportamiento estable en distintas condiciones de operación. Aun así, cada construcción atiende necesidades diferentes, y la elección depende de la restricción del proyecto.",
  },
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/es") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Inductores y Reactores",
        item: absoluteUrl("/es/indutores-filtros-e-chokes"),
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
        <Prose
          id="o-que-e"
          titulo="Qué hace un inductor en el circuito"
          arte={
            <PillarFoto
              src="/images/produtos/indutores-familia.webp"
              alt="Conjunto de inductores Toroid: un filtro montado en base con varios núcleos toroidales bobinados y, al lado, dos inductores más pequeños montados en placa de circuito impreso"
              legenda="El mismo principio en escalas diferentes: filtro de potencia montado en base, e inductores de placa al lado."
              largura={1200}
              altura={750}
            />
          }
        >
          <p>
            El inductor es un componente pasivo que almacena energía en forma de campo magnético. Constructivamente es
            un hilo conductor enrollado alrededor de un núcleo, y la magnitud que lo describe es la inductancia, medida
            en henry (H): cuanto mayor la inductancia, mayor la oposición que el componente ofrece a la variación de la
            corriente eléctrica.
          </p>
          <p>
            El principio es el mismo de la ley de Faraday. Cuando la corriente circula por el inductor, crea un campo
            magnético alrededor del hilo. Si esa corriente aumenta o disminuye, la variación del campo induce una
            fuerza electromotriz que, por la ley de Lenz, se opone justamente al cambio que la originó. De ahí viene la
            función práctica del componente: amortiguar los picos de corriente.
          </p>
        </Prose>

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
        <Prose
          id="onde-se-aplica"
          titulo="Dónde aparece el inductor en el proyecto"
          arte={
            <PillarFoto
              src="/images/produtos/indutor-em-placa.webp"
              alt="Inductor Toroid montado en placa de circuito impreso, con bobinado en hilo de sección rectangular sobre núcleo azul y sello RoHS visible"
              legenda="Inductor de placa con sello RoHS, del tipo que se especifica para fuente de alimentación y filtro de línea."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            El mismo principio atiende funciones bastante diferentes dentro de un proyecto electrónico, y por eso la
            especificación empieza por la función y no por el componente:
          </p>
          <ul>
            <li>
              <strong>Fuentes de alimentación.</strong> El inductor ayuda al resto del circuito a controlar y
              transformar la tensión de forma eficiente.
            </li>
            <li>
              <strong>Filtros de alimentación y de señal.</strong> Elimina frecuencias no deseadas y suaviza las
              tensiones que llegan al equipo.
            </li>
            <li>
              <strong>Convertidores de energía y fuentes DC-DC.</strong> Participa directamente de la conversión y del
              control de energía.
            </li>
            <li>
              <strong>Choke de filtro.</strong> Bloquea interferencia electromagnética y ruido conducido, que es la
              función detrás del nombre de esta página.
            </li>
            <li>
              <strong>Circuitos de resonancia y de RF.</strong> Sostiene sistemas de radio y comunicación y el control
              de señales de alta frecuencia.
            </li>
            <li>
              <strong>Electrónica de consumo.</strong> Televisores, computadoras y cargadores de batería, donde el
              componente suele especificarse por volumen.
            </li>
          </ul>
        </Prose>

        <Prose
          id="filtragem"
          titulo="Filtrado de armónicos: el inductor depende de la frecuencia que necesita atenuar"
          arte={
            <PillarFoto
              src="/images/produtos/indutor-pequeno.webp"
              alt="Inductor toroidal Toroid de pequeño porte, con bobinado en cobre esmaltado y terminales aislados, montado sobre base blanca con pines para placa"
              legenda="El tamaño del componente sale del rango de frecuencia y del nivel de corriente, no del valor nominal de inductancia."
              largura={1000}
              altura={750}
            />
          }
        >
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

        <Prose
          id="modo-comum-e-diferencial"
          titulo="Modo común y modo diferencial: dos modos de filtrado"
          arte={
            <PillarFoto
              src="/images/produtos/indutor-modo-comum.webp"
              alt="Inductor de modo común Toroid montado en placa de circuito impreso, con núcleo toroidal amarillo bobinado en cobre junto a un segundo bobinado sobre núcleo rectangular"
              legenda="Inductor de modo común montado en placa: los dos conductores pasan por el mismo núcleo, y eso es lo que cancela la interferencia."
              largura={1000}
              altura={749}
            />
          }
        >
          <p>
            Definido el rango de frecuencia, falta definir el modo de operación. Son dos problemas distintos, y el
            componente que resuelve uno no resuelve el otro.
          </p>
          <p>
            El <strong>inductor en modo común</strong> filtra interferencia que afecta a los dos conductores del
            circuito de manera semejante. Es eficaz contra señales no deseadas de alta frecuencia, aquellas que
            perjudican a los equipos electrónicos sensibles, y por eso aparece en fuentes de alimentación, circuitos de
            comunicación y dispositivos de control de ruido. Permite el paso de la corriente útil mientras bloquea la
            interferencia.
          </p>
          <p>
            El <strong>inductor en modo diferencial</strong> actúa sobre señales que presentan diferencia entre los dos
            conductores, con corrientes fluyendo en direcciones opuestas. Es lo que se usa cuando la separación de
            señales debe preservarse, como en comunicación digital y en sistemas de audio: atenúa el ruido y la
            distorsión de la señal diferencial, dejando pasar solo lo que interesa.
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
        <Prose
          id="nucleo"
          titulo="Elección del núcleo: cada construcción atiende necesidades diferentes"
          arte={
            <PillarFoto
              src="/images/produtos/indutor-filtro-montado.webp"
              alt="Filtro de línea Toroid montado en base negra, con tres núcleos toroidales bobinados en cobre y cables de salida identificados por color"
              legenda="Núcleos toroidales en un filtro montado. El núcleo se fabrica internamente, con diámetro externo de 15 mm a 350 mm."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            El núcleo toroidal concentra el campo magnético y ocupa menos volumen para el mismo rango de trabajo, lo
            que ayuda cuando hay restricción de espacio o sensibilidad a interferencia electromagnética en el
            entorno. Otras construcciones siguen siendo adecuadas cuando el costo por unidad pesa más, o cuando el
            proyecto ya está validado en torno a ellas.
          </p>
          <p>
            En inductores, tres características del formato toroidal suelen pesar en la decisión: la geometría minimiza
            la pérdida de energía en el núcleo, minimiza el campo magnético externo y con él la interferencia
            electromagnética emitida, y mantiene el comportamiento estable en condiciones variadas de operación. Son
            características, no un veredicto.
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

        <PillarAviso id="cuidados" titulo="Cuidados de aplicación">
          <p>
            El inductor es un componente seguro, pero depende de ser aplicado dentro de lo que fue proyectado. Tres
            condiciones explican la mayor parte de las fallas que llegan a nuestra ingeniería:
          </p>
          <ul>
            <li>
              <strong>Sobrecarga de corriente.</strong> Operar por encima de la corriente nominal calienta el
              componente más de lo previsto y degrada el bobinado antes del fin del ciclo de vida del proyecto.
            </li>
            <li>
              <strong>Saturación del núcleo.</strong> Pasado el punto de saturación, la inductancia efectiva se
              desploma y el inductor deja de filtrar o de limitar como el proyecto preveía, aun estando físicamente
              intacto.
            </li>
            <li>
              <strong>Interferencia magnética excesiva.</strong> Un campo externo elevado, propio o del entorno,
              compromete el desempeño del inductor y de los componentes vecinos.
            </li>
          </ul>
          <p>
            Las tres son evitables en la especificación, y por eso el rango real de operación del circuito pesa más que
            el valor nominal de catálogo.
          </p>
        </PillarAviso>
      </PillarBody>

      <PillarChecklist
        id="como-especificar"
        eyebrow="Antes de la cotización"
        titulo="Cómo especificar un inductor o reactor"
        lead="Este conjunto de información es lo que separa una especificación a medida de un componente de catálogo elegido por el valor nominal. También es lo que evita el reproceso de una pieza que cumple la hoja de datos y no resuelve el problema del circuito."
        itens={CHECKLIST}
      />

      <PillarBody tone="tint">
        <Perguntas id="perguntas" titulo="Preguntas que aparecen en esta especificación" itens={PERGUNTAS} />
      </PillarBody>

      <PillarClosing id="fecho" titulo="Describe el circuito, no el componente">
        <p>
          Si todavía no tienes cerrada la inductancia objetivo, eso no impide la conversación. Describir el rango de
          corriente, la frecuencia y lo que necesita ser atenuado o limitado ya es suficiente para que nuestra
          ingeniería proponga un dimensionamiento y discuta alternativas.
        </p>
      </PillarClosing>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

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
  PillarSpecTable,
  Prose,
  Pullquote,
  type SecaoPilar,
} from "@/components/produtos/Pillar";

// Espelho em espanhol de app/transformador-de-corrente/page.tsx, ver
// CLAUDE.md/i18n e app/es/page.tsx. Os valores técnicos foram validados pela
// engenharia em 2026-09-01 (ver o comentário na página em pt), e qualquer
// correção lá precisa ser replicada aqui também.

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
  { id: "secundario-aberto", titulo: "Nunca dejes el secundario abierto" },
  { id: "tipos-de-tc", titulo: "Tipos constructivos de TC" },
  { id: "tc-compacto", titulo: "TC compacto para tablero" },
  { id: "tc-bipartido", titulo: "TC partido" },
  { id: "tc-resinado", titulo: "TC encapsulado en resina para ambiente agresivo" },
  { id: "tc-em-scada", titulo: "TC en sistemas SCADA" },
  { id: "religadores", titulo: "TC para reconectadores automáticos" },
  { id: "como-testamos", titulo: "Cómo probamos cada TC" },
  { id: "como-especificar", titulo: "Cómo especificar un TC" },
  { id: "especificacoes", titulo: "Tabla de especificaciones" },
  { id: "perguntas", titulo: "Preguntas frecuentes" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Diseñado conforme a la ABNT NBR6856" },
  { icon: Factory, texto: "Fabricación nacional a medida" },
];

const ESPECIFICACOES: [string, string][] = [
  ["Clase de exactitud", "desde 0,3%"],
  ["Corriente secundaria", "1 A o 5 A"],
  ["Clase de tensión", "hasta 1,5 kV"],
  ["Tensión de aislamiento", "hasta 4 kV"],
  ["Clase térmica", "A (105 °C); B (130 °C, a consultar)"],
  ["Diámetro interno", "5 mm a 350 mm"],
  ["Norma específica de TC", "ABNT NBR6856"],
  ["Robustez a cortocircuito", "conforme a la ABNT NBR5356-5"],
];

// La carga nominal del secundario (burden, en VA) no entra en la tabla porque
// depende del conjunto de instrumentos que el TC va a alimentar. Ver el
// comentario equivalente en la página en portugués.
const CHECKLIST = [
  "Aplicación: TC de medición, de protección, o ambas",
  "Corriente primaria y secundaria nominal, o la relación de transformación (la secundaria es típicamente 1 A o 5 A)",
  "Carga nominal del secundario en VA, el burden que el TC debe alimentar",
  "Clase de exactitud exigida por el proyecto o por la empresa distribuidora",
  "Tensión máxima del equipo y nivel de aislamiento",
  "Frecuencia nominal",
  "Corriente de cortocircuito prevista y factor térmico",
  "Diámetro interno mínimo y diámetro externo máximo, definidos por el conductor o barra y por el espacio en el tablero",
  "Cantidad de núcleos para medición y para protección",
  "Condición ambiental de instalación: interior, exterior o industrial agresiva",
  "Necesidad de instalación con núcleo partido, sin desenergizar el circuito",
  "Tipo de acabado",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "¿Qué diferencia hay entre un TC de medición y un TC de protección?",
    resposta:
      "Un TC de medición necesita mantener exactitud en condición normal de operación. Un TC de protección necesita comportamiento previsible en condición de falla, incluyendo corriente de cortocircuito muy por encima de la nominal, para que el relé actúe en el tiempo correcto. La ABNT NBR6856 clasifica ambos como categorías distintas.",
  },
  {
    pergunta: "¿Cómo se calcula la relación de transformación de un TC?",
    resposta:
      "Es la razón entre la corriente primaria nominal y la corriente secundaria nominal. En un TC 100/5 A la relación es 20, así que el valor leído en el secundario debe multiplicarse por 20 para representar la corriente que circula por el primario.",
  },
  {
    pergunta: "¿Qué es la clase de exactitud en un transformador de corriente?",
    resposta:
      "Es el error máximo admisible entre la corriente real del circuito y la corriente indicada por el TC, dentro del rango de operación especificado. La línea Toroid parte de 0,3%.",
  },
  {
    pergunta: "¿Qué es la saturación en un transformador de corriente?",
    resposta:
      "Es el límite por encima del cual el núcleo deja de acompañar la corriente primaria y el TC pierde sus características eléctricas originales. A partir de ahí el secundario ya no reproduce fielmente el primario, la exactitud declarada deja de valer y el instrumento debe ser sustituido.",
  },
  {
    pergunta: "¿Qué pasa si el secundario de un TC queda abierto?",
    resposta:
      "Sin carga conectada que consuma la energía inducida en el núcleo, la tensión en el secundario sube a valores peligrosos. Esto puede generar arco eléctrico interno, sobrecalentamiento y falla de aislamiento, además de riesgo de choque para quien opera el equipo. El secundario debe estar siempre conectado a una carga nominal apropiada.",
  },
  {
    pergunta: "¿Se puede instalar un TC partido sin desenergizar el circuito?",
    resposta:
      "Sí. El TC partido se abre alrededor del conductor ya energizado, lo que elimina la necesidad de desconexión para instalación o mantenimiento. A cambio, los dos cortes en el núcleo reducen la exactitud frente a un TC tipo ventana, de núcleo continuo.",
  },
  {
    pergunta: "¿Qué norma rige el transformador de corriente en Brasil?",
    resposta:
      "La ABNT NBR6856 es la norma específica de transformadores de corriente. La ABNT NBR5356-5 trata la capacidad de resistencia a cortocircuito, relevante para TC de protección.",
  },
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/es") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores de Corriente",
        item: absoluteUrl("/es/transformador-de-corrente"),
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
        <Prose
          id="o-que-resolve"
          titulo="Qué resuelve un transformador de corriente en tu circuito"
          arte={
            <PillarFoto
              src="/images/produtos/tc-toroidal-janela.webp"
              alt="Transformador de corriente tipo ventana, con núcleo toroidal bobinado en cobre y dos cables de salida en el secundario"
              legenda="TC tipo ventana: el conductor del circuito pasa por el núcleo toroidal, que no tiene corte."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Un transformador de corriente reduce una corriente elevada, difícil y peligrosa de medir directamente, a
            una señal secundaria proporcional que los instrumentos de medición, protección y automatización pueden
            interpretar con seguridad. El aislamiento galvánico entre el circuito de potencia y el circuito de
            control no es un detalle constructivo: es la capa de seguridad que protege al operador y a la
            instrumentación aguas abajo.
          </p>
          <p>
            El principio es la inducción electromagnética descrita por la ley de Faraday: la corriente que circula por
            el primario crea en el núcleo ferromagnético un campo proporcional a ella, y ese campo induce en el
            secundario una corriente definida por la relación de transformación. En un TC 100/5 A la relación es 20, es
            decir, el valor leído en el secundario debe multiplicarse por 20 para representar la corriente real del
            circuito.
          </p>
          <p>
            La duda que llega a nuestra ingeniería casi nunca es qué TC comprar. Es qué TC resuelve el problema real:
            ruido que satura la señal, calentamiento por encima de lo proyectado, o un tablero diseñado sin espacio
            de sobra para el transformador.
          </p>
        </Prose>

        <Prose
          id="medicao-ou-protecao"
          titulo="TC de medición o TC de protección: la aplicación lo decide todo"
          arte={
            <PillarFoto
              src="/images/produtos/tc-linha-completa.webp"
              alt="Cuatro transformadores de corriente Toroid uno al lado del otro: uno con cables de salida, uno de núcleo encapsulado, uno con carcasa plástica y uno toroidal abierto"
              legenda="Medición y protección salen de la misma línea. Lo que cambia entre un TC y otro es la especificación, no el catálogo."
              largura={1200}
              altura={750}
            />
          }
        >
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
            La diferencia aparece también en el tiempo de respuesta. El TC de protección necesita actuación
            prácticamente instantánea, porque alimenta un relé que decide abrir el circuito en condición de falla. El
            TC de medición trabaja en el otro extremo: prioriza lectura precisa y estable para monitoreo y análisis del
            sistema eléctrico, en régimen normal.
          </p>
          <p>
            La ABNT NBR6856 es la norma que rige los transformadores de corriente en Brasil y clasifica el TC
            exactamente en esas dos categorías, medición y protección. Es la referencia usada en toda la línea de TC de
            Toroid, desde la clase de exactitud hasta el comportamiento en sobrecorriente.
          </p>
        </Prose>

        <Prose
          id="classe-de-exatidao"
          titulo="Clase de exactitud: el número que decide si tu medición es confiable"
          arte={
            <PillarFoto
              src="/images/produtos/tc-etiqueta-classe.webp"
              alt="Transformador de corriente Toroid con aislamiento naranja y etiqueta de identificación con relación 300/0,2 A, clase 1,2C12,5, 50/60 Hz y número de lote"
              legenda="Relación, clase de exactitud, carga nominal y lote salen impresos en la pieza. Es el dato que la ingeniería verifica al recibirla."
              largura={1000}
              altura={750}
            />
          }
        >
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
            La saturación es el límite por encima del cual el instrumento deja de sostener sus características
            eléctricas originales. Pasado ese punto, la corriente del secundario ya no reproduce fielmente la corriente
            del primario, la exactitud declarada en el proyecto deja de valer y el TC debe ser sustituido. No es una
            desviación que se corrija en la calibración.
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

        <PillarAviso id="secundario-aberto" titulo="Nunca dejes el secundario del TC abierto">
          <p>
            Con el TC ya instalado, el secundario nunca debe quedar abierto. Sin carga conectada que consuma la energía
            inducida por el flujo magnético en el núcleo, la tensión en el secundario sube muy por encima de lo
            previsto, y tres cosas pasan a ser posibles al mismo tiempo:
          </p>
          <ul>
            <li>
              <strong>Tensión elevada.</strong> La tensión inducida sin carga puede generar arco eléctrico interno,
              sobrecalentamiento y falla de aislamiento, comprometiendo el transformador y generando costo de
              reparación o de sustitución.
            </li>
            <li>
              <strong>Pérdida de precisión en la medición.</strong> Con el secundario abierto, la corriente
              proporcional ya no puede medirse ni monitorearse correctamente, lo que propaga el error a los sistemas de
              protección y control que dependen de esa lectura.
            </li>
            <li>
              <strong>Riesgo para la seguridad personal.</strong> Tensión elevada y falla estructural en el
              transformador exponen a quien opera y a quien hace mantenimiento a choque eléctrico grave.
            </li>
          </ul>
          <p>
            La regla práctica es simple: el secundario de un transformador de corriente queda siempre conectado a una
            carga nominal apropiada. Es lo que preserva el equipo, la exactitud de la medición y la seguridad de quien
            trabaja en el tablero.
          </p>
        </PillarAviso>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose
          id="tipos-de-tc"
          titulo="Tipos constructivos de transformador de corriente"
          arte={
            <PillarFoto
              src="/images/produtos/tc-com-involucro.webp"
              alt="Transformador de corriente con carcasa plástica negra, ventana central para el paso del conductor y bornes secundarios en la parte superior"
              legenda="Construcción tipo ventana con carcasa, con los bornes del secundario protegidos para montaje en tablero."
              largura={1000}
              altura={750}
            />
          }
        >
          <p>
            Antes de hablar de rango y de exactitud, conviene separar las construcciones. El tipo constructivo define
            cómo se inserta el TC en el circuito y, por consecuencia, cuánta precisión logra entregar y cuánta
            intervención exige la instalación.
          </p>
          <ul>
            <li>
              <strong>Ventana.</strong> Núcleo toroidal atravesado por el propio conductor del circuito. Como el núcleo
              no tiene ningún corte, es la construcción de menor error de medición. En contrapartida, la instalación
              exige intervención en el sistema para pasar el conductor por la ventana.
            </li>
            <li>
              <strong>Partido.</strong> Núcleo dividido en dos partes que se cierran alrededor del conductor, lo que
              hace la instalación y el mantenimiento bastante menos invasivos. Los dos cortes en el núcleo cuestan
              precisión frente al tipo ventana.
            </li>
            <li>
              <strong>Barra.</strong> El primario es una barra conductora, de material de alta conductividad y baja
              resistividad para minimizar pérdidas, y el secundario genera la señal proporcional a la corriente que
              pasa por ella. Construcción usada en medición de corrientes elevadas.
            </li>
            <li>
              <strong>Bushing.</strong> Encapsulado en resina o en aislante robusto, aplicado en equipos de alta
              tensión como interruptores y transformadores de fuerza, donde el propio aislador debe soportar el nivel
              de tensión del sistema.
            </li>
            <li>
              <strong>Devanado.</strong> Primario y secundario bobinados, conectados en serie con el circuito a medir.
              Exige abrir el circuito para la inserción, así que es la construcción más invasiva, y por eso suele
              aplicarse en corrientes menores.
            </li>
          </ul>
          <p>
            La línea Toroid está construida en torno a las construcciones de ventana y partida, con o sin encapsulado
            en resina, dentro de la clase de tensión de hasta 1,5 kV. Las demás entran aquí como referencia de
            especificación. Si tu proyecto pide otra construcción, describe la aplicación para que la ingeniería la
            evalúe.
          </p>
        </Prose>

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

        <Prose
          id="tc-bipartido"
          titulo="TC partido: cuándo instalar sin desenergizar el circuito"
          arte={
            <PillarFoto
              src="/images/produtos/tc-resinado-bipartido.webp"
              alt="Dos transformadores de corriente encapsulados en resina epoxi negra: a la izquierda uno tipo ventana de núcleo continuo, a la derecha uno partido con tornillos mariposa que abren el núcleo"
              legenda="A la izquierda, el tipo ventana de núcleo continuo. A la derecha, el partido, que se abre alrededor del conductor ya energizado."
              largura={1000}
              altura={750}
            />
          }
        >
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
          <p>
            La contrapartida está en los tipos constructivos de arriba: los dos cortes en el núcleo cuestan exactitud
            frente al tipo ventana. Cuando la aplicación exige el menor error de medición posible, es esa variable la
            que decide entre las dos construcciones.
          </p>
        </Prose>

        <Prose
          id="tc-resinado"
          titulo="TC encapsulado en resina: protección extra en ambiente agresivo"
          arte={
            <PillarFoto
              src="/images/produtos/tc-bipartido-resinado.webp"
              alt="Transformador de corriente partido encapsulado en resina epoxi negra, con tornillos de fijación que cierran el núcleo alrededor del conductor y dos cables de salida"
              legenda="Encapsulado en resina epoxi: la misma pieza gana protección mecánica y aislamiento contra humedad y polvo conductivo."
              largura={1000}
              altura={750}
            />
          }
        >
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
        <Prose
          id="tc-em-scada"
          titulo="TC en SCADA: dato de campo en el que la automatización puede confiar"
          arte={
            <PillarFoto
              src="/images/produtos/tc-montado-em-placa.webp"
              alt="Conjunto de tres transformadores de corriente toroidales fijados en una placa de fenolita, conectados a una regleta de bornes numerada"
              legenda="Conjunto de tres TC montado en placa, con regleta de bornes identificada, listo para entrar en el tablero."
              largura={1000}
              altura={750}
            />
          }
        >
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

      <PillarBody>
        <Perguntas id="perguntas" titulo="Preguntas que aparecen en esta especificación" itens={PERGUNTAS} />
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

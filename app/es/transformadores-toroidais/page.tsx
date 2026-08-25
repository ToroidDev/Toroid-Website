import type { Metadata } from "next";
import { Factory, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";
import { PillarBody, PillarClosing, PillarHero, PillarIndex, Prose, type SecaoPilar } from "@/components/produtos/Pillar";

// Espelho em espanhol de app/transformadores-toroidais/page.tsx — ver
// CLAUDE.md/i18n e app/es/page.tsx. Mesma ressalva de conteúdo/tom da página
// em português: não compara com núcleo convencional E/I nem sugere que o
// toroidal seja superior. O link pra Indutores & Reatores aponta pra URL em
// português — essa família ainda não tem espelho em /es.

export const metadata: Metadata = {
  title: "Transformador Toroidal: Cómo Funciona y Dónde Aplicar | Toroid do Brasil",
  description:
    "Entiende cómo funciona el núcleo toroidal, cómo lo fabrica Toroid, y en qué aplicaciones esta tecnología marca más diferencia.",
  alternates: {
    canonical: absoluteUrl("/es/transformadores-toroidais"),
    languages: {
      "pt-BR": absoluteUrl("/transformadores-toroidais"),
      es: absoluteUrl("/es/transformadores-toroidais"),
      "x-default": absoluteUrl("/transformadores-toroidais"),
    },
  },
};

const SECOES: SecaoPilar[] = [
  { id: "o-que-muda", titulo: "Qué cambia con un núcleo toroidal" },
  { id: "como-fabricamos", titulo: "Cómo fabricamos el núcleo toroidal" },
  { id: "iluminacao", titulo: "Iluminación arquitectónica" },
  { id: "audio", titulo: "Audio profesional" },
];

const FATOS = [
  { icon: MapPin, texto: "São José dos Pinhais · PR" },
  { icon: ShieldCheck, texto: "Tipo seco conforme a la ABNT NBR5356-11" },
  { icon: Factory, texto: "Núcleo compacto y de bajo ruido audible" },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://toroid.com.br/es" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores Toroidales",
        item: "https://toroid.com.br/es/transformadores-toroidais",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cómo funciona un núcleo toroidal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El núcleo toroidal tiene forma de anillo, con el primario y el secundario bobinados sobre él. Esa geometría distribuye el campo magnético de forma más uniforme, lo que reduce la irradiación fuera del equipo y disminuye las pérdidas en vacío.",
        },
      },
      {
        "@type": "Question",
        name: "¿En qué aplicaciones el núcleo toroidal marca más diferencia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En aplicaciones sensibles al ruido audible o a la interferencia electromagnética, como audio profesional e iluminación arquitectónica, y en proyectos con restricción real de espacio o peso. En esos casos, la reducción de tamaño, peso y ruido de la construcción toroidal suele justificar el cambio.",
        },
      },
    ],
  },
];

export default function TransformadoresToroidaisPageEs() {
  return (
    <>
      <PillarHero
        icone="toroidal"
        nomeCategoria="Transformadores Toroidales"
        eyebrow="Aislamiento galvánico y baja irradiación"
        titulo={
          <>
            Núcleo toroidal: cómo funciona, cómo lo fabricamos{" "}
            <span style={{ color: "var(--color-green-light)" }}>y dónde esta tecnología marca más diferencia</span>
          </>
        }
        lead="Espacio en el gabinete, peso del equipo final, ruido audible o eficiencia energética: entiende cómo la geometría del núcleo toroidal responde a cada una de estas restricciones, y en qué aplicaciones suele marcar más diferencia."
        fatos={FATOS}
      />

      <PillarIndex secoes={SECOES} />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo="Qué cambia en la ingeniería con un núcleo toroidal">
          <p>
            Un transformador toroidal bobina el primario y el secundario sobre un núcleo en forma de anillo, en lugar
            de la construcción E/I tradicional con núcleo laminado apilado. Esa geometría distribuye el campo
            magnético de forma más uniforme alrededor del núcleo, lo que reduce la irradiación fuera del equipo y
            disminuye las pérdidas en vacío.
          </p>
          <p>
            Para quien especifica, esto aparece como tres características medibles: menos ruido audible en
            operación, menos calor disipado para el mismo nivel de potencia, y menor volumen físico para el mismo
            rango de trabajo.
          </p>
        </Prose>

        <Prose id="como-fabricamos" titulo="Cómo fabricamos el núcleo toroidal">
          <p>
            El núcleo toroidal de Toroid se fabrica internamente, con diámetro externo de 15 mm a 350 mm, lo que
            permite cubrir desde componentes pequeños hasta núcleos de mayor porte sin depender de un proveedor
            externo para esa etapa.
          </p>
          <p>
            Después de bobinado, el núcleo pasa por tratamiento térmico en atmósfera de nitrógeno, con rampa de
            calentamiento de hasta 820 °C. El proceso expulsa el oxígeno, fija la geometría del núcleo y restablece
            las propiedades eléctricas y magnéticas del acero, alteradas por el propio proceso de corte y bobinado.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="iluminacao" titulo="Transformador toroidal para iluminación arquitectónica">
          <p>
            Un proyecto de iluminación arquitectónica, en museo, fachada o ambiente de exposición, suele exigir el
            transformador más discreto posible: sin ruido audible perceptible a pocos metros y sin calentamiento que
            obligue a ventilación adicional en el gabinete. El funcionamiento silencioso y la reducción de tamaño de
            la construcción toroidal atienden esa restricción sin comprometer la regulación de tensión de la
            luminaria alimentada.
          </p>
        </Prose>

        <Prose id="audio" titulo="Transformador toroidal para audio profesional">
          <p>
            En equipos de audio profesional, el transformador de alimentación es una fuente conocida de ruido
            inducido cuando está mal aislado. La baja irradiación de campo magnético del núcleo toroidal reduce el
            acoplamiento indeseado con etapas de señal sensibles. Es por comportamiento electromagnético medible, no
            por preferencia de mercado, que buena parte de los fabricantes de amplificadores de referencia parte del
            toroidal como estándar de diseño.
          </p>
        </Prose>
      </PillarBody>

      <PillarClosing id="fecho" titulo="Núcleo toroidal, disponible en las tres líneas Toroid">
        <p>
          El núcleo toroidal no es una línea aislada: puede aplicarse en{" "}
          <Link href="/es/transformador-de-corrente">Transformadores de Corriente</Link>,{" "}
          <Link href="/es/transformador-de-potencia">Transformadores de Potencia</Link> e{" "}
          <Link href="/es/indutores-filtros-e-chokes">Inductores y Reactores</Link>, según la restricción de tu
          proyecto.
          Si después de leer esto ya sabes qué línea necesitas, las especificaciones completas están en cada una de
          esas páginas.
        </p>
      </PillarClosing>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

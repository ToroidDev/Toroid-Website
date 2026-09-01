import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Gauge, Layers, MessageCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import type { ProdutoIcone } from "@/lib/produtos";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { getAnosDeMercado } from "@/lib/institucional";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import { T } from "@/components/i18n/T";
import { PillarEmblem } from "./PillarEmblem";
import styles from "./Pillar.module.css";

export interface SecaoPilar {
  id: string;
  titulo: string;
}

/* ══════════ Hero invertido ══════════ */

export function PillarHero({
  icone,
  nomeCategoria,
  eyebrow,
  titulo,
  lead,
  fatos,
  arte,
}: {
  icone: ProdutoIcone;
  nomeCategoria: string;
  eyebrow: string;
  titulo: ReactNode;
  lead: ReactNode;
  fatos: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; texto: string }[];
  /** Substitui o PillarEmblem padrão por uma arte própria (ex.: HeroToroid,
   *  o render 3D girando usado antes na home). Sem ela, cai no emblema
   *  estático de sempre — é o caso das 3 páginas de família. */
  arte?: ReactNode;
}) {
  return (
    <section className={styles.hero}>
      <InstitutionalPattern spiral opacity={0.05} stroke="#9FC2EA" className={styles.heroPattern} />
      <div className={styles.heroGrain} aria-hidden="true" />

      <div className={styles.heroInner}>
        <div>
          <ol className={styles.breadcrumb}>
            <li>
              <Link href="/">
                <T pt="Início" es="Inicio" en="Home" />
              </Link>
              <span className={styles.breadcrumbSep} aria-hidden="true">
                /
              </span>
            </li>
            <li>
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {nomeCategoria}
              </span>
            </li>
          </ol>

          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 className={styles.heroTitle}>{titulo}</h1>
          <p className={styles.heroLead}>{lead}</p>

          <div className={styles.heroActions}>
            <a href="#orcamento" className={styles.onDarkPrimary}>
              <T pt="Solicitar Orçamento Técnico" es="Solicitar Presupuesto Técnico" en="Request a Technical Quote" />
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            <WhatsAppLink className={styles.onDarkSecondary}>
              <T pt="Falar com nosso time" es="Hablar con nuestro equipo" en="Talk to our team" />
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            </WhatsAppLink>
          </div>
        </div>

        <div className={arte ? `${styles.heroArt} ${styles.heroArtCustom}` : styles.heroArt}>
          {arte ?? <PillarEmblem icone={icone} />}
        </div>
      </div>

      <ul className={styles.heroFatos}>
        {fatos.map(({ icon: Icon, texto }) => (
          <li key={texto} className={styles.heroFato}>
            <Icon size={17} strokeWidth={1.8} className={styles.heroFatoIcon} />
            {texto}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ══════════ Faixa de prova institucional ══════════ */

// const BADGES = ["ISO 9001", "RoHS Compliant", "Garantia de 3 anos"];

// export function PillarProof({ projetos = "+18.000" }: { projetos?: string }) {
//   const stats = [
//     { valor: String(getAnosDeMercado()), rotulo: "anos de mercado" },
//     { valor: projetos, rotulo: "projetos entregues" },
//     { valor: "+3.000", rotulo: "clientes" },
//   ];

//   return (
//     <section className={styles.proof} aria-label="Prova institucional">
//       <div className={styles.proofInner}>
//         <div className={styles.proofStats}>
//           {stats.map((stat) => (
//             <div key={stat.rotulo} className={styles.proofStat}>
//               <span className={styles.proofValue}>{stat.valor}</span>
//               <span className={styles.proofLabel}>{stat.rotulo}</span>
//             </div>
//           ))}
//         </div>

//         <div className={styles.proofBadges}>
//           {BADGES.map((badge) => (
//             <span key={badge} className={styles.proofBadge}>
//               <BadgeCheck size={15} strokeWidth={1.9} aria-hidden="true" />
//               {badge}
//             </span>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

/* ══════════ Índice da página ══════════ */

export function PillarIndex({ secoes }: { secoes: SecaoPilar[] }) {
  return (
    <nav className={styles.index} aria-label="Índice desta página">
      <div className={styles.indexInner}>
        <div className={styles.indexCard}>
          <p className={styles.indexTitle}>
            <T pt="Nesta página" es="En esta página" en="On this page" />
          </p>
          <ul className={styles.indexList}>
            {secoes.map((secao) => (
              <li key={secao.id}>
                <a href={`#${secao.id}`} className={styles.indexLink}>
                  <span className={styles.indexMarker} aria-hidden="true" />
                  {secao.titulo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/* ══════════ Corpo em prosa ══════════ */

export function PillarBody({
  tone = "light",
  pattern = false,
  children,
}: {
  tone?: "light" | "tint";
  pattern?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={tone === "tint" ? `${styles.body} ${styles.bodyTint}` : styles.body}>
      {pattern ? <InstitutionalPattern opacity={0.05} className={styles.bodyPattern} /> : null}
      <div className={styles.bodyInner}>{children}</div>
    </section>
  );
}

export function Prose({
  id,
  titulo,
  arte,
  children,
}: {
  id: string;
  titulo: string;
  /** Arte lateral opcional (ex.: animação SVG). Sem ela, o bloco segue coluna
   *  única de sempre — só as páginas que passam essa prop ganham a grade de
   *  duas colunas. */
  arte?: ReactNode;
  children: ReactNode;
}) {
  if (!arte) {
    return (
      <div className={styles.prose}>
        <h2 id={id} className={styles.proseHeading}>
          {titulo}
        </h2>
        {children}
      </div>
    );
  }

  return (
    <div className={styles.proseComArte}>
      <div className={styles.prose}>
        <h2 id={id} className={styles.proseHeading}>
          {titulo}
        </h2>
        {children}
      </div>
      <div className={styles.proseArte}>{arte}</div>
    </div>
  );
}

/* ══════════ Foto de produto na coluna lateral ══════════ */

/**
 * Foto real de produto para a prop `arte` do Prose. Existe porque o corpo das
 * páginas de família é coluna única de texto: a foto ocupa a lateral vazia e
 * mostra a peça de que o parágrafo está falando.
 *
 * Sempre `next/image` com width/height reais (o CLS vem de imagem sem
 * proporção declarada, não do peso do arquivo). Nunca `priority`: o hero é o
 * LCP dessas páginas, e essas fotos ficam todas abaixo da dobra.
 */
export function PillarFoto({
  src,
  alt,
  legenda,
  largura,
  altura,
}: {
  src: string;
  alt: string;
  /** Linha curta abaixo da foto. Serve para nomear a peça, não para repetir o parágrafo ao lado. */
  legenda?: string;
  largura: number;
  altura: number;
}) {
  return (
    <figure className={styles.foto}>
      <Image
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        sizes="(min-width: 1080px) 480px, (min-width: 640px) 460px, 92vw"
        className={styles.fotoImg}
      />
      {legenda ? <figcaption className={styles.fotoLegenda}>{legenda}</figcaption> : null}
    </figure>
  );
}

export function Pullquote({ children, fonte }: { children: ReactNode; fonte: string }) {
  return (
    <blockquote className={styles.pullquote}>
      <p>{children}</p>
      <cite className={styles.pullquoteSource}>{fonte}</cite>
    </blockquote>
  );
}

/* ══════════ Aviso técnico ══════════ */

/**
 * Regra de segurança operacional dentro do corpo da página (ex.: nunca deixar
 * o secundário de um TC aberto). Existe como bloco próprio, e não como mais um
 * parágrafo, porque é a única informação da página em que errar tem
 * consequência física. O h2 leva `id` para poder entrar no PillarIndex como
 * qualquer outra seção.
 */
export function PillarAviso({
  id,
  titulo,
  children,
}: {
  id: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.aviso}>
      <div className={styles.avisoTopo}>
        <TriangleAlert size={22} strokeWidth={2} aria-hidden="true" className={styles.avisoIcon} />
        <h2 id={id} className={styles.avisoHeading}>
          {titulo}
        </h2>
      </div>
      <div className={styles.prose}>{children}</div>
    </div>
  );
}

/* ══════════ Tabela de especificação ══════════ */

export function PillarSpecTable({
  id,
  titulo,
  nota,
  linhas,
}: {
  id: string;
  titulo: string;
  nota?: string;
  linhas: [rotulo: string, valor: string][];
}) {
  return (
    <div className={styles.specWrap}>
      <h2 id={id} className={styles.specHeading}>
        {titulo}
      </h2>
      {/* Os papéis ARIA vão explícitos porque o CSS troca o `display` da tabela
          nos dois extremos: bloco no mobile e duas colunas de pares acima de
          900px. Sem eles o navegador descarta a semântica de tabela junto com o
          display nativo, e o leitor de tela perde a relação rótulo/valor. */}
      <table className={styles.specTable} role="table">
        <tbody role="rowgroup">
          {linhas.map(([rotulo, valor]) => (
            <tr key={rotulo} role="row">
              <th scope="row" role="rowheader">
                {rotulo}
              </th>
              <td role="cell">{valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {nota ? <p className={styles.specNote}>{nota}</p> : null}
    </div>
  );
}

/* ══════════ Faixa azul de checklist ══════════ */

export function PillarChecklist({
  id,
  eyebrow,
  titulo,
  lead,
  itens,
}: {
  id: string;
  eyebrow: string;
  titulo: string;
  lead: string;
  itens: string[];
}) {
  return (
    <section className={styles.checklist}>
      <InstitutionalPattern spiral opacity={0.05} stroke="#9FC2EA" className={styles.checklistPattern} />
      <div className={styles.checklistInner}>
        <div>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id={id} className={styles.checklistHeading}>
            {titulo}
          </h2>
          <p className={styles.checklistLead}>{lead}</p>
        </div>

        <ul className={styles.checklistItems}>
          {itens.map((item) => (
            <li key={item} className={styles.checklistItem}>
              <Check size={19} strokeWidth={2.4} aria-hidden="true" className={styles.checklistIcon} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ══════════ Objeções ══════════ */

// Texto idêntico nas três páginas de família de produto, por decisão comercial.
// Fica centralizado aqui para não divergir entre elas com o tempo.
const OBJECOES = [
  {
    icon: Gauge,
    pergunta: "“O preço de vocês é mais alto.”",
    resposta:
      "O investimento inicial pode ser maior. Em contrapartida, normalmente reduzimos perdas energéticas, retrabalho e falhas de campo, o que baixa o custo total de propriedade ao longo do ciclo de vida do equipamento.",
  },
  {
    icon: ShieldCheck,
    pergunta: "“Já temos fornecedor.”",
    resposta:
      "Não buscamos substituir imediatamente. A proposta é apresentar uma alternativa técnica para homologação, para que a decisão, quando vier, seja comparação e não aposta.",
  },
  {
    icon: Layers,
    pergunta: "“Não temos demanda suficiente.”",
    resposta:
      "Podemos avaliar lotes menores ou um projeto piloto antes de escalar. Especificação correta primeiro, volume depois.",
  },
];

// export function PillarObjections({ id }: { id: string }) {
//   return (
//     <section className={styles.objections}>
//       <div className={styles.objectionsInner}>
//         <h2 id={id} className={styles.objectionsHeading}>
//           As três objeções que mais aparecem antes do orçamento
//         </h2>

//         <div className={styles.objectionsGrid}>
//           {OBJECOES.map(({ icon: Icon, pergunta, resposta }) => (
//             <div key={pergunta} className={styles.objection}>
//               <span className={styles.objectionIcon}>
//                 <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
//               </span>
//               <p className={styles.objectionQuestion}>{pergunta}</p>
//               <p className={styles.objectionAnswer}>{resposta}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

/* ══════════ Fecho antes do CTA ══════════ */

export function PillarClosing({
  id,
  titulo,
  tone = "light",
  children,
}: {
  id: string;
  titulo: string;
  /** "dark" reaproveita o mesmo fundo em gradiente azul + padrão espiral do
   *  PillarChecklist, pra fechos que precisam de mais peso visual (ex.: a
   *  página que amarra as 3 famílias de volta). Default "light" mantém o
   *  fundo branco de sempre nas páginas de família. */
  tone?: "light" | "dark";
  children: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section className={dark ? `${styles.closing} ${styles.closingDark}` : styles.closing}>
      {dark ? <InstitutionalPattern spiral opacity={0.05} stroke="#9FC2EA" className={styles.closingPattern} /> : null}
      <div className={styles.closingInner}>
        <div className={styles.prose}>
          <h2 id={id} className={styles.proseHeading}>
            {titulo}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}

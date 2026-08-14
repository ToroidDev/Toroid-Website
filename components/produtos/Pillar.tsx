import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Gauge, Layers, MessageCircle, ShieldCheck } from "lucide-react";
import type { ProdutoIcone } from "@/lib/produtos";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { getAnosDeMercado } from "@/lib/institucional";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
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
}: {
  icone: ProdutoIcone;
  nomeCategoria: string;
  eyebrow: string;
  titulo: ReactNode;
  lead: ReactNode;
  fatos: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; texto: string }[];
}) {
  return (
    <section className={styles.hero}>
      <InstitutionalPattern spiral opacity={0.05} stroke="#9FC2EA" className={styles.heroPattern} />
      <div className={styles.heroGrain} aria-hidden="true" />

      <div className={styles.heroInner}>
        <div>
          <ol className={styles.breadcrumb}>
            <li>
              <Link href="/">Início</Link>
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
              Solicitar Orçamento Técnico
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            <WhatsAppLink className={styles.onDarkSecondary}>
              Falar com nosso time
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            </WhatsAppLink>
          </div>
        </div>

        <div className={styles.heroArt}>
          <PillarEmblem icone={icone} />
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
          <p className={styles.indexTitle}>Nesta página</p>
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

export function Prose({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <div className={styles.prose}>
      <h2 id={id} className={styles.proseHeading}>
        {titulo}
      </h2>
      {children}
    </div>
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
      <table className={styles.specTable}>
        <tbody>
          {linhas.map(([rotulo, valor]) => (
            <tr key={rotulo}>
              <th scope="row">{rotulo}</th>
              <td>{valor}</td>
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

export function PillarClosing({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section className={styles.closing}>
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

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { PillarBody, PillarChecklist, Prose } from "@/components/produtos/Pillar";
import { AplicacaoHero } from "@/components/aplicacoes/AplicacaoHero";
import { RuidoContido } from "@/components/aplicacoes/RuidoContido";
import { FaixaControle } from "@/components/aplicacoes/FaixaControle";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import { getAnosDeMercado } from "@/lib/institucional";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./page.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// PUBLICADA (2026-08-25): linkada no card "Automação industrial" de
// Segmentos.tsx, dentro de app/sitemap.ts, sem `robots: noindex`. O conteúdo
// técnico ainda vem de conhecimento geral de engenharia, não de dado
// confirmado pela Toroid para este segmento especificamente (mesma origem do
// aviso que existia aqui antes de publicar, ver histórico em ROADMAP.md, item
// 1.5). Sem spec table de propósito, por não existir faixa técnica confirmada
// para este segmento.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Transformador para Automação Industrial | Toroid do Brasil",
  description:
    "Transformador para painel de automação industrial com isolação galvânica e baixa irradiação de campo. Fale com o nosso time e peça seu orçamento.",
  alternates: { canonical: "/aplicacoes/automacao-industrial" },
};

const PROVA = ["ISO 9001", `${getAnosDeMercado()} anos de mercado`, "garantia de 3 anos"];

const CHECKLIST = [
  "Tensão de entrada e de saída do circuito de controle",
  "Potência necessária (CLP, sensores, atuadores, IHM)",
  "Ambiente de instalação (painel fechado, vibração, faixa de temperatura)",
  "Necessidade de blindagem adicional contra EMI de drive/inversor próximo",
  "Espaço disponível no painel ou fixação em trilho DIN",
  "Volume do pedido e prazo do programa de produção",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Transformador toroidal reduz o ruído elétrico dentro do painel?",
    resposta:
      "O núcleo toroidal, sem gap, fecha o fluxo magnético dentro do próprio núcleo, o que reduz a irradiação de campo para fora do componente e o acoplamento de ruído em cabo de sinal próximo.",
  },
  {
    pergunta: "Cabe em painel compacto ou fixação em trilho DIN?",
    resposta:
      "O dimensionamento é feito considerando o espaço do seu painel. Se o padrão de fixação for trilho DIN, é um dado a informar na especificação.",
  },
  {
    pergunta: "Suportam o ambiente de vibração e temperatura de chão de fábrica?",
    resposta:
      "A construção é avaliada para o ambiente de instalação informado. Ambiente severo entra como requisito de especificação, não como padrão único de linha.",
  },
  {
    pergunta: "Dá para padronizar o mesmo transformador em várias máquinas da linha?",
    resposta:
      "Sim, é comum fixar uma especificação única para replicar em produção de série, o que reduz variação de fornecedor e de lote.",
  },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores para automação industrial",
        item: "https://toroid.com.br/aplicacoes/automacao-industrial",
      },
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

export default function AutomacaoIndustrialPage() {
  return (
    <>
      <AplicacaoHero
        trilha="Transformadores para automação industrial"
        eyebrow="Automação industrial"
        titulo={
          <>
            Transformador para automação industrial: isolação que resiste ao ruído do painel,{" "}
            <span className={styles.acento}>sem falha no controle</span>
          </>
        }
        lead="Painel de automação concentra motor, drive, contator e controle no mesmo espaço. O transformador que alimenta o CLP ou o circuito de controle não pode virar o ponto fraco desse ambiente eletricamente ruidoso."
        prova={PROVA}
        ctaPrimario="Enviar a especificação do painel"
        ctaWhatsapp="Falar com nosso time"
        arte={<RuidoContido />}
      />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo="O que muda no projeto do seu painel">
          <p>
            Cada característica de construção abaixo termina no mesmo lugar: parada de linha evitada porque o
            transformador não foi o elo fraco do painel.
          </p>
          <p>
            <strong>Isolação galvânica entre potência e controle.</strong> Separação elétrica real entre o circuito de
            força e o circuito que alimenta CLP, sensor e IHM. Para você, proteção do controle contra transiente vindo
            da rede. Para o negócio, menos parada não programada por falha de componente eletrônico sensível.
          </p>
          <p>
            <strong>Núcleo toroidal, sem gap.</strong> O fluxo magnético fecha dentro do núcleo, e a irradiação de campo
            para fora do componente cai. Para você, menos ruído acoplado em cabo de sinal dentro do mesmo painel. Para o
            negócio, menos diagnóstico de falha intermitente difícil de reproduzir em bancada.
          </p>
          <p>
            <strong>Construção compacta.</strong> Espaço que volta para o projeto do painel, com trilho DIN, dissipação
            ou fiação. Para o negócio, painel menor e mais barato de fabricar por unidade.
          </p>
          <p>
            <strong>Fabricação nacional com rastreabilidade de lote.</strong> Para você, reposição de peça sem depender
            de importação. Para o negócio, linha de montagem de máquina que não para esperando componente.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="ambiente" titulo="O ambiente do painel é dado de especificação">
          <p>
            Vibração, faixa de temperatura e proximidade de drive ou inversor mudam o que a engenharia recomenda de
            construção e de blindagem adicional. Não existe padrão único de linha que resolva todo ambiente: o que
            existe é dimensionamento a partir do que o seu painel realmente enfrenta em operação.
          </p>
        </Prose>

        <div className={styles.grafico}>
          <FaixaControle />
        </div>

        <div className={styles.ctaInline}>
          <p className={styles.ctaInlineTexto}>
            Já sabe a tensão e a potência do circuito de controle? Envie os dados e o nosso time responde com o dimensionamento.
          </p>
          <WhatsAppLink
            className={styles.ctaInlineLink}
            mensagem="Olá! Preciso do transformador de um painel de automação e gostaria de falar sobre tensão e potência do circuito de controle."
          >
            Falar sobre o painel
            <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </WhatsAppLink>
        </div>

        <div className={styles.perguntas}>
          <Perguntas id="perguntas" titulo="Perguntas que aparecem nesta especificação" itens={PERGUNTAS} />
        </div>
      </PillarBody>

      <PillarChecklist
        id="fechar"
        eyebrow="Antes da cotação"
        titulo="Feche a especificação com o nosso time"
        lead="É esse conjunto de dados que separa uma cotação de catálogo de um dimensionamento sob medida. Se algum item ainda não existe no seu projeto, a equipe ajuda a fechar."
        itens={CHECKLIST}
      />

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

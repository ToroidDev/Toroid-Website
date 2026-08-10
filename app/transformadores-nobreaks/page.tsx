import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { PillarBody, PillarChecklist, PillarSpecTable, Prose } from "@/components/produtos/Pillar";
import { AplicacaoHero } from "@/components/aplicacoes/AplicacaoHero";
import { NucleoIsolado } from "@/components/aplicacoes/NucleoIsolado";
import { BandaRegulacao } from "@/components/aplicacoes/BandaRegulacao";
import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import { getAnosDeMercado } from "@/lib/institucional";
import { whatsappLink } from "@/lib/whatsapp";
import styles from "./page.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// ATENÇÃO, VERIFICAR ENGENHARIA
// Os valores técnicos desta página (5 VA a 15 kVA, 50 Hz a 800 Hz, tensão de
// isolamento até 4 kV, eficiência até 98%, regulação até 1%, redução de tamanho
// e peso de 30% a 60% frente ao E/I) vêm do brand book e ainda NÃO passaram por
// validação formal da engenharia. Confirmar antes do primeiro deploy em produção
// e antes de qualquer uso em proposta comercial vinculante.
//
// Um ponto específico de redação: o texto diz "projetada considerando os
// requisitos de" resistência a curto-circuito da NBR5356-5, e não "ensaiada
// conforme". A diferença é material. Só trocar para ensaio se existir relatório
// emitido, e confirmar isso com a engenharia.
//
// [PROPOSTA: VALIDAR COM COMERCIAL]
// A mensagem-chave que sustenta o H1 e a seção de estabilidade ("estabilidade sob
// carga variável, menos falha, menos garantia acionada") foi construída a partir
// da NBR5356-5, não de dor confirmada em campo com fabricante de nobreak.
// Confirmar com o comercial: (1) chamado de garantia é a dor que esse comprador
// verbaliza; (2) o argumento térmico e de EMI é o que trava ou destrava a decisão
// no segmento. Se a dor real for outra (prazo, custo unitário, aprovação de
// amostra), o H1 muda e a página muda com ele.
//
// ROTA: esta página fica em /transformadores-nobreaks, a URL definida no
// briefing, no padrão plano herdado do WordPress antigo. Se a decisão for migrar
// para o padrão /aplicacoes/[slug] do CLAUDE.md, são três mudanças: mover a
// pasta, ajustar o canonical abaixo e adicionar o 301 da URL antiga em
// next.config.ts. Enquanto a página viver aqui, NÃO incluir
// /transformadores-nobreaks na lista de redirects: o redirect passaria na frente
// da rota e a página nunca renderizaria.
//
// Conteúdo estático por decisão do projeto, já que o WordPress ainda não está
// confirmado. Fase seguinte: trocar por lib/wordpress.ts (CPT `aplicacao`) sem
// mudar URL nem estrutura desta página.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Transformador Toroidal para Nobreak | Toroid do Brasil",
  description:
    "Transformador toroidal para nobreak com isolação galvânica, baixa irradiação de campo e eficiência até 98%. Fale com a engenharia e peça seu orçamento.",
  alternates: { canonical: "/transformadores-nobreaks" },
};

const PROVA = ["ISO 9001", `${getAnosDeMercado()} anos de mercado`, "garantia de 3 anos"];

const ESPECIFICACOES: [string, string][] = [
  ["Faixa de potência", "5 VA a 15 kVA"],
  ["Frequência de operação", "50 Hz a 800 Hz"],
  ["Isolação", "galvânica, com blindagem eletrostática e eletromagnética"],
  ["Tensão de isolamento", "até 4 kV"],
  ["Eficiência", "até 98%"],
  ["Regulação", "até 1%"],
  ["Redução de tamanho e peso frente ao E/I", "30% a 60%"],
  ["Acabamentos disponíveis", "Mylar ou resina epóxi"],
  ["Norma de referência (tipo seco)", "ABNT NBR5356-11"],
  ["Norma de referência (curto-circuito)", "ABNT NBR5356-5:2015"],
];

const CHECKLIST = [
  "Potência de saída do nobreak",
  "Tensões de entrada e de saída",
  "Frequência de operação",
  "Espaço interno disponível no gabinete",
  "Ambiente de instalação",
  "Necessidade de blindagem adicional contra EMI",
  "Volume do pedido e prazo do programa de produção",
];

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Qual potência de toroidal usar no meu nobreak?",
    resposta:
      "Depende de potência de saída, topologia e regime de carga. A faixa vai de 5 VA a 15 kVA. Envie os dados de entrada e saída e a engenharia dimensiona.",
  },
  {
    pergunta: "Toroidal reduz EMI dentro do gabinete?",
    resposta:
      "A irradiação de campo magnético é baixíssima em relação ao E/I, e a blindagem eletrostática e eletromagnética reforça isso. Requisito de ensaio específico entra na especificação.",
  },
  {
    pergunta: "Mylar ou resina epóxi?",
    resposta:
      "Mylar entrega a isolação elétrica em aplicação padrão. A resina epóxi adiciona proteção mecânica e resistência a umidade, poeira e variação térmica, para ambiente agressivo.",
  },
  {
    pergunta: "Vocês entregam sob medida em volume?",
    resposta:
      "Sim. O dimensionamento parte da sua aplicação, e lote, prazo e cronograma entram na proposta técnica.",
  },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Transformador Toroidal para Nobreak",
    category: "Transformador toroidal para nobreaks e condicionadores de energia",
    brand: { "@type": "Brand", name: "Toroid do Brasil" },
    manufacturer: {
      "@type": "Organization",
      name: "Toroid do Brasil",
      address: {
        "@type": "PostalAddress",
        addressLocality: "São José dos Pinhais",
        addressRegion: "PR",
        addressCountry: "BR",
      },
    },
    description:
      "Transformador toroidal para nobreaks e condicionadores de energia, com isolação galvânica, blindagem eletrostática e eletromagnética, construção tipo seco conforme ABNT NBR5356-11 e faixa de 5 VA a 15 kVA.",
    url: "https://toroid.com.br/transformadores-nobreaks",
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
      { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Transformadores para nobreaks",
        item: "https://toroid.com.br/transformadores-nobreaks",
      },
    ],
  },
  {
    // Espelha exatamente o texto publicado na seção de perguntas. Se uma resposta
    // mudar lá, muda aqui: FAQPage divergente do conteúdo visível é motivo de
    // desqualificação do rich result.
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
      "@type": "Question",
      name: pergunta,
      acceptedAnswer: { "@type": "Answer", text: resposta },
    })),
  },
];

export default function TransformadoresNobreaksPage() {
  return (
    <>
      <AplicacaoHero
        trilha="Transformadores para nobreaks"
        eyebrow="Nobreaks e condicionadores de energia"
        titulo={
          <>
            Transformador toroidal para nobreak: menos falha em campo,{" "}
            <span className={styles.acento}>menos garantia acionada</span>
          </>
        }
        lead="Um nobreak não falha por falta de energia. Falha por instabilidade: carga que varia, calor que acumula no gabinete, ruído que atravessa a eletrônica de controle. É aí que o transformador toroidal para nobreak deixa de ser linha de lista de material e passa a ser decisão de engenharia."
        prova={PROVA}
        ctaPrimario="Enviar a especificação do nobreak"
        ctaWhatsapp="Falar com um engenheiro"
        arte={<NucleoIsolado />}
      />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo="O que muda no projeto do seu nobreak">
          <p>
            Quando o equipamento volta em garantia, a causa quase nunca está no que o cliente enxerga. Está numa
            especificação que passou batida no projeto. Se você está dimensionando o transformador de um nobreak ou
            condicionador de energia, precisa fechar três pontos antes de liberar o projeto: isolação, comportamento
            térmico sob carga variável e espaço no gabinete.
          </p>
          <p>
            Cada item abaixo começa pela construção do componente e termina no resultado que aparece na sua planilha de
            pós-venda.
          </p>
          <p>
            <strong>Geometria toroidal, sem GAP.</strong> O fluxo magnético fecha dentro do núcleo e a irradiação de
            campo para fora do componente cai. Na prática, menos ruído acoplado na eletrônica de controle e na medição.
            Para você, menos retrabalho de compatibilidade eletromagnética descoberto no fim do desenvolvimento, quando
            mudar layout custa caro. Para o negócio, cronograma de lançamento que não escorrega por causa de um
            componente.
          </p>
          <p>
            <strong>Baixas perdas e eficiência elevada.</strong> Menos energia virando calor é menos temperatura dentro
            de um gabinete apertado, que já tem bateria dentro. Para você, comportamento térmico previsível sob variação
            de carga. Para o negócio, menos falha em campo por degradação térmica e menos garantia acionada.
          </p>
          <p>
            <strong>Isolação galvânica com blindagem eletrostática e eletromagnética.</strong> Separação elétrica real
            entre entrada e saída. Para você, proteção da carga crítica e caminho mais limpo para atender requisito de
            segurança do equipamento final. Para o negócio, homologação com menos idas e vindas.
          </p>
          <p>
            <strong>Tamanho e peso reduzidos frente ao E/I.</strong> Espaço que volta para o projeto: bateria, dissipação
            ou um gabinete menor. Para o negócio, custo de embalagem e frete menor por unidade.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <Prose id="estabilidade" titulo="Estabilidade sob carga variável">
          <p>
            Nobreak trabalha em regime que muda: comutação, degrau de carga, corrente de partida. O ponto crítico não é o
            desempenho nominal em bancada. É a transição.
          </p>
          <p>
            A linha toroidal da Toroid é projetada considerando os requisitos de capacidade de resistência a
            curto-circuito da ABNT NBR5356-5:2015 e a construção tipo seco da ABNT NBR5356-11, sem óleo isolante. São
            duas coisas diferentes e as duas importam aqui: a primeira é prova de robustez elétrica sob evento severo, a
            segunda define a construção que você vai instalar dentro de um equipamento fechado.
          </p>
        </Prose>

        <div className={styles.grafico}>
          <BandaRegulacao />
          <p className={styles.notaGrafico}>
            O desenho representa o parâmetro de regulação da linha, não uma curva de ensaio: a corrente de carga varia e
            a tensão de saída permanece dentro da faixa. Os valores de especificação estão na tabela desta página.
          </p>
        </div>
      </PillarBody>

      <PillarBody>
        <Prose id="toroidal-ou-ei" titulo="Toroidal ou E/I: a pergunta certa">
          <p>
            Cada tecnologia atende necessidades diferentes. A questão não é qual é melhor, é qual gera mais valor para os
            objetivos deste projeto.
          </p>
          <p>
            O toroidal costuma decidir quando o gabinete é apertado, quando há eletrônica sensível perto do transformador
            ou quando ruído audível e aquecimento incomodam o usuário final. O E/I segue adequado quando o custo unitário
            pesa mais que o ganho de espaço, ou quando o projeto já está consolidado em torno dele e mudar exigiria
            requalificar o conjunto.
          </p>
          <p>
            Ainda nessa decisão? A engenharia compara os dois cenários com os seus números antes de você fechar a
            especificação. O fundamento técnico completo da linha está em{" "}
            <Link href="/produtos/transformadores-toroidais">Transformadores Toroidais</Link>.
          </p>
        </Prose>
      </PillarBody>

      <PillarBody tone="tint">
        <PillarSpecTable
          id="especificacoes"
          titulo="Especificações confirmadas da linha toroidal"
          linhas={ESPECIFICACOES}
          nota="Parâmetros da linha padrão. Fora dessas faixas, a customização é avaliada projeto a projeto: transformador sob medida é o padrão da casa, não exceção."
        />
      </PillarBody>

      <PillarBody>
        <Prose id="fornecimento" titulo="Para quem compra, não só para quem especifica">
          <p>
            Confiabilidade de fornecimento é especificação também. Fabricação nacional encurta o ciclo de reposição e
            tira a dependência de importação de um item que trava a linha de montagem se atrasar. A especificação é
            verificada e o ensaio elétrico é documentado antes do embarque, o que reduz amostra reprovada e ajuste depois
            que a produção já começou. Esse transformador não é commodity decidida por centavo: é o que determina quanto
            o seu pós-venda vai custar nos três anos seguintes.
          </p>
        </Prose>

        <div className={styles.ctaInline}>
          <p className={styles.ctaInlineTexto}>
            Precisa de previsibilidade de prazo para um programa de produção? Fale com a engenharia sobre volume, lote e
            cronograma.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener" className={styles.ctaInlineLink}>
            Falar sobre volume e prazo
            <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        {/* Perguntas ficam no mesmo fundo branco da seção de fornecimento: uma
            troca de tinta a cada seção deixava a página listrada, e o pedido
            aqui é o oposto disso. */}
        <div className={styles.perguntas}>
          <Perguntas id="perguntas" titulo="Perguntas que aparecem nesta especificação" itens={PERGUNTAS} />
        </div>
      </PillarBody>

      <PillarChecklist
        id="fechar"
        eyebrow="Antes da cotação"
        titulo="Feche a especificação com a engenharia"
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

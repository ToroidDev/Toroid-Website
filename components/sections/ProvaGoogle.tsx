import { Star } from "lucide-react";
import { GoogleIcon } from "@/components/ui/SocialIcons";
import { T } from "@/components/i18n/T";
import styles from "./ProvaGoogle.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// LIGADA (2026-08-25). Troca o card "Prova social: Em breve" que existia
// dentro do grid de Segmentos.tsx (removido na mesma tarefa que criou este
// componente) por uma seção própria e pequena com a nota real da Toroid no
// Google (perfil confirmado pelo usuário via captura de tela: "Toroid do
// Brasil Indústria e Comércio de Transformadores", 4,6, 78 avaliações,
// fabricante em São José dos Pinhais). LINK_AVALIACOES é o link curto oficial
// do próprio perfil (share.google), não mais a busca por nome+endereço da
// primeira versão.
//
// NOTA e TOTAL_AVALIACOES são constante fixa, não vêm de API: diferente do
// resto do site, esse número muda toda vez que alguém deixa uma avaliação
// nova, então desatualiza sozinho com o tempo. Reconfirmar de vez em quando
// (não há automação disso hoje, ficaria a cargo de uma integração com Google
// Places, fora do escopo desta tarefa).
//
// Estrelas em azul institucional, não no dourado padrão do selo do Google:
// CLAUDE.md reserva o amarelo da marca só para os três fios do logo, nunca
// para UI (ver "Identidade visual").
// ─────────────────────────────────────────────────────────────────────────────

const NOTA = 4.6;
const TOTAL_AVALIACOES = 78;
const LINK_AVALIACOES = "https://share.google/ceY5Qx4zs54YK3ln0";

export function ProvaGoogle() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <a href={LINK_AVALIACOES} target="_blank" rel="noopener" className={styles.card}>
          <GoogleIcon size={28} />

          <div className={styles.texto}>
            <div className={styles.linha}>
              <span className={styles.nota}>{NOTA.toFixed(1).replace(".", ",")}</span>
              <span className={styles.estrelas} aria-hidden="true">
                <span className={styles.estrelasFundo}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} strokeWidth={0} fill="var(--color-border-strong)" />
                  ))}
                </span>
                {/* Recorte por largura em vez de arredondar estrela a estrela: com
                    4,6 isso mostra ~92% preenchido (a 5ª estrela quase cheia), em
                    vez de arredondar pra 5 estrelas cheias e exagerar a nota. */}
                <span className={styles.estrelasPreenchidas} style={{ width: `${(NOTA / 5) * 100}%` }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} strokeWidth={0} fill="currentColor" />
                  ))}
                </span>
              </span>
            </div>
            <p className={styles.legenda}>
              <T
                pt={`${TOTAL_AVALIACOES} avaliações no Google`}
                es={`${TOTAL_AVALIACOES} reseñas en Google`}
                en={`${TOTAL_AVALIACOES} Google reviews`}
              />
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}

import styles from "./PostBody.module.css";

// Conteúdo vem do CMS administrado pela própria empresa (WordPress headless),
// não de input de visitante — dangerouslySetInnerHTML é o padrão aceito para
// renderizar corpo de post de WP headless.
export function PostBody({ html }: { html: string }) {
  return <div className={styles.corpo} dangerouslySetInnerHTML={{ __html: html }} />;
}

import styles from "./Perguntas.module.css";

/**
 * Perguntas que a persona faz durante a especificação. Fica visível na página, e
 * não só no JSON-LD, porque é conteúdo que o engenheiro procura antes de pedir
 * cotação. Cada item é h3 sob o h2 da seção, então o esquema de cabeçalho segue
 * linear e o FAQPage do dado estruturado espelha exatamente o texto publicado.
 */

export interface Pergunta {
  pergunta: string;
  resposta: string;
}

export function Perguntas({ id, titulo, itens }: { id: string; titulo: string; itens: Pergunta[] }) {
  return (
    <div className={styles.wrap}>
      <h2 id={id} className={styles.titulo}>
        {titulo}
      </h2>

      <div className={styles.lista}>
        {itens.map(({ pergunta, resposta }) => (
          <div key={pergunta} className={styles.item}>
            <h3 className={styles.pergunta}>{pergunta}</h3>
            <p className={styles.resposta}>{resposta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

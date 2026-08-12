import styles from "./ContatoMapa.module.css";

const ENDERECO = "Rua Antônio Bianchetti, 541, São José dos Pinhais, PR, 83065-370";
const MAPA_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ENDERECO)}&output=embed`;

export function ContatoMapa() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <iframe
            src={MAPA_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Toroid do Brasil em São José dos Pinhais, PR"
            className={styles.iframe}
          />
        </div>
      </div>
    </section>
  );
}

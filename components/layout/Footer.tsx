import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer id="contato" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <Image src="/images/logo-toroid-trim.png" alt="Toroid do Brasil" width={808} height={349} className={styles.logo} />
            <p className={styles.about}>
              Transformadores toroidais, transformadores de corrente e indutores sob medida. Fabricação nacional, ISO 9001.
            </p>
          </div>

          <div>
            <p className={styles.columnTitle}>Contato</p>
            {/* TODO: confirmar telefones e e-mail oficiais */}
            <div className={styles.columnList}>
              <a href="tel:+554130000000">
                <Phone size={15} strokeWidth={1.8} aria-hidden="true" />
                +55 (41) 3000-0000
              </a>
              <a href="tel:+554130000001">
                <Phone size={15} strokeWidth={1.8} aria-hidden="true" />
                +55 (41) 3000-0001
              </a>
              <a href="mailto:comercial@toroid.com.br">
                <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                comercial@toroid.com.br
              </a>
              <span>
                <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
                São José dos Pinhais · PR
              </span>
            </div>
          </div>

          <div>
            <p className={styles.columnTitle}>Redes</p>
            {/* TODO: confirmar URLs dos perfis oficiais.
                Sem ícone de propósito: o Lucide v1 removeu as marcas de terceiro
                (LinkedIn/Instagram/YouTube). Quando as URLs forem confirmadas,
                decidir entre um pacote de brand icons ou SVG próprio. O glifo do
                WhatsApp em WhatsAppButton.tsx é o precedente da segunda opção. */}
            <div className={`${styles.columnList} ${styles.columnListPlain}`}>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
              <a href="#">YouTube</a>
            </div>
          </div>

          <div>
            <p className={styles.columnTitle}>Selos</p>
            <div className={styles.selos}>
              <Image
                src="/images/cert-rina-iso9001.jpg"
                alt="Sistema de gestão certificado RINA ISO 9001"
                width={1701}
                height={1382}
                className={styles.seloRina}
              />
              <Image src="/images/cert-iso.png" alt="ISO" width={269} height={188} className={styles.seloIso} />
              <Image src="/images/cert-esg.png" alt="ESG" width={269} height={188} className={styles.seloEsg} />
            </div>
          </div>
        </div>

        <div className={styles.divider} />
      </div>

      <div className={styles.band}>
        <div className={styles.bandInner}>
          <p className={styles.tagline}>Transformando energia e vidas.</p>

          {/* três listras onduladas: única aparição do amarelo institucional na UI */}
          <svg
            viewBox="0 0 1200 54"
            width="100%"
            className={styles.stripes}
            aria-hidden="true"
            fill="none"
            strokeWidth={4}
            strokeLinecap="round"
          >
            <path d="M0 18 C 150 4, 300 30, 450 20 S 750 4, 900 16 S 1080 30, 1200 20" stroke="#5EA75E" />
            <path d="M0 28 C 150 14, 300 40, 450 30 S 750 14, 900 26 S 1080 40, 1200 30" stroke="#4E8FD6" />
            <path
              d="M0 38 C 150 24, 300 50, 450 40 S 750 24, 900 36 S 1080 50, 1200 40"
              className={styles.stripeYellow}
            />
          </svg>

          <p className={styles.copyright}>&copy; 2026 Toroid do Brasil · Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}

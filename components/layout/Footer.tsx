import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, LinkedinIcon, WhatsappIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { CookieSettingsLink } from "@/components/layout/CookieSettingsLink";
import { FooterText } from "@/components/layout/FooterText";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <Image src="/images/logo-toroid-trim.png" alt="Toroid do Brasil" width={808} height={349} className={styles.logo} />
            <p className={styles.about}>
              <FooterText k="about" />
            </p>
          </div>

          <div>
            <p className={styles.columnTitle}>
              <FooterText k="contato" />
            </p>
            <div className={styles.columnList}>
              <a href="tel:+554130358282">
                <Phone size={15} strokeWidth={1.8} aria-hidden="true" />
                +55 (41) 3035-8282
              </a>
              <WhatsAppLink>
                <WhatsappIcon size={15} />
                +55 (41) 3035-8258
              </WhatsAppLink>
              <a href="mailto:vendas@toroid.com.br">
                <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                vendas@toroid.com.br
              </a>
              <a href="mailto:engenharia@toroid.com.br">
                <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                engenharia@toroid.com.br
              </a>
              <a href="mailto:rh@toroid.com.br">
                <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                rh@toroid.com.br
              </a>
              <span>
                <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
                Rua Antônio Bianchetti, 541 - Iná, São José dos Pinhais, PR
              </span>
            </div>
          </div>

          <div>
            <p className={styles.columnTitle}>
              <FooterText k="redes" />
            </p>
            <div className={styles.columnList}>
              <a href="https://www.linkedin.com/company/toroidbrasil/" target="_blank" rel="noopener">
                <LinkedinIcon size={15} />
                LinkedIn
              </a>
              <a href="https://www.instagram.com/toroidbrasil/" target="_blank" rel="noopener">
                <InstagramIcon size={15} />
                Instagram
              </a>
              <a href="https://www.youtube.com/@toroiddobrasil3985" target="_blank" rel="noopener">
                <YoutubeIcon size={15} />
                YouTube
              </a>
            </div>
          </div>

          <div>
            <p className={styles.columnTitle}>
              <FooterText k="selos" />
            </p>
            <div className={styles.selos}>
              <Image
                src="/images/cert-rina-iso9001.jpg"
                alt="Sistema de gestão certificado RINA ISO 9001"
                width={1710}
                height={1110}
                className={styles.seloRina}
              />
              <Image
                src="/images/cert-iso.png"
                alt="Certificação ISO 9001"
                width={269}
                height={188}
                className={styles.seloIso}
              />
              <Image
                src="/images/cert-esg.png"
                alt="Certificação ESG"
                width={269}
                height={188}
                className={styles.seloEsg}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider} />
      </div>

      <div className={styles.band}>
        <div className={styles.bandInner}>
          <p className={styles.tagline}>
            <FooterText k="tagline" />
          </p>


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

          <LanguageSwitcher />

          <p className={styles.copyright}>
            &copy; 2026 Toroid do Brasil · <FooterText k="direitos" /> 
            {/* ·{" "} */}
            {/* <CookieSettingsLink className={styles.preferenciasCookies} /> */}
          </p>
        </div>
      </div>
    </footer>
  );
}

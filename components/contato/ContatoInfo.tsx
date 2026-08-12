import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, LinkedinIcon, WhatsappIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import styles from "./ContatoInfo.module.css";

const CONTATOS = [
  { label: "Vendas", href: "mailto:vendas@toroid.com.br", texto: "vendas@toroid.com.br" },
  { label: "Engenharia", href: "mailto:engenharia@toroid.com.br", texto: "engenharia@toroid.com.br" },
  { label: "Trabalhe conosco", href: "mailto:rh@toroid.com.br", texto: "rh@toroid.com.br" },
];

const ENDERECOS = [
  { pais: "Brasil", linhas: ["Rua Antônio Bianchetti, 541 - Iná", "São José dos Pinhais, PR, CEP 83065-370"] },
  { pais: "Estados Unidos", linhas: ["2020 Northwood Drive", "Salisbury, MD 21801"] },
];

const REDES = [
  { nome: "LinkedIn", href: "https://www.linkedin.com/company/toroidbrasil/", Icon: LinkedinIcon },
  { nome: "Instagram", href: "https://www.instagram.com/toroidbrasil/", Icon: InstagramIcon },
  { nome: "YouTube", href: "https://www.youtube.com/@toroiddobrasil3985", Icon: YoutubeIcon },
];

export function ContatoInfo() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.coluna}>
          <p className={styles.tituloColuna}>Fale conosco</p>
          <div className={styles.lista}>
            {CONTATOS.map((c) => (
              <a key={c.label} href={c.href} className={styles.item}>
                <Mail size={16} strokeWidth={1.8} aria-hidden="true" />
                <span>
                  <span className={styles.itemLabel}>{c.label}</span>
                  {c.texto}
                </span>
              </a>
            ))}
            <a href="tel:+554130358282" className={styles.item}>
              <Phone size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>
                <span className={styles.itemLabel}>Telefone</span>
                +55 (41) 3035-8282
              </span>
            </a>
            <a href="tel:+554130358263" className={styles.item}>
              <WhatsappIcon size={16} />
              <span>
                <span className={styles.itemLabel}>WhatsApp</span>
                +55 (41) 3035-8263
              </span>
            </a>
          </div>
        </div>

        <div className={styles.coluna}>
          <p className={styles.tituloColuna}>Endereço</p>
          <div className={styles.lista}>
            {ENDERECOS.map((e) => (
              <div key={e.pais} className={styles.item}>
                <MapPin size={16} strokeWidth={1.8} aria-hidden="true" />
                <span>
                  <span className={styles.itemLabel}>{e.pais}</span>
                  {e.linhas.map((linha) => (
                    <span key={linha} className={styles.linhaEndereco}>
                      {linha}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.coluna}>
          <p className={styles.tituloColuna}>Redes sociais</p>
          <div className={styles.lista}>
            {REDES.map(({ nome, href, Icon }) => (
              <a key={nome} href={href} target="_blank" rel="noopener" className={styles.item}>
                <Icon size={16} />
                {nome}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

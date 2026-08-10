"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { produtos } from "@/lib/produtos";
import { ProdutoIconeSvg } from "@/components/ui/ProductIcons";
import styles from "./Nav.module.css";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const produtosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!produtosOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (produtosRef.current && !produtosRef.current.contains(e.target as Node)) {
        setProdutosOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProdutosOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [produtosOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.bar}>
          <Link href="/" aria-label="Toroid do Brasil, ir para a página inicial" className={styles.logoLink}>
            <span className={styles.logoPlate}>
              <Image
                src="/images/logo-toroid-trim.png"
                alt="Toroid do Brasil"
                width={808}
                height={349}
                priority
                className={styles.logo}
              />
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Principal">
            <div className={styles.navItem} ref={produtosRef} data-open={produtosOpen || undefined}>
              <button
                type="button"
                className={styles.navLink}
                aria-haspopup="true"
                aria-expanded={produtosOpen}
                aria-controls="nav-produtos"
                onClick={() => setProdutosOpen((open) => !open)}
              >
                Produtos
                <ChevronDown size={16} strokeWidth={2} aria-hidden="true" className={styles.chevron} />
              </button>
              <div className={styles.dropdown} id="nav-produtos">
                {produtos.map((produto) => (
                  <Link
                    key={produto.id}
                    href={produto.href}
                    className={styles.dropdownLink}
                    onClick={() => setProdutosOpen(false)}
                  >
                    <ProdutoIconeSvg icone={produto.icone} size={20} className={styles.dropdownIcon} />
                    {produto.nome}
                  </Link>
                ))}
              </div>
            </div>
            {/* Raiz-relativas de propósito: `#segmentos` e `#fabrica` só existem
                na home, então em página interna a âncora pura não levava a lugar
                nenhum. `#contato` (rodapé) e `#orcamento` (bloco de CTA) existem
                em toda página, e por isso seguem como âncora local. */}
            <Link href="/#segmentos" className={styles.navLink}>
              Segmentos
            </Link>
            <Link href="/#fabrica" className={styles.navLink}>
              Sobre
            </Link>
            <a href="#contato" className={styles.navLink}>
              Contato
            </a>
            <a href="#orcamento" className={styles.cta}>
              Solicitar Orçamento
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </nav>

          <button type="button" className={styles.burger} aria-label="Abrir menu" onClick={() => setMobileOpen(true)}>
            <Menu size={24} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.hairline} aria-hidden="true" />
      </header>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileHeader}>
            <Image
              src="/images/logo-toroid-trim.png"
              alt="Toroid do Brasil"
              width={808}
              height={349}
              className={styles.mobileLogo}
            />
            <button type="button" className={styles.closeButton} aria-label="Fechar menu" onClick={closeMobile}>
              <X size={26} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <nav className={styles.mobileNav}>
            <details className={styles.mobileAccordion}>
              <summary>
                Produtos
                <ChevronDown size={20} strokeWidth={2.2} aria-hidden="true" className={styles.mobileChevron} />
              </summary>
              <div className={styles.mobileSubLinks}>
                {produtos.map((produto) => (
                  <Link key={produto.id} href={produto.href} className={styles.mobileSubLink} onClick={closeMobile}>
                    <ProdutoIconeSvg icone={produto.icone} size={20} />
                    {produto.nome}
                  </Link>
                ))}
              </div>
            </details>
            <a href="#segmentos" className={styles.mobileLink} onClick={closeMobile}>
              Segmentos
            </a>
            <a href="#fabrica" className={styles.mobileLink} onClick={closeMobile}>
              Sobre
            </a>
            <a href="#contato" className={styles.mobileLink} onClick={closeMobile}>
              Contato
            </a>
          </nav>
          <a href="#orcamento" className={styles.mobileCta} onClick={closeMobile}>
            Solicitar Orçamento
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      )}
    </>
  );
}

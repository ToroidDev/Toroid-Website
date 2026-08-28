"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { produtos } from "@/lib/produtos";
import { ProdutoIconeSvg } from "@/components/ui/ProductIcons";
import { useLocale } from "@/components/layout/LocaleProvider";
import { navDictionary } from "@/lib/i18n";
import styles from "./Nav.module.css";

// Só /produtos e o post de blog (/blog/[slug]) têm fundo claro colado no topo,
// sem hero escuro por baixo do header. Nelas o header inteiro nasce no modo
// claro: logo preta, links em cinza institucional, CTA azul sólido e filete
// azulado. Sem isso o menu ficava branco sobre branco, invisível até o
// primeiro scroll. Nas demais (home, quem-somos, contato, as 3 famílias de
// produto, transformadores-toroidais, capacidade-fabril, trabalhe-conosco, a
// listagem /blog — que ganhou hero azul próprio — e os espelhos /es/*) o
// header em repouso fica sobre hero escuro, então usa a versão branca até o
// primeiro scroll, quando a pílula branca assume e tudo volta para o escuro.
function heroClaroPath(pathname: string): boolean {
  return pathname === "/produtos" || pathname.startsWith("/blog/");
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const produtosRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = navDictionary[locale];
  // /contato é a única página sem <CTA id="orcamento">: âncora local vira 404
  // silencioso (nada acontece). Nessa página o link precisa navegar até a home
  // e rolar; nas demais, a âncora local mantém o usuário no lugar.
  const orcamentoHref = pathname === "/contato" ? "/#orcamento" : "#orcamento";
  const heroClaro = heroClaroPath(pathname);

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

  // Um clique repetido no mesmo href (já em #orcamento) não muda a URL, então
  // não dispara hashchange nenhum. O evento custom garante que o formulário
  // abra direto mesmo nesse caso, sem o clique a mais no gatilho do CTA.
  const abrirOrcamento = () => window.dispatchEvent(new Event("toroid:abrir-orcamento"));

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${heroClaro ? styles.heroClaro : ""}`}
      >
        <div className={styles.bar}>
          <Link href="/" aria-label={t.irParaHome} className={styles.logoLink}>
            {heroClaro ? (
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
            ) : (
              <span className={styles.logoStack}>
                <Image
                  src="/images/logo-toroid-trim-branco.png"
                  alt="Toroid do Brasil"
                  width={808}
                  height={349}
                  priority
                  className={`${styles.logo} ${styles.logoWhite}`}
                />
                {/* Sem `priority`: só fica visível depois do primeiro scroll,
                    não é LCP. A branca acima é a que precisa carregar cedo. */}
                <span className={styles.logoPlate}>
                  <Image
                    src="/images/logo-toroid-trim.png"
                    alt="Toroid do Brasil"
                    width={808}
                    height={349}
                    className={styles.logo}
                  />
                </span>
              </span>
            )}
          </Link>

          <nav className={styles.desktopNav} aria-label={t.principal}>
            <div className={styles.navItem} ref={produtosRef} data-open={produtosOpen || undefined}>
              <button
                type="button"
                className={styles.navLink}
                aria-haspopup="true"
                aria-expanded={produtosOpen}
                aria-controls="nav-produtos"
                onClick={() => setProdutosOpen((open) => !open)}
              >
                {t.produtos}
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
            {/* `Sobre` aponta para /quem-somos (rota real, ver ROADMAP.md item
                A.11/Trilha B) — deixou de ser âncora `/#fabrica` da home.
                `Contato` e `Blog` também são rotas de verdade, não âncoras;
                só `Solicitar Orçamento` continua sendo âncora local
                (`#orcamento`), porque esse bloco existe em toda página. */}
            <Link href="/quem-somos" className={styles.navLink}>
              {t.sobre}
            </Link>
            <Link href="/blog" className={styles.navLink}>
              {t.blog}
            </Link>
            <Link href="/contato" className={styles.navLink}>
              {t.contato}
            </Link>
            <Link href={orcamentoHref} className={styles.cta} onClick={abrirOrcamento}>
              {t.orcamento}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </nav>

          <button type="button" className={styles.burger} aria-label={t.abrirMenu} onClick={() => setMobileOpen(true)}>
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
            <button type="button" className={styles.closeButton} aria-label={t.fecharMenu} onClick={closeMobile}>
              <X size={26} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <nav className={styles.mobileNav}>
            <details className={styles.mobileAccordion}>
              <summary>
                {t.produtos}
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
            <Link href="/quem-somos" className={styles.mobileLink} onClick={closeMobile}>
              {t.sobre}
            </Link>
            <Link href="/blog" className={styles.mobileLink} onClick={closeMobile}>
              {t.blog}
            </Link>
            <Link href="/contato" className={styles.mobileLink} onClick={closeMobile}>
              {t.contato}
            </Link>
          </nav>
          <Link
            href={orcamentoHref}
            className={styles.mobileCta}
            onClick={() => {
              closeMobile();
              abrirOrcamento();
            }}
          >
            {t.orcamento}
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}

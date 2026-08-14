"use client";

import { useEffect, useState } from "react";
import { getSavedConsent, saveConsent } from "@/lib/consent";
import styles from "./CookieConsentBanner.module.css";

// Evento global para reabrir o banner em modo de edição sem perder a escolha
// atual — disparado pelo link "Preferências de cookies" no rodapé (Footer.tsx).
const EVENTO_ABRIR = "toroid:open-consent-settings";

export function CookieConsentBanner() {
  const [visivel, setVisivel] = useState(false);
  const [mostrarPreferencias, setMostrarPreferencias] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const salvo = getSavedConsent();
    if (!salvo) setVisivel(true);
    else setAnalytics(salvo.analytics);

    function abrirPreferencias() {
      const atual = getSavedConsent();
      if (atual) setAnalytics(atual.analytics);
      setMostrarPreferencias(true);
      setVisivel(true);
    }

    window.addEventListener(EVENTO_ABRIR, abrirPreferencias);
    return () => window.removeEventListener(EVENTO_ABRIR, abrirPreferencias);
  }, []);

  function aceitarTodos() {
    saveConsent(true);
    setVisivel(false);
    setMostrarPreferencias(false);
  }

  function somenteEssenciais() {
    saveConsent(false);
    setVisivel(false);
    setMostrarPreferencias(false);
  }

  function salvarPreferencias() {
    saveConsent(analytics);
    setVisivel(false);
    setMostrarPreferencias(false);
  }

  if (!visivel) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Preferências de cookies">
      <div className={styles.inner}>
        {!mostrarPreferencias ? (
          <div className={styles.linha}>
            <p className={styles.texto}>
              Usamos cookies essenciais para o funcionamento do site e, com sua permissão, cookies
              analíticos para entender sua navegação. Você pode ajustar suas preferências quando
              quiser. Saiba mais na nossa Política de Privacidade (em breve).
            </p>
            <div className={styles.acoes}>
              <button type="button" className={styles.btnContorno} onClick={() => setMostrarPreferencias(true)}>
                Personalizar
              </button>
              <button type="button" className={styles.btnContorno} onClick={somenteEssenciais}>
                Somente essenciais
              </button>
              <button type="button" className={styles.btnPrincipal} onClick={aceitarTodos}>
                Aceitar todos
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.preferencias}>
            <h2 className={styles.titulo}>Preferências de cookies</h2>

            <div className={styles.linhas}>
              <ConsentRow
                label="Essenciais"
                descricao="Sessão e segurança do site. Não podem ser desativados."
                checked
                disabled
              />
              <ConsentRow
                label="Analíticos"
                descricao="Google Analytics 4, para entender como você navega e melhorar o site."
                checked={analytics}
                onChange={setAnalytics}
              />
            </div>

            <div className={styles.acoes}>
              <button type="button" className={styles.btnContorno} onClick={somenteEssenciais}>
                Rejeitar não essenciais
              </button>
              <button type="button" className={styles.btnPrincipal} onClick={salvarPreferencias}>
                Salvar preferências
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsentRow({
  label,
  descricao,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  descricao: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className={styles.linhaConsentimento} data-desabilitado={disabled || undefined}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span>
        <span className={styles.linhaLabel}>{label}</span>
        <span className={styles.linhaDescricao}>{descricao}</span>
      </span>
    </label>
  );
}

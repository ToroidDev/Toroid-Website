"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
// import { produtos } from "@/lib/produtos";
import { obterAtribuicaoAtual } from "@/lib/attribution";
import { trackFormSubmit } from "@/lib/analytics";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./OrcamentoForm.module.css";

type Estado = "fechado" | "aberto" | "enviando" | "sucesso" | "erro";

// Evento global disparado pelo Nav ao clicar em "Solicitar Orçamento": abre o
// formulário direto, sem o clique intermediário no gatilho. Nome de evento
// dedicado (não hashchange puro) porque um clique repetido no mesmo hash não
// dispara hashchange nenhum, e o pedido era eliminar esse clique a mais.
const EVENTO_ABRIR = "toroid:abrir-orcamento";

// Formulário ativo: nome, e-mail e WhatsApp. O comercial ainda vai validar se
// deve virar mais descritivo (empresa, mensagem, tipo de produto) ou continuar
// direto assim, então os campos extras entram comentados abaixo em vez de
// serem reconstruídos depois. Ver lib/orcamento-schema.ts.
export function OrcamentoForm() {
  const [estado, setEstado] = useState<Estado>("fechado");
  const [erros, setErros] = useState<Record<string, string[]>>({});
  const [erroGeral, setErroGeral] = useState("");
  // Preenchidos só depois de um envio bem-sucedido, pra montar a CTA de
  // WhatsApp contextual da tela de sucesso (nome na mensagem) e correlacionar
  // o clique com o mesmo lead no Mongo (ver app/api/orcamento/whatsapp).
  const [nomeEnviado, setNomeEnviado] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);

  useEffect(() => {
    function abrir() {
      setEstado((atual) => (atual === "fechado" ? "aberto" : atual));
    }
    // Cobre navegação vindo de outra página (ex.: /contato) já com #orcamento
    // na URL de chegada, quando este componente ainda nem existia para ouvir
    // o evento disparado antes da navegação.
    if (window.location.hash === "#orcamento") abrir();
    window.addEventListener("hashchange", abrir);
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => {
      window.removeEventListener("hashchange", abrir);
      window.removeEventListener(EVENTO_ABRIR, abrir);
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEstado("enviando");
    setErros({});
    setErroGeral("");

    const dados = new FormData(event.currentTarget);
    const payload = {
      nome: String(dados.get("nome") ?? ""),
      email: String(dados.get("email") ?? ""),
      telefone: String(dados.get("telefone") ?? ""),
      observacao: String(dados.get("observacao") ?? ""),
      // empresa: String(dados.get("empresa") ?? ""),
      // categoria: String(dados.get("categoria") ?? ""),
      attribution: obterAtribuicaoAtual(), // telemetria não-visível, ver lib/attribution.ts
    };

    try {
      const resposta = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const corpo = await resposta.json();

      if (!resposta.ok) {
        if (corpo.errors) setErros(corpo.errors);
        setErroGeral(corpo.error ?? "Não foi possível enviar sua solicitação agora.");
        setEstado("erro");
        return;
      }

      trackFormSubmit();
      setNomeEnviado(payload.nome);
      setLeadId(typeof corpo.leadId === "string" ? corpo.leadId : null);
      setEstado("sucesso");
    } catch {
      setErroGeral("Não foi possível enviar sua solicitação agora.");
      setEstado("erro");
    }
  }

  if (estado === "sucesso") {
    return (
      <div className={styles.sucessoBloco}>
        <div className={styles.sucesso}>
          <CheckCircle2 size={22} strokeWidth={2} aria-hidden="true" />
          <p>Recebemos sua solicitação. A engenharia responde em breve pelo e-mail ou WhatsApp informado.</p>
        </div>
        <WhatsAppLink
          className={styles.whatsappPosEnvio}
          mensagem={`Olá, sou ${nomeEnviado} e acabei de enviar o formulário de orçamento no site.`}
          onClick={() => {
            if (!leadId) return;
            // Fire-and-forget: o link já abre em nova aba, então não há risco
            // de a navegação cortar a chamada antes dela sair.
            fetch("/api/orcamento/whatsapp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId }),
              keepalive: true,
            }).catch(() => {});
          }}
        >
          Prefere agilizar agora? Fale com a engenharia pelo WhatsApp
        </WhatsAppLink>
      </div>
    );
  }

  if (estado === "fechado") {
    return (
      <button type="button" className={styles.trigger} onClick={() => setEstado("aberto")}>
        Solicitar Orçamento Técnico
        <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.campo}>
        <label htmlFor="orcamento-nome">Nome</label>
        <input id="orcamento-nome" name="nome" type="text" required minLength={2} autoComplete="name" />
        {erros.nome && <p className={styles.erroCampo}>{erros.nome[0]}</p>}
      </div>

      <div className={styles.campo}>
        <label htmlFor="orcamento-email">E-mail</label>
        <input id="orcamento-email" name="email" type="email" required autoComplete="email" />
        {erros.email && <p className={styles.erroCampo}>{erros.email[0]}</p>}
      </div>

      <div className={styles.campo}>
        <label htmlFor="orcamento-telefone">WhatsApp</label>
        <input
          id="orcamento-telefone"
          name="telefone"
          type="tel"
          required
          minLength={8}
          autoComplete="tel"
          placeholder="(41) 90000-0000"
        />
        {erros.telefone && <p className={styles.erroCampo}>{erros.telefone[0]}</p>}
      </div>

      <div className={styles.campo}>
        <label htmlFor="orcamento-observacao">Observação (opcional)</label>
        <textarea
          id="orcamento-observacao"
          name="observacao"
          rows={3}
          placeholder="Aplicação, prazo, restrição do projeto..."
        />
        {erros.observacao && <p className={styles.erroCampo}>{erros.observacao[0]}</p>}
      </div>

      {/* Campos completos, esperando validação comercial (lib/orcamento-schema.ts):
      <div className={styles.campo}>
        <label htmlFor="orcamento-empresa">Empresa</label>
        <input id="orcamento-empresa" name="empresa" type="text" autoComplete="organization" />
      </div>

      <div className={styles.campo}>
        <label htmlFor="orcamento-categoria">Tipo de produto</label>
        <select id="orcamento-categoria" name="categoria">
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.icone}>
              {produto.nome}
            </option>
          ))}
        </select>
      </div>
      */}

      {erroGeral && <p className={styles.erroGeral}>{erroGeral}</p>}

      <div className={styles.acoes}>
        <button type="submit" className={styles.enviar} disabled={estado === "enviando"}>
          {estado === "enviando" ? (
            <>
              <Loader2 size={18} strokeWidth={2} className={styles.spin} aria-hidden="true" />
              Enviando
            </>
          ) : (
            <>
              Enviar solicitação
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

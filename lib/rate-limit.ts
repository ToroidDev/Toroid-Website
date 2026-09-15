// Limitador em memória, por IP. Primeira camada de defesa contra flood nos
// endpoints públicos de formulário (orçamento / WhatsApp pós-envio).
//
// Limitação conhecida: o contador vive só na instância serverless que
// atendeu a requisição (mesmo padrão de globalThis do lib/mongodb.ts, pra
// sobreviver ao Fast Refresh em dev). Em produção, com múltiplas instâncias
// e regiões, um atacante distribuído pode contornar isso — a camada durável
// é o Vercel Firewall (rate_limit rule), que conta por IP na borda, entre
// todas as instâncias. Este limitador cobre o caso comum (um script batendo
// repetidamente de uma mesma conexão) enquanto isso não está configurado.

type Contador = { restantes: number; expiraEm: number };

const globalParaRateLimit = globalThis as unknown as {
  _rateLimitContadores?: Map<string, Contador>;
};

function contadores(): Map<string, Contador> {
  if (!globalParaRateLimit._rateLimitContadores) {
    globalParaRateLimit._rateLimitContadores = new Map();
  }
  return globalParaRateLimit._rateLimitContadores;
}

export function obterIpRequisicao(request: Request): string | null {
  const encaminhado = request.headers.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip");
}

/**
 * Janela fixa simples: `max` requisições por `janelaMs`, por `chave`.
 * Retorna true se a requisição pode prosseguir.
 */
export function permitirRequisicao(chave: string, janelaMs: number, max: number): boolean {
  const mapa = contadores();
  const agora = Date.now();
  const atual = mapa.get(chave);

  if (!atual || atual.expiraEm <= agora) {
    mapa.set(chave, { restantes: max - 1, expiraEm: agora + janelaMs });
    return true;
  }

  if (atual.restantes <= 0) return false;

  atual.restantes -= 1;
  return true;
}

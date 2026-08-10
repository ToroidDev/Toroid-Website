const FUNDACAO_ANO = 1994;
const FUNDACAO_MES = 5; // maio
const FUNDACAO_DIA = 1;

/**
 * Anos de mercado da Toroid, contados a partir da fundação (1º de maio de 1994).
 * O valor sobe automaticamente a cada aniversário, sem precisar de atualização manual.
 */
export function getAnosDeMercado(referencia: Date = new Date()): number {
  let anos = referencia.getFullYear() - FUNDACAO_ANO;

  const aniversarioJaPassouEsteAno =
    referencia.getMonth() + 1 > FUNDACAO_MES ||
    (referencia.getMonth() + 1 === FUNDACAO_MES && referencia.getDate() >= FUNDACAO_DIA);

  if (!aniversarioJaPassouEsteAno) {
    anos -= 1;
  }

  return anos;
}

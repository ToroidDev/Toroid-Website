import { SITE_URL, absoluteUrl } from "@/lib/seo";

// Chave do protocolo IndexNow (Bing, Yandex, Seznam e outros participantes).
// Não é segredo — o próprio protocolo exige publicá-la em texto puro em
// /{chave}.txt (ver public/c165dbaf002ee0026d2050be06dd83a8.txt) — por isso
// vive como constante aqui em vez de env var: uma env var poderia mudar sem
// o arquivo em public/ ser renomeado junto, quebrando a verificação.
const INDEXNOW_KEY = "c165dbaf002ee0026d2050be06dd83a8";
const INDEXNOW_KEY_LOCATION = absoluteUrl(`/${INDEXNOW_KEY}.txt`);

/**
 * Notifica os buscadores participantes do IndexNow que as URLs passadas
 * mudaram, em vez de esperar o crawler redescobrir sozinho. Best-effort,
 * fire-and-forget (ver uso com after() em app/api/revalidate/route.ts):
 * nunca deve derrubar quem chamou, só loga se falhar.
 */
export async function submitIndexNow(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  try {
    const resposta = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: paths.map(absoluteUrl),
      }),
    });
    if (!resposta.ok) {
      console.error(`IndexNow: resposta ${resposta.status} ao notificar`, paths);
    }
  } catch (erro) {
    console.error("IndexNow: falha ao notificar", erro);
  }
}

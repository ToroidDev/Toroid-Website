import { MongoClient, type MongoClientOptions } from "mongodb";

// mongodb precisa do runtime Node (sockets/TLS nativos), igual ao nodemailer.
// Ver app/api/orcamento/route.ts (export const runtime = "nodejs").

const OPCOES: MongoClientOptions = {
  // Falha rápido se o cluster estiver inacessível, em vez de travar até 30s
  // (default do driver). A escrita do lead é best-effort (ver route.ts) e não
  // pode segurar nada por muito tempo em segundo plano.
  serverSelectionTimeoutMS: 5000,
};

function criarClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI não configurada.");
  }
  return new MongoClient(uri, OPCOES).connect();
}

// Em dev, o Next recria módulos a cada Fast Refresh, o que recriaria o
// MongoClient e esgotaria o pool de conexões do Atlas a cada save. Guardar a
// promise em globalThis sobrevive ao hot-reload; em produção (serverless), o
// mesmo cache mantém a conexão viva entre invocações de uma instância já
// quente, evitando reconectar a cada request.
const globalParaMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getMongoClientPromise(): Promise<MongoClient> {
  if (!globalParaMongo._mongoClientPromise) {
    globalParaMongo._mongoClientPromise = criarClientPromise();
  }
  return globalParaMongo._mongoClientPromise;
}

export async function getDb(nomeBanco = "toroid") {
  const client = await getMongoClientPromise();
  return client.db(nomeBanco);
}

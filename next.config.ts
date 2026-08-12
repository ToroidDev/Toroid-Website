/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // remove o header X-Powered-By, não expõe stack, ganho mínimo mas gratuito
  compress: true,

  // O driver do mongodb tenta resolver dependências nativas opcionais
  // (kerberos, snappy, aws4 etc.) que não estão instaladas; isso evita o
  // bundler do servidor tentar empacotar essas.
  serverExternalPackages: ['mongodb'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'toroid.com.br',
        pathname: '/wp-content/uploads/**',
      },
      // Se a hospedagem servir mídia por CDN ou subdomínio próprio, duplicar o bloco acima
      // trocando hostname, ex.: { protocol: 'https', hostname: 'media.toroid.com.br', pathname: '/**' }
      // CONFIRMAR isso testando a URL de uma imagem de produto real do WP antes de assumir.
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias, imagem de produto não muda a cada deploy
  },

  async headers() {
    return [
      {
        // assets estáticos gerados pelo Next (JS/CSS com hash no nome): cache máximo seguro
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // imagens servidas diretamente da pasta /public do projeto (logo, ícones fixos)
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Redirecionamentos 301 da migração do WordPress antigo.
  // Popular esta lista durante a Semana 3 (mapa de redirecionamento), a partir
  // do export completo de URLs indexadas no Search Console. Nenhuma URL antiga
  // pode ficar de fora: é o que preserva o histórico de SEO e a continuidade
  // das campanhas de Google Ads ativas.
  async redirects() {
    return [
      {
        source: '/transformador-de-corrente',
        destination: '/produtos/transformadores-de-corrente',
        permanent: true,
      },
      {
        source: '/transformadores-toroidais',
        destination: '/produtos/transformadores-toroidais',
        permanent: true,
      },
      // adicionar cada URL antiga → nova aqui, uma por linha, antes do go-live
    ];
  },
};

export default nextConfig;

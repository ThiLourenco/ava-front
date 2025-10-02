// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione esta configuração de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**', // Permite qualquer caminho dentro desse domínio
      },
    ],
  },
};

module.exports = nextConfig;
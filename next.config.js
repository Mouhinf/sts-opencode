/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration de base pour éviter les erreurs
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  poweredByHeader: false,
}

module.exports = nextConfig
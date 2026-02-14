/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Configuración de imágenes (si las usas en el futuro)
  images: {
    unoptimized: true,
  },

  // Configuración para API (proxy al backend en desarrollo)
  async rewrites() {
    // Solo aplicar rewrites en desarrollo
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3000/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

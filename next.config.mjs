/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.devtunnels.ms',
        '*.inc1.devtunnels.ms', 
        '*.ngrok-free.app'
      ],
    },
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yupgvbmkactabvteksca.supabase.co',
      },
    ],
    unoptimized: process.env.NETLIFY === 'true',
  },
  // Netlify対応
  output: process.env.NETLIFY === 'true' ? 'standalone' : undefined,
  // 大容量ファイルアップロード対応
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

module.exports = nextConfig


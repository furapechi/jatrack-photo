/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yupgvbmkactabvteksca.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig


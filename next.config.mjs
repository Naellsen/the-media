/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
      { protocol: "https", hostname: "comicvine.gamespot.com" },
      { protocol: "https", hostname: "static.comicvine.com" },
    ],
  },
};

export default nextConfig;
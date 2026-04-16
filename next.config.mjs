/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "booksy.com" },
      { protocol: "https", hostname: "images.booksy.com" },
      { protocol: "https", hostname: "thumbs.booksy.com" },
    ],
  },
};

export default nextConfig;

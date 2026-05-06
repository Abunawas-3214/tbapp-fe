/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  allowedDevOrigins: ["tbapp.dev", "*.tbapp.dev"]
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  allowedDevOrigins: ["tbapp.test", "*.tbapp.test"]
}

export default nextConfig

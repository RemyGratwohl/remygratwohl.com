/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.steamstatic.com',
                port: '',
            }
        ]
    }
};

export default nextConfig;

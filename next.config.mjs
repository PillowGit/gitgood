/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GITHUB_ID: process.env.GITHUB_ID,
        GITHUB_SECRET: process.env.GITHUB_SECRET,
    },
};

export default nextConfig;
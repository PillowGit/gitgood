/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;


module.exports  = {
    ...nextConfig,
    enf: {
        GITHUB_ID: process.env.GITHUB_ID,
        GITHUB_SECRET: process.env.GITHUB_SECRET,
    },
}

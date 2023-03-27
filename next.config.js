/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            destination: "http://st-im-next-swimtogether.app.secoder.net/:path*",
        }];
    }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*", //当接口来源是这个开头，下面的所有路径就会转到destination 目标地址,其中:path*会匹配源路径对应的路径片段
        destination: "https://mock.apifox.cn/m1/2398938-0-default/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

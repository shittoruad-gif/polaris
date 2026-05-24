/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
};

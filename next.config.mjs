/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
            port: '',
            pathname: '/photos/20194382/pexels-photo-20194382/**',
          },
          {
            protocol: 'https',
            hostname: 'www.shutterstock.com',
            port: '',
            pathname: '/shutterstock/photos/2327324779/display_1500/**',
          },
          {
            protocol: 'https',
            hostname: 'aslamzaman.github.io',
            port: '',
            pathname: '/photogalary/Disadvantage/**',
          },
        ],
      },
};

export default nextConfig;

const { withFederatedSidecar } = require('@module-federation/nextjs-ssr');
const withPlugins = require('next-compose-plugins');

const name = 'home';
const exposes = {
  './home': './real-pages/index.tsx',
  './login': './real-pages/login/login.tsx',
  './pages-map': './pages-map.ts',
};
// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = (isServer) => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    shell: process.env.VERCEL_URL
    ? `shell@https://module-federation-nextjs-ssr-example.vercel.app/_next/static/${location}/remoteEntry.js?`
    : `shell@http://localhost:3000/_next/static/${location}/remoteEntry.js?`,
    home: process.env.VERCEL_URL
    ? `home@https://module-federation-nextjs-ssr-home.vercel.app/_next/static/${location}/remoteEntry.js?`
    : `home@http://localhost:3001/_next/static/${location}/remoteEntry.js?`,
    ui: process.env.VERCEL_URL
    ? `ui@https://module-federation-nextjs-ssr-ui.vercel.app/_next/static/${location}/remoteEntry.js?`
    : `ui@http://localhost:3003/_next/static/${location}/remoteEntry.js?`,
  };
};

const nextConfig = {

  compiler: {
    styledComponents: true
  },

  env: {
    VERCEL: process.env.VERCEL,
    VERCEL_URL: process.env.VERCEL_URL
  },

  webpack(config) {
    config.module.rules.push({
      test: /_app.tsx/,
      loader: '@module-federation/nextjs-ssr/lib/federation-loader.js',
    });

    return config;
  },
};

module.exports = withPlugins(
  [
    withFederatedSidecar({
      name: name,
      filename: 'static/chunks/remoteEntry.js',
      exposes: exposes,
      remotes: remotes,
      shared: {
        lodash: {
          import: "lodash",
          requiredVersion: require("lodash").version,
          singleton: true,
        },
        react: {
          requiredVersion: false,
          singleton: true,
        },
        // '@chakra-ui/react': {
        //   requiredVersion: false,
        //   singleton: true,
        // },
        // '@chakra-ui/server': {
        //   requiredVersion: false,
        //   singleton: true,
        // },
        // '@chakra-ui/theme-tools': {
        //   requiredVersion: false,
        //   singleton: true,
        // },
        // '@chakra-ui/icons': {
        //   requiredVersion: false,
        //   singleton: true,
        // },
        // '@emotion/react': {
        //   requiredVersion: false,
        //   singleton: true,
        // },
        // '@emotion/styled': {
        //   requiredVersion: false,
        //   singleton: true,
        // },
        // 'framer-motion': {
        //   requiredVersion: false,
        //   singleton: true,
        // },
        // sass: {
        //   requiredVersion: false,
        //   singleton: true,
        // },
      },
    },
    {
      experiments: {
        flushChunks: true,
        hot: true,
      },
    }),
  ],
  nextConfig
);

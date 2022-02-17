const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: require.resolve("@module-federation/nextjs-ssr/lib/noop.js"),
  target: "node",
  mode: "development",
  devtool: "hidden-source-map",
  output: {
    path: path.resolve(".next/cache"),
  },
  externals: ["next"],
  resolve: {
    extensions: [
      ".jsx",
      ".js",
      ".json",
      ".css",
      ".scss",
      ".jpg",
      "jpeg",
      "png",
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "hostContainer",
      filename: "remoteEntry.js",
      library: { type: "commonjs" },
      exposes: {
        "./serverContainer": "./serverContainer.js",
      },
    }),
  ],
};
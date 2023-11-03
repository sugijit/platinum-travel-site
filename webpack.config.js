const path = require("path");
const postCSSPlugins = [
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

module.exports = {
  entry: "./app/assets/scripts/App.js",
  output: {
    filename: "bundled.js",
    path: path.resolve(__dirname, "app"),
  },
  devServer: {
    static: {
      onBeforeSetupMiddleware: function (app, server) {
        server._watch("./app/**/*.html");
      },
    },
    static: "./app",
    hot: true,
    port: 3000,
    host: "0.0.0.0",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
    ],
  },
};

const currentTask = process.env.npm_lifecycle_event;
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const postCSSPlugins = [
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy Images", function () {
      fse.copySync("./app/assets/images", "./docs/assets/images");
    });
  }
}

let cssConfig = {
  test: /\.css$/,
  use: [
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
};

let pages = fse
  .readdirSync("./app")
  .filter(function (file) {
    return file.endsWith(".html");
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`,
    });
  });

let config = {
  entry: "./app/assets/scripts/App.js",
  plugins: pages,
  module: {
    rules: [cssConfig],
  },
};

if (currentTask == "dev") {
  cssConfig.use.unshift("style-loader");
  (config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "app"),
  }),
    (config.devServer = {
      static: {
        onBeforeSetupMiddleware: function (app, server) {
          server._watch("./app/**/*.html");
        },
      },
      static: "./app",
      hot: true,
      port: 3000,
      host: "0.0.0.0",
    }),
    (config.mode = "development");
}

if (currentTask == "build") {
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  });
  cssConfig.use.unshift(miniCssExtractPlugin.loader);
  (config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "docs"),
  }),
    (config.mode = "production");
  config.optimization = {
    splitChunks: {
      chunks: "all",
    },
  };
  config.plugins.push(
    new CleanWebpackPlugin(),
    new miniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
    new RunAfterCompile()
  );
}

module.exports = config;

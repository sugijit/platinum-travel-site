/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require("autoprefixer"),
    require("postcss-nested"),
    require("postcss-simple-vars"),
    require("postcss-import"),
    require("postcss-mixins"),
  ],
};

module.exports = config;

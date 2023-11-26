/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require("autoprefixer"),
    require("postcss-nested"),
    require("postcss-simple-vars"),
    require("postcss-import"),
    require("postcss-mixins"),
    require("postcss-hexrgba"),
    require("cssnano"),
  ],
};

module.exports = config;

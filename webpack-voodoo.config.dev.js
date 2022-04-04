const common = require('./webpack.common');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("html-replace-webpack-plugin");

module.exports = {
  mode: 'development',
  devServer: { port: 3000 },
  devtool: 'inline-source-map',
  resolve: common.resolve,
  entry: common.entry,
  output: common.output,
  module: {
    rules: [
      common.rules.creativeImages,
      common.rules.images,
      common.rules.models,
      common.rules.data,
      common.rules.sounds,
      common.rules.fonts,
    ]
  },
  plugins: [
    common.plugins.definePlugin('voodoo_dev'),
    new HtmlWebpackPlugin({ template: './static/voodoo.html.ejs', filename: 'index.html', inject: 'head' }),
    common.plugins.replace,
    new HtmlReplaceWebpackPlugin([{ pattern: '__USE_DEV_MODE__', replacement: true },]),
  ]
};

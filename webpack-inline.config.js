const common = require('./webpack.common');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("html-replace-webpack-plugin");

module.exports = {
  mode: 'production',
  resolve: common.resolve,
  performance: common.performance,
  entry: common.entry,
  output: common.output,
  module: {
    rules: [
      common.rules.strip,
      //common.rules.inlineCreativeImages,
      common.rules.inlineCreativeImagesOpt,
      common.rules.inlineFonts,
      common.rules.inlineModels,
      common.rules.inlineSounds,
      common.rules.inlineData,
      //common.rules.inlineImages,
      common.rules.inlineImagesOpt,
      common.rules.babel
    ],
  },
  stats: common.stats,
  plugins: [
    common.plugins.definePlugin('voodoo_dev'),
    common.plugins.inlineHtmlWebpack('./voodoo.html.ejs', 'inlined.html'),
    common.plugins.replace,
    new HtmlReplaceWebpackPlugin([{ pattern: '__USE_DEV_MODE__', replacement: true },]),
    common.plugins.inlineSouce,
    common.plugins.removeJs]
};

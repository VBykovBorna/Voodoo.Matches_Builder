const path = require('path');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("html-replace-webpack-plugin");
const generate = require('generate-file-webpack-plugin');
const fs = require('fs');
const creativeConfig = require('./creative-config').config;

module.exports = {
  mode: 'production',
  devtool: false,
  entry: common.entry,
  output: common.output,
  resolve: common.resolve,
  performance: common.performance,
  module: {
    rules: [
      common.rules.strip,
      common.rules.inlineCreativeImagesOpt,
      common.rules.inlineFonts,
      common.rules.inlineModels,
      common.rules.inlineSounds,
      common.rules.inlineData,
      common.rules.inlineImagesOpt,
      common.rules.babel,
    ],
  },

  stats: common.stats,
  plugins: [
    generate({
      file: 'template.ice',
      content: () => {
        let data = '';

        const html = fs.readFileSync(path.resolve(__dirname, './public/ice-template-parts/ice-template.html').toString());
        const js = fs.readFileSync(path.resolve(__dirname, './public/ice-template-parts/ice-template.js').toString());
        const styles = fs.readFileSync(path.resolve(__dirname, './public/ice-template-parts/ice-template-styles.html').toString());
        const json = fs.readFileSync(path.resolve(__dirname, './public/ice-template-parts/ice-template.json').toString());

        data += html;
        data += `<script>\n`;

        let jsonData = JSON.parse(json);

        data += 'window._gameplay= {};\nwindow._gameplay.creative = {}\nwindow._gameplayEndLevel = {}\n';

        for (let prop in creativeConfig.creative) {
          data += `window._gameplay.creative.${prop} = "{{creative.${prop}}}"\n`;
          jsonData.creative[`${prop}`] = creativeConfig.creative[prop];
        }

        data += '\n';
        for (let prop in creativeConfig.endLevel) {
          data += `window._gameplayEndLevel.${prop} = "{{endLevel.${prop}}}"\n`;
          jsonData.endLevel[`${prop}`] = creativeConfig.endLevel[prop];
        }

        jsonData.general.name.value = creativeConfig.projectName;
        jsonData.general.ios.value = creativeConfig.appStoreUrl;
        jsonData.general.android.value = creativeConfig.googlePlayStoreUrl;

        data += js;
        data += `</script>`;
        data += styles;
        data += '<config>';
        data += JSON.stringify(jsonData, null, 2);
        data += '</config>';

        return data;
      }
    }),
    common.plugins.definePlugin('voodoo'),
    new HtmlWebpackPlugin({
      template: `./static/${'voodoo.html.ejs'}`, filename: 'builder.html', inject: false,
      minify: {
        removeComments: false,
        minifyJS: false
      }
    }),
    common.plugins.replace,
    new HtmlReplaceWebpackPlugin([{pattern: '__USE_DEV_MODE__', replacement: false},]),
  ]
};

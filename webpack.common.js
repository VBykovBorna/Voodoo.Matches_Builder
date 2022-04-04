const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin-x');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const creativeConfig = require('./creative-config').config;
const assetsResolve = path.resolve(__dirname, 'assets/');
const inlineResolve = path.resolve(__dirname, 'static/');

const inlineCompressOptions = {
  inline: { limit: true },
  compress: { pngquant: { quality: [0.6, 0.8], }, svgo: true, mozjpeg: { progressive: true, quality: 60, } }
};

const compressOptions = {
  inline: { limit: false },
  compress: { pngquant: { quality: [0.6, 0.8], }, svgo: true, mozjpeg: { progressive: true, quality: 60, } },
  name: 'assets/[name].[contenthash:8].[ext]'
};

const formatImages = /\.(png|jpe?g|svg)$/i;
const formatModels = /\.(glb)$/i;
const formatSounds = /\.(mp3)$/i;
const formatData = /\.(json)$/i;
const formatFonts = /\.(tff|woff(2)?)$/i;

const strip = ['Debug.isNumber', 'Debug.assert', 'Debug.assertWarn', 'Debug.assertInfo', 'Debug.log', 'Debug.info', 'Debug.warn', 'Debug.error', 'Debug.time', 'Debug.timeEnd', 'console.log'];
const stripString = 'strip[]=' + strip.join(',strip[]=');

module.exports = {
  resolve: { alias: { assets: `${__dirname}/assets/`, js: `${__dirname}/js/`, }, mainFields: ['main'] },
  performance: { hints: false, maxEntrypointSize: 512000, maxAssetSize: 512000 },
  entry: { code: ['babel-polyfill', './js/main.js'] },
  output: { path: `${__dirname}/dist`, filename: '[name].js', publicPath: '/', assetModuleFilename: 'assets/[name][hash:8][ext]' },
  stats: 'minimal',
  rules: {
    // strip debug
    strip: { test: /\.js$/, use: [{loader: `webpack-strip?${stripString}`}] },

    // regular
    creativeImages: { test: formatImages, type: 'asset/resource', include: [inlineResolve] },
    images: { test: formatImages, type: 'asset/resource', include: [assetsResolve] },
    models: { test: formatModels, type: 'asset/resource', include: [assetsResolve] },
    data: { test: formatData, type: 'asset/resource', include: [assetsResolve] },
    sounds: { test: formatSounds, type: 'asset/resource', include: [assetsResolve] },
    fonts: { test: formatFonts, type: 'asset/resource', include: [assetsResolve] },

    creativeImagesOpt: { test: formatImages, include: [inlineResolve], use: [{ loader: 'img-optimize-loader', options: compressOptions }] },
    imagesOpt: { test: formatImages, include: [assetsResolve], use: [{ loader: 'img-optimize-loader', options: compressOptions }] },

    // inline
    inlineCreativeImages: { test: formatImages, type: 'asset/inline', include: [inlineResolve] },
    inlineImages: { test: formatImages, type: 'asset/inline', include: [assetsResolve] },
    inlineModels: { test: formatModels, type: 'asset/inline', include: [assetsResolve] },
    inlineData: { test: formatData, type: 'asset/inline', include: [assetsResolve] },
    inlineSounds: { test: formatSounds, type: 'asset/inline', include: [assetsResolve] },
    inlineFonts: { test: formatFonts, type: 'asset/inline', include: [assetsResolve] },

    // optimized
    inlineCreativeImagesOpt: { test: formatImages, include: [inlineResolve], use: [{ loader: 'img-optimize-loader', options: inlineCompressOptions }] },
    inlineImagesOpt: { test: formatImages, include: [assetsResolve], use: [{ loader: 'img-optimize-loader', options: inlineCompressOptions }] },
    babel: {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          cacheDirectory: true,
          targets: '> 1%',
          plugins: ['@babel/plugin-transform-template-literals', '@babel/plugin-proposal-optional-chaining'],
        }
      },
    }
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ parallel: true })],
  },
  plugins: {
    definePlugin: (partner) => { return new webpack.DefinePlugin({ __PARTNER__: JSON.stringify(partner) }); },
    htmlWebpack: new HtmlWebpackPlugin({ template: './static/index.html.ejs', filename: 'index.html', inject: 'body' }),
    //html: new HTMLPlugin({ template: './static/index.html.ejs', inject: 'body' }),
    inlineHtmlWebpack: (template, filename) => { return new HtmlWebpackPlugin({ template: `./static/${template}`, filename: filename, inject: 'body', inlineSource: '.(js|css)$', }); },
    inlineSouce: new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
    replace: new HtmlReplaceWebpackPlugin([{ pattern: '__CONFIG__', replacement: JSON.stringify(creativeConfig, null, 2) },]),
    removeJs: new RemovePlugin({ after: { root: './dist', test: [{ folder: '.', method: (absoluteItemPath) => { return new RegExp(/\.(js|txt)$/i, 'm').test(absoluteItemPath); } }], log: false, } })
  }
};

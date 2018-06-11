const ArcGISPlugin = require("@arcgis/webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SWPrecache = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require("path");
const webpack = require("webpack");

var prodPlugins =
  [
    new SWPrecache({
      cacheId: 'esri-preact-pwa',
      minify: true,
      filename: 'sw.js',
      dontCacheBustUrlsMatching: /./,
      navigateFallback: 'index.html',
      staticFileGlobsIgnorePatterns: [/\.map$/],
      runtimeCaching: [
        {
          // JSAPI scripts
          urlPattern: new RegExp("https://js.arcgis.com/4.7/esri/css/main.css"),
          handler: "fastest"
        },
        {
          // urlPattern: new RegExp("https://services.arcgisonline.com/ArcGIS/rest/services/"),
          // basemap tiles
          urlPattern: new RegExp("https://b.tile.openstreetmap.org/"),
          handler: "fastest"
        }
      ]
    })
  ]
module.exports = env => {
  const isProd = env && env.production;
  var plugins = [
    new CleanWebpackPlugin(["dist"]),
    new CopyWebpackPlugin([
      { context: './src/static/', from: '**/*.*' }
    ]),
    new ArcGISPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      chunksSortMode: "none"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ];
  if (isProd)
    plugins = plugins.concat(prodPlugins);
  return {
    entry: {
      index: "./src/index.tsx"
    },
    output: {
      filename: "[name].bundle.js",
      publicPath: ""
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: false }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader?-minimize", "sass-loader"]
        }
      ]
    },
    devtool: !isProd && 'source-map',
    plugins: plugins,
    resolve: {
      modules: [path.resolve(__dirname, "/src"), "node_modules/"],
      extensions: [".ts", ".tsx", ".js", ".scss"]
    },
    externals: [
      (context, request, callback) => {
        if (/pe-wasm$/.test(request)) {
          return callback(null, "amd " + request);
        }
        callback();
      }
    ],
    node: {
      process: false,
      global: false
    },
    devServer: {
      port: 4000,
      historyApiFallback: true
    }
  };
};

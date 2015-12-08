'use strict';

var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  debug: true,
  watch: true,
  devtool: 'source-map',
  entry: {
    //'index.ios': ['./src/main.ios.js'],
    //'index.android': ['./src/main.android.js'],
    'index.web': ['./src/main.web.js'],
  },
  output: {
    path: path.resolve(__dirname, 'web/dist/public/js'),
    filename: '[name].js',
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx|es6)$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      {
        test: /\.(js|jsx|es6|)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          optional: ['runtime'],
          stage: 0,
        },
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'sass-loader']),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('../css/components.css', {
      allChunks: true,
    }),
  ],
};

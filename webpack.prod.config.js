#!/usr/bin/env node
/**
 * @File   : webpack.dev.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-4 16:50:35
 * @Link: dtysky.moe
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const outPath = path.resolve(__dirname, './dist');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.tsx'),
    'react-packet': ['react', 'react-dom', 'react-router']
  },

  output: {
    path: outPath,
    filename: '[name].[hash].js',
    publicPath: 'https://dtysky.github.io/WhenMonIsntHome/'
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".md"],
  },

  externals: {
    'fs': true,
    'path': true,
  },
  
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader"
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        }),
      },
      {
        test: /\.(md|glsl)$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|mp4|mp3)$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 1000,
            name: 'assets/[name].[hash].[ext]'
          }
        }
      },
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin(
      ['*'],
      {root: outPath}
    ),
    new ExtractTextPlugin({
      filename: 'main.[hash].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['react-packet'],
      minChunks: 2
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    // new CompressionWebpackPlugin({
    //   asset: "[path]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // })
  ]
};

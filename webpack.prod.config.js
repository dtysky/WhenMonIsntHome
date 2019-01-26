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

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.tsx'),
    'react-packet': ['react', 'react-dom', 'react-router']
  },

  output: {
    path: outPath,
    filename: 'assets/[name].[hash].js',
    chunkFilename: 'assets/[name].chunk.[hash].js',
    publicPath: '/'
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
        test: /\.(png|jpg|gif|svg|mp4)$/,
        exclude: /gltf/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 1000,
            context: path.resolve(__dirname, 'src/collection'),
            name: 'assets/[path][name].[ext]'
          }
        }
      },
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader'
        }
      },
      {
        // here I match only IMAGE and BIN files under the gltf folder
        test: /\.(bin|png|jpe?g|gif)$/,
        // or use url-loader if you would like to embed images in the source gltf
        use: {
          loader: 'file-loader',
          options: {
            // output folder for bin and image files, configure as needed
            name: 'assets/[name].[hash].[ext]'
          }
        }
      }
      // end GLTF configuration
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true)
      }
    }),
    new CleanWebpackPlugin(
      ['*'],
      {root: outPath}
    ),
    new ExtractTextPlugin({
      filename: 'assets/main.[hash].css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['react-packet'],
      minChunks: 2
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CompressionWebpackPlugin({
      asset: "[path]",
      algorithm: "gzip",
      test: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};

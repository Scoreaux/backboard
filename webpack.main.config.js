const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

const alias = require('./webpack.alias');

module.exports = (env, argv) => {

  // Create initial config object with options shared in both development and
  // production environments
  const config = {
    mode: argv.mode || 'development',
    target: 'electron-main',
    context: path.resolve(__dirname, 'src'),
    entry: './main/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: '/node_modules/',
          use: {
            loader: 'babel-loader'
          }
        },
      ]
    },
    resolve: {
      alias,
    },
    node: {
      __dirname: false,
      __filename: false,
    },
  };

  if (argv.mode === 'production') {
    // Make production specific changes to config
    console.log('Running in PRODUCTION mode');
  } else {
    console.log('Running in DEVELOPMENT mode');
    // Make development specific changes to config
  }

  return config;
};

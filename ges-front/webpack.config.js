const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack');


module.exports = {
  entry: './src/index.js',
  plugins: [
    new NodePolyfillPlugin()
],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      os: require.resolve('os-browserify/browser'),
      https: require.resolve('https-browserify'),
      querystring: require.resolve('querystring-es3'),
      fs: false,
      net: false,
      tls: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      
      
    ],
  },
};

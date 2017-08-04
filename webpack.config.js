

const webpack = require('webpack');

module.exports = {
  entry: {
    app: './js/app.js',
    vendor: ['react', 'react-dom', 'whatwg-fetch', 'react-bootstrap', 'babel-polyfill', 'react-router',
      'react-router-bootstrap', 'react-router-dom'],
  },
  output: {
    path: 'C:\\Users\\Chris\\Documents\\WebDev\\NightFlight\\static',
    filename: 'app.bundle.js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js'})
  ],
  devServer: {
    port: 8080,
    contentBase: 'static',
    proxy: {
      '/': {
        target: 'http://localhost:3000',
      },
    },
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader'],
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      }
    ],
  },
  node: {
   fs: "empty",
   console: true,
   net: 'empty',
   tls: 'empty'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  }
};

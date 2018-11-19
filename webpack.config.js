const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', './app/public/src/js/app.js'],
  output: {
    path: path.resolve(__dirname, './app/public/dist'),
    filename: 'js/bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './app/public/dist'),
    watchContentBase: true,
    proxy: [
      {
        context: ['/api'],  
        target: 'http://localhost:8080', 
        secure: false,
      },
    ],
    port: 3000,
  //   historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './app/public/src/index.html'
    })
    // new webpack.HotModuleReplacementPlugin({
    //   multiStep: true
    // })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
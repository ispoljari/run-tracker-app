const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', './app/public/src/js/app.js'],
  output: {
    path: path.resolve(__dirname, './app/public/dist'),
    filename: 'js/bundle.js'
  },
  // devServer: {
  //   contentBase: path.resolve(__dirname, './app/public/dist'),
  //   historyApiFallback: true,
  //   hot: true,
  //   inline: true,
  
  //   host: 'localhost', // Defaults to `localhost`
  //   port: 3000, // Defaults to 8080
  //   proxy: {
  //     '^/api/*': {
  //       target: 'http://localhost:8080/api/',
  //       secure: false
  //     }
  //   }
  // },
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
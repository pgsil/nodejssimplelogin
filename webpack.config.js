
var webpack = require('webpack');

module.exports = {
  entry: __dirname + '/client/main.js',
  module: {
       loaders: [{
           test: /\.js$/,
           exclude: /node_modules/,
           loader: 'babel-loader'
       }]
   },
  output: {
    path: __dirname + '/src/static/',
    filename: 'bundle.js'
  },
  devServer: { inline: true }
}

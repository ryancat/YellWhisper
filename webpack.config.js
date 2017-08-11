var path = require('path')
var webpack = require('webpack')
// var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
  entry: path.resolve(__dirname, 'src/YellWhisper.js'),
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'YellWhisper.js'
  },
  devtool: 'cheap-source-map',
  watch: true,
  plugins: [
    definePlugin
  ],
  module: {
    rules: [
      // Javascript
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [path.join(__dirname, 'src')]
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js']
  }
}

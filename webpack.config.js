const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const outputPath = path.resolve(__dirname, 'docs');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path: outputPath,
    clean: true,
  },

  devtool: 'inline-source-map',
  devServer: {
    contentBase: outputPath,
    openPage: './',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

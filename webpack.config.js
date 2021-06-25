const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path: outputPath,
    clean: true,
  },

  devtool: 'eval-source-map',
  devServer: {
    // ディレクトリを指定（必要）
    contentBase: outputPath,
    // 開くファイル（index.html を開く）
    openPage: './',
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
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
      // ビルド対象の HTML ファイル
      template: './src/index.html',
      // 出力ファイル名
      filename: 'index.html',
    }),
  ],
  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  // フロントエンドの開発では拡張子を省略することが多いので、
  // 記載したほうがトラブルに巻き込まれにくい。
  resolve: {
    // 拡張子を配列で指定
    extensions: ['.ts', '.js'],
  },
};

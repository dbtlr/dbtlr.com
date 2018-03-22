
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Constant with our paths
const paths = {
  dist: path.resolve(__dirname, 'dist'),
  src: path.resolve(__dirname, 'src')
};

const extractSCSS = new ExtractTextPlugin({
  filename: 'styles.css',
  allChunks: true
});

// Webpack configuration
module.exports = {
  entry: [
    path.join(paths.src, 'index.js')
  ],

  output: {
    path: paths.dist
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        use: extractSCSS.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }]
        })
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|ico|txt)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ],
      }
    ]
  },

  plugins: [
    extractSCSS,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(paths.src, 'pages/index.html')
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(paths.src, 'pages/404.html')
    })
  ]
};

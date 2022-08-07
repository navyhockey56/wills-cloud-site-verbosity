const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // devtool: "inline-source-map", // Uncomment me if you need to debug the bundled output
  output: {
    filename: '[chunkhash].js',
    path: path.resolve( __dirname, '..', 'dist'),
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin({ parallel: true })]
  // }
};

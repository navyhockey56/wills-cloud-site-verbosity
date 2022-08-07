const path = require('path');

module.exports = {
  // devtool: "inline-source-map", // Uncomment me if you need to debug the bundled output
  output: {
    filename: '[chunkhash].js',
    path: path.resolve( __dirname, '..', 'dist')
  }
};

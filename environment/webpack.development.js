const PORT = process.env.PORT || 3000;

module.exports = {
  devtool: "inline-source-map",
  output: {
    filename: 'main.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    proxy: { // Proxy requests to the BFF
      '/api/*': `http://localhost:${PORT}`
    }
  }
};

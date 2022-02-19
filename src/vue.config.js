module.exports = {
  outputDir:'../backend/public',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Vue Starter',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  }
}

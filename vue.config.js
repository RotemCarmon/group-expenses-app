const options = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Group Expenses',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  }
}

module.exports = options
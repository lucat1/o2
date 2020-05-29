const { join } = require('path')

module.exports = function({ config, target, mode }) {
  config.module.rules.push({
    test: /\.(woff2)$/i,
    loader: 'file-loader',
    options: {
      // set a static public path so that both the client
      // and the server can have the same url for the file
      publicPath: join('__quercia', 'client')
    }
  })

  if (target === 'client') {
    // for production use `preact` instead of `react` to save bytes
    if (mode === 'production') {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': 'preact/compat',
        'react-dom': 'preact/compat'
      }
    }
  }

  return config
}

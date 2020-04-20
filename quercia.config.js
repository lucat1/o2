module.exports = function ({ config, isServer, mode }) {
  // for production use `preact` instead of `react` to save bytes

  if (!isServer && mode === 'production') {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'react': 'preact/compat',
        'react-dom': 'preact/compat'
      }
    }
  }

  return config
}

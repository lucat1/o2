module.exports = function ({ config, target, mode }) {
  // for production use `preact` instead of `react` to save bytes

  if (target === 'client' && mode === 'production') {
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

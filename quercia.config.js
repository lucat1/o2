module.exports = function({ config, target, mode }) {
  if (target === 'client') {
    // for production use `preact` instead of `react` to save bytes
    if (mode === 'production') {
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          'react': 'preact/compat',
          'react-dom': 'preact/compat'
        }
      }
    }
  }

  return config
}

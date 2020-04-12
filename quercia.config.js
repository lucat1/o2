module.exports = function ({ config, isServer, mode }) {
  config.resolve = {
    ...config.resolve,
    // Add `.ts` and `.tsx` as a resolvable extension
    extensions: ['.ts', '.tsx', '.js']
  }

  config.module = {
    rules: [
      {
        test: /.(ts|tsx)$/,
        loader: 'ts-loader'
      }
    ]
  }

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

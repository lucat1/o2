module.exports = function ({ config, isServer }) {
  config.resolve = {
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

  return config
}

module.exports = function({ config, target, mode }) {
  if (target === 'client') {
    // include goober in the vendor module as it's used in all pages
    config.optimization.splitChunks.cacheGroups.vendor.test = /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|object-assign|preact|@quercia\/(quercia|cli)|core-js|babel-plugin-transform-async-to-promises|react-hot-loader|@hot-loader|html-entities|goober)[\\/]/

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

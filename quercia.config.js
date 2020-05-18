const { join } = require('path')
var nodeExternals = require('webpack-node-externals')

module.exports = function({ config, target, mode }) {
  if (target === 'client') {
    // include styled-system and @emotion in the vendor module as they're used in all pages
    config.optimization.splitChunks.cacheGroups.vendor.test = /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|object-assign|preact|@quercia\/(quercia|cli)|core-js|babel-plugin-transform-async-to-promises|react-hot-loader|@hot-loader|html-entities|@styled-system|styled-system|@emotion\/*|reflexbox|rebass)[\\/]/

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

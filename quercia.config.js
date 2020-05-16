const { join } = require('path')
var nodeExternals = require('webpack-node-externals')

module.exports = function({ config, target, mode }) {
  const styled = join(__dirname, 'compat', 'styled-base')
  const css = join(__dirname, 'compat', 'css')
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@emotion/styled-base': styled,
      '@emotion/css': css
    }
  }

  // remove all-node-modules-externals feature
  // we do this to polyfill emotion to goober also in the backend
  if (target === 'server') {
    console.log('changing')
    config.externals = [
      config.externals[0],
      nodeExternals({
        whitelist: [
          'reflexbox',
          'rebass',
          '@emotion/styled',
          '@emotion/styled-base',
          '@emotion/css'
        ]
      })
    ]
  }

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

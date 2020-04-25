const { renderToStaticMarkup } = require('react-dom/server')
const { createElement } = require('react')

console.log(
  renderToStaticMarkup(
    createElement(
      'p',
      null,
      createElement('div', { style: { width: '15em', height: '1.2em' } })
    )
  )
)

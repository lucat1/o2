// majority for the code is take from:
// https://github.com/commit-intl/micro-down/blob/master/src/index.js
// and tweaked for the usage in a react renderer

export const tag = (
  tag: string,
  text: string,
  props?: { [key: string]: any }
) =>
  `<${tag +
    (props
      ? ' ' +
        Object.keys(props)
          .map(k => (props[k] ? `${k}="${encode(props[k]) || ''}"` : ''))
          .join(' ')
      : '')}>${text}</${tag}>`

/**
 * outdent all rows by first as reference
 */
export const outdent = text => {
  return text.replace(
    new RegExp('^' + (text.match(/^[^\s]?\s+/) || '')[0], 'gm'),
    ''
  )
}

/**
 * encode double quotes and HTML tags to entities
 */
export const encode = text => {
  return text
    ? text
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    : ''
}

/**
 * recursive list parser
 */
export const list = (text, temp) => {
  temp = text.match(/^[+-]/m) ? 'ul' : 'ol'
  return text
    ? `<${temp}>${text.replace(
        /(?:[+-]|\d+\.) +(.*)\n?(([ \t].*\n?)*)/g,
        (_, a, b) =>
          `<li>${inlineBlock(
            `${a}\n${outdent(b || '').replace(
              /(?:(^|\n)([+-]|\d+\.) +(.*(\n[ \t]+.*)*))+/g,
              list
            )}`
          )}</li>`
      )}</${temp}>`
    : ''
}

/**
 * function chain of replacements
 */
export const chain = (
  t: string,
  regex: string | RegExp,
  replacement: any,
  parser?
) => (match: string) => {
  match = match.replace(regex, replacement)
  return tag(t, parser ? parser(match) : match)
}

export const block = text =>
  p(
    text,
    [
      // BLOCK STUFF ===============================

      // comments
      /<!--((.|\n)*?)-->/g,
      '<!--$1-->',

      // pre format block
      /^("""|```)(.*)(\n(.*\n)*?)\1/gm,
      (_, wrapper, c, text) =>
        wrapper === '"""'
          ? tag('div', parse(text), { class: c })
          : tag('pre', encode(text), { class: c }),

      // blockquotes
      /(^>.*\n?)+/gm,
      chain('blockquote', /^> ?(.*)$/gm, '$1', inline),

      // tables
      /((^|\n)\|.+)+/g,
      chain('table', /^.*(\n\|---.*?)?$/gm, (match, subline) =>
        chain('tr', /\|(-?)([^|]+)\1(\|$)?/gm, (_, type, text) =>
          tag(type || subline ? 'th' : 'td', inlineBlock(text))
        )(match.slice(0, match.length - (subline || '').length))
      ),

      // lists
      /(?:(^|\n)([+-]|\d+\.) +(.*(\n[ \t]+.*)*))+/g,
      list,
      //anchor
      /#\[([^\]]+?)]/g,
      '<a name="$1"></a>',

      // headlines
      /^(#+) +(.*)(?:$)/gm,
      (_, h, text) => tag('h' + h.length, inlineBlock(text)),

      // horizontal rule
      /^(===+|---+)(?=\s*$)/gm,
      '<hr>'
    ],
    parse
  )

export const inlineBlock = (text: string, dontInline?: boolean) => {
  var temp = [],
    injectInlineBlock = text =>
      text.replace(/\\(\d+)/g, (_, code) =>
        injectInlineBlock(temp[Number.parseInt(code) - 1])
      )

  text = (text || '')
    .trim()
    // inline code block
    .replace(
      /`([^`]*)`/g,
      (_, text) => '\\' + temp.push(tag('code', encode(text)))
    )
    // inline media (a / img / iframe)
    .replace(
      /[!&]?\[([!&]?\[.*?\)|[^\]]*?)]\((.*?)( .*?)?\)|(\w+:\/\/[$\-.+!*'()/,\w]+)/g,
      (match, text, href, title, link) => {
        if (link) {
          return dontInline
            ? match
            : '\\' + temp.push(tag('a', link, { href: link }))
        }
        if (match[0] == '&') {
          text = text.match(/^(.+),(.+),([^ \]]+)( ?.+?)?$/)
          return (
            '\\' +
            temp.push(
              tag('iframe', '', {
                width: text[1],
                height: text[2],
                frameborder: text[3],
                class: text[4],
                src: href,
                title
              })
            )
          )
        }
        return (
          '\\' +
          temp.push(
            match[0] == '!'
              ? tag('img', '', { src: href, alt: text, title })
              : tag('a', inlineBlock(text, true), { href, title })
          )
        )
      }
    )
  text = injectInlineBlock(dontInline ? text : inline(text))
  return text
}

export const inline = text =>
  p(
    text,
    [
      // bold, italic, bold & italic
      /([*_]{1,3})((.|\n)+?)\1/g,
      (_, k, text) => {
        k = k.length
        text = inline(text)
        if (k > 1) text = tag('strong', text)
        if (k % 2) text = tag('em', text)
        return text
      },

      // strike through
      /(~{1,3})((.|\n)+?)\1/g,
      (_, k, text) => tag([, 'u', 's', 'del'][k.length], inline(text)),

      // replace remaining newlines with a <br>
      /  \n|\n  /g,
      '<br>'
    ],
    inline
  )

export const p = (text, rules, parse) => {
  var i = 0,
    f
  while (i < rules.length) {
    if ((f = rules[i++].exec(text))) {
      return (
        parse(text.slice(0, f.index)) +
        (typeof rules[i] === 'string'
          ? rules[i].replace(/\$(\d)/g, (_, d) => f[d])
          : rules[i].apply(this, f)) +
        parse(text.slice(f.index + f[0].length))
      )
    }
    i++
  }
  return text
}

export const parse = (text: string): string => {
  // clean input
  text = text
    .replace(/[\r\v\b\f]/g, '')
    .replace(/\\./g, match => `&#${match.charCodeAt(1)};`)

  var temp = block(text)

  if (temp === text && !temp.match(/^[\s\n]*$/i)) {
    temp = inlineBlock(temp)
      // handle paragraphs
      .replace(/((.|\n)+?)(\n\n+|$)/g, (_, text) => tag('p', text))
  }

  return temp.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code))
  )
}

export default parse

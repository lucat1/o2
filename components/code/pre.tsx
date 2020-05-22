import * as React from 'react'
import merge from 'deep-extend'

import Text, { TextProps } from '../text'

const Pre: React.FC<TextProps> = props => (
  <Text
    {...(props as any)}
    as='pre'
    sx={merge({ py: 2, px: 1 }, props.sx)}
    css={{
      'tabSize': 2,
      'margin': 0,
      '.comment, .prolog, .doctype, .cdata': {
        color: '#5c6370'
      },
      '.punctuation': { color: '#abb2bf' },
      '.selector, .tag': {
        color: '#e06c75'
      },
      '.property, .boolean, .number, .constant, .symbol, .attr-name, .deleted': {
        color: '#d19a66'
      },
      '.string, .char, .attr-value, .builtin, .inserted': {
        color: '#98c379'
      },
      '.operator, .entity, .url, .language-css .string, .style .string': {
        color: '#56b6c2'
      },

      '.atrule, .keyword': {
        color: 'var(--primary)'
      },

      '.function': {
        color: '#61afef'
      },

      '.regex, .important, .variable': {
        color: '#c678dd'
      },

      'important, .bold': {
        fontWeight: 'bold'
      },

      '.italic': {
        fontStyle: 'italic'
      },

      '.entity': {
        cursor: 'help'
      }
    }}
  />
)

// `

export default Pre

import * as React from 'react'
import { AppProps } from '@quercia/runtime'

import { cache } from '@emotion/css'
import {
  CacheProvider,
  ThemeProvider,
  Global,
  css,
  Interpolation
} from '@emotion/react'

import usePrefersTheme from 'use-prefers-theme'
import Header from '../components/header'
import Body from '../components/body'

import * as themes from '../types/theme'

const global: Interpolation<themes.Theme> = theme => css`
  body {
    margin: 0;
  }

  html {
    background: ${theme.background};
    color: ${theme.color};
    font-family: Operator Mono;
  }

  * {
    box-sizing: border-box;
  }
`

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  let pref = usePrefersTheme()
  if (pref === 'none') {
    pref = 'light'
  }

  pref = 'light'

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={themes[pref]}>
        <Global styles={global} />
        <Header service='auth' />
        <Body>
          <Component {...pageProps} />
        </Body>
      </ThemeProvider>
    </CacheProvider>
  )
}

App.displayName = 'AuthApp'

export default App

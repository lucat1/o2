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

import * as themes from '../types/theme'

const global: Interpolation<themes.Theme> = theme => css`
  body {
    margin: 0;
    font-size: calc(1rem + 0.25vw);
  }

  html {
    background: ${theme.background};
    color: ${theme.color};
    font-family: Operator Mono;
    transition: color 0.3s ease-in-out, background 0.3s ease-in-out;
  }

  * {
    box-sizing: border-box;
  }
`

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  let pref = usePrefersTheme()
  if (pref === 'none') {
    pref = 'dark'
  }

  // pref = 'light'

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={themes[pref]}>
        <Global styles={global} />

        <Header />

        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}

App.displayName = 'AuthApp'

export default App

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
  * {
    box-sizing: border-box;
  }

  html {
    background: ${theme.background};
    color: ${theme.color};
    font-family: Operator Mono;
    transition: color 0.3s ease-in-out, background 0.3s ease-in-out;
  }

  body {
    margin: 0;
    font-size: calc(1rem + 0.25vw);
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

        <Body>
          <Component {...pageProps} />
        </Body>
      </ThemeProvider>
    </CacheProvider>
  )
}

App.displayName = 'App<o2>'

export default App

import { setup } from 'goober'
import * as React from 'react'
import usePrefersTheme, { Preference } from 'use-prefers-theme'

import { Head, SSG } from '@quercia/quercia'
import { AppProps } from '@quercia/runtime'

import { cache } from '@emotion/css'
import { CacheProvider, ThemeProvider, Global, css } from '@emotion/react'

import Body from '../components/body'
import Header from '../components/header'
import Progress from '../components/progress'

import { base } from '../types/theme'

setup(React.createElement)

const glob = css`
  :root {
    --ff: 'Operator Mono', monospace;
    --primary: #8325c1;
    --primary-rgb: 199, 146, 234;
    --error: #fd9726;

    --red: #e13023;
    --green: #008845;

    --bg-3: #d9d9d9;
    --bg-4: #f2f2f2;
    --bg-5: #ffffff;
    --bg-6: #f9f9f9;
    --fg-5: #000000;

    @media (prefers-color-scheme: dark) {
      --primary: #c792ea;
      --bg-3: #303030;
      --bg-4: #2b2b2b;
      --bg-5: #191919;
      --bg-6: #161616;
      --fg-5: #ffffff;
    }
  }

  * {
    box-sizing: border-box;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-feature-settings: 'calt' 1;
    font-variant-ligatures: contextual;
  }

  html {
    background: var(--bg-5);
    color: var(--fg-5);
    transition: color 0.3s ease-in-out, background 0.3s ease-in-out;
  }

  html,
  code,
  pre,
  input {
    font-family: var(--ff);
  }

  body {
    margin: 0;
    font-size: calc(1rem + 0.25vw);
  }
`

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  if (process.env.NODE_ENV !== 'production' && !SSG) {
    console.group('Page infos:')
    console.info('props:', pageProps)
    console.groupEnd()
  }

  const dark = {}
  const themes: { [Key in Preference]: any } = {
    dark: dark,
    light: {},
    none: dark
  }

  const preference = usePrefersTheme()

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={base}>
        <Global styles={glob} />
        <Head>
          {preference != 'none' && (
            <meta
              name='theme-color'
              content={preference == 'light' ? '#ffffff' : '#191919'}
            />
          )}
        </Head>

        <Progress />
        <Header {...pageProps} />
        <Body>
          <Component {...pageProps} />
        </Body>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App

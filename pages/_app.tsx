import { glob, setup } from 'goober'
import * as React from 'react'
import usePrefersTheme from 'use-prefers-theme'

import { Head, SSG } from '@quercia/quercia'
import { AppProps } from '@quercia/runtime'

import Body from '../components/body'
import Header from '../components/header'
import Progress from '../components/progress'

setup(React.createElement)

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  if(process.env.NODE_ENV !== "production" && !SSG) {
    console.group('Page infos:')
    console.info('props:', pageProps)
    console.groupEnd()
  }

  glob`
    :root {
      --ff: 'Operator Mono', monospace;
      --primary: #8325C1;
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
        --primary: #C792EA;
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
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      font-feature-settings: "calt" 1;
      font-variant-ligatures: contextual;
    }

    html {
      background: var(--bg-5);
      color: var(--fg-5);
      font-family: var(--ff);
      transition: color 0.3s ease-in-out, background 0.3s ease-in-out;
    }

    code, pre {
      font-family: var(--ff);
    }

    body {
      margin: 0;
      font-size: calc(1rem + 0.25vw);
    }
  `

  const preference = usePrefersTheme()

  return (
    <>
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
    </>
  )
}

if (process.env.NODE_ENV === 'development') {
  App.displayName = 'App<o2>'
}

export default App

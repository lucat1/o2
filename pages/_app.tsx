import * as React from 'react'
import { AppProps } from '@quercia/runtime'
import { Head } from '@quercia/quercia'
import { glob, setup } from 'goober'
import usePrefersTheme from 'use-prefers-theme'

import Progress from '../components/progress'
import Header from '../components/header'
import Body from '../components/body'

setup(React.createElement)

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  glob`
    :root {
      --ff: 'Operator Mono';
      --primary: #C792EA;
      --error: #fd9726;

      --red: #e13023;
      --green: #008845;

      --bg-3: #d9d9d9;
      --bg-4: #f2f2f2;
      --bg-5: #ffffff;
      --bg-6: #e5e5e5;
      --fg-5: #000000;  

      @media (prefers-color-scheme: dark) {
        --bg-3: #303030;
        --bg-4: #171717;
        --bg-5: #191919;
        --bg-6: #161616;
        --fg-5: #ffffff;
      }
    }

    * {
      box-sizing: border-box;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
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
      <Header />
      <Body>
        <Component {...pageProps} />
      </Body>
    </>
  )
}

App.displayName = 'App<o2>'

export default App

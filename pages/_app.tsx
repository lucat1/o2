import * as React from 'react'
import { AppProps } from '@quercia/runtime'
import { glob } from 'goober'

import Header from '../components/header'
import Body from '../components/body'

/*
    @media (prefers-color-scheme: dark) {
      --background: #000000;
      --foreground: #ffffff;
      --dimmed-background: #191919;
      --primary: #C792EA;
    }
    */

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  glob`
  :root {
    --background: #ffffff;
    --foreground: #000000;
    --dimmed-background: #f4f4f4;
    --primary: #C792EA;
  }

  * {
    box-sizing: border-box;
  }

  html {
    background: var(--dimmed-background);
    color: var(--foreground);
    font-family: Operator Mono;
    transition: color 0.3s ease-in-out, background 0.3s ease-in-out;
  }

  body {
    margin: 0;
    font-size: calc(1rem + 0.25vw);
  }
`

  return (
    <>
      <Header />
      <Body>
        <Component {...pageProps} />
      </Body>
    </>
  )
}

App.displayName = 'App<o2>'

export default App

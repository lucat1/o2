import * as React from 'react'
import { AppProps } from '@quercia/runtime'
import { glob } from 'goober'

import Progress from '../components/progress'
import Header from '../components/header'
import Body from '../components/body'

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  glob`
  :root {
    --ff: 'Operator Mono';
    --primary: #C792EA;
    --error: #fd9726;

    --red: rgba(254,119,52, .75);
    --green: rgba(52,254,187, .35);

    --bg-3: #f4f4f4;
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
    text-rendering:optimizeLegibility;
  }

  html {
    background: var(--bg-5);
    color: var(--fg-5);
    font-family: var(--ff);
    transition: color 0.3s ease-in-out, background 0.3s ease-in-out;
  }

  body {
    margin: 0;
    font-size: calc(1rem + 0.25vw);
  }
`

  return (
    <>
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

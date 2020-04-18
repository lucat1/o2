import * as React from 'react'
import {
  QuerciaHead,
  QuerciaScripts,
  QuerciaMount,
  DocumentProps
} from '@quercia/runtime'

import { extractCss } from 'goober'

export default ({ css }: DocumentProps & { css: string }) => (
  <html lang='en'>
    <QuerciaHead>
      <meta name='viewport' content='width=device-width' />
      <style id='_goober' dangerouslySetInnerHTML={{ __html: css }} />
    </QuerciaHead>
    <body>
      <QuerciaMount />
      <QuerciaScripts />
    </body>
  </html>
)

export const getInitialProps = ({ renderPage }: DocumentProps) => {
  renderPage()
  return { css: extractCss() }
}

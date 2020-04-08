import * as React from 'react'
import {
  QuerciaHead,
  QuerciaScripts,
  QuerciaMount,
  DocumentProps
} from '@quercia/runtime'

import { extractCritical } from '@emotion/server'
import { EmotionCritical } from '@emotion/server/create-instance'

export default ({ ids, css }: DocumentProps & EmotionCritical) => (
  <html>
    <QuerciaHead>
      <meta name='viewport' content='width=device-width' />
      <style
        data-emotion-css={ids.join(' ')}
        dangerouslySetInnerHTML={{ __html: css }}
      />
    </QuerciaHead>
    <body>
      <QuerciaMount />
      <QuerciaScripts />
    </body>
  </html>
)

export const getInitialProps = ({ renderPage }: DocumentProps) => {
  return extractCritical(renderPage())
}

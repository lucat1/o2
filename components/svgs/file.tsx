import * as React from 'react'

const File: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = (
  props: React.SVGProps<SVGSVGElement>
) => (
  <svg viewBox='0 0 50 50' {...props}>
    <path
      d='M7 2v46h36V14.6l-.3-.3-12-12-.3-.3zm2 2h20v12h12v30H9zm22 1.4l8.6 8.6H31zM15 22v2h20v-2zm0 6v2h16v-2zm0 6v2h20v-2z'
      fill='var(--fg-5)'
    ></path>
  </svg>
)

if (process.env.NODE_ENV !== 'production') {
  File.displayName = 'File'
}

export default File

import * as React from 'react'

const Folder: React.FC<React.SVGProps<SVGSVGElement>> = (
  props: React.SVGProps<SVGSVGElement>
) => (
  <svg viewBox='0 0 50 50' {...props}>
    <path
      d='M5 4a3 3 0 00-3 3v36a3 3 0 003 3h40a3 3 0 003-3V11a3 3 0 00-3-3H18l-.3-.3-.8-1.2-1-1.5c-.5-.5-1-1-1.9-1H5zm0 2h9l.3.3.9 1.2 1 1.5c.4.5 1 1 1.8 1h27c.6 0 1 .4 1 1v2.2a3 3 0 00-1-.2H5a3 3 0 00-1 .2V7c0-.6.4-1 1-1zm0 9h40c.6 0 1 .4 1 1v27c0 .6-.4 1-1 1H5a1 1 0 01-1-1V16c0-.6.4-1 1-1z'
      fill='currentColor'
    />
  </svg>
)

if (process.env.NODE_ENV !== 'production') {
  Folder.displayName = 'Folder'
}

export default Folder

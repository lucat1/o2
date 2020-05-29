import * as React from 'react'
import { SSG } from '@quercia/quercia'

import { Left as Split } from '../split'
import { Tab } from '../tabs'

type Page = 'General' | 'Privacy' | 'Permissions' | 'Hooks'

interface LeftProps {
  current: Page
  pages: Page[]
  base: string
}

const Left: React.FC<LeftProps> = ({ current, pages, base }) => (
  <Split
    sx={{
      'a:last-child': { mr: 1 }
    }}
    px={[0, 4]}
    flexDirection='column'
  >
    {pages.map((page, i) => (
      <Tab
        key={i}
        width='100%'
        my={2}
        selected={page == current}
        to={
          SSG
            ? ''
            : `${base}${page == 'General' ? '' : '/' + page.toLowerCase()}`
        }
      >
        {page}
      </Tab>
    ))}
  </Split>
)

export default Left

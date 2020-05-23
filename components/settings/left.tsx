import * as React from 'react'
import { SSG } from '@quercia/quercia'

import { Left as Split } from '../split'
import { Tab } from '../tabs'

import { Repository } from '../../types/repository'

type Page = 'General' | 'Permissions' | 'Hooks'

interface LeftProps {
  current: Page
  repository: Repository
}

const pages: Page[] = ['General', 'Permissions', 'Hooks']

const Left: React.FunctionComponent<LeftProps> = ({ repository, current }) => (
  <Split px={[0, 4]} flexDirection='column'>
    {pages.map(page => (
      <Tab
        width='100%'
        my={2}
        selected={page == current}
        to={
          SSG
            ? ''
            : `/${repository.owner}/${repository.name}/settings${
                page == 'General' ? '' : '/' + page.toLowerCase()
              }`
        }
      >
        {page}
      </Tab>
    ))}
  </Split>
)

export default Left

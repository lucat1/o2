import * as React from 'react'
import { Flex, Box } from 'rebass'
import { SSG } from '@quercia/quercia'

import Link from '../link'
import Heading from '../heading'
import { Tab, Tabs } from '../tabs'

import { RepositoryProps } from '../../types/repository'

export type Page =
  | 'Overview'
  | 'Tree'
  | 'Commits'
  | 'Issues'
  | 'Pulls'
  | 'Settings'
const _tabs: [Page, string][] = [
  ['Overview', ''],
  ['Tree', '/tree/master'],
  ['Commits', '/commits/master'],
  ['Issues', '/issues'],
  ['Pulls', '/pulls'],
  ['Settings', '/settings']
]

const Layout: React.FunctionComponent<{ page: Page } & Partial<
  RepositoryProps
>> = ({ page, children, repository, owns }) => {
  let tabs = owns ? _tabs : _tabs.concat().splice(0, _tabs.length - 1)

  const baseURL = SSG ? '' : `/${repository.owner}/${repository.name}`

  return (
    <Flex
      cellSpacing={0}
      cellPadding={0}
      css={{ flex: 1, flexDirection: 'column', borderSpacing: 0 }}
      px={[0, 10]}
      py={[2, 0]}
    >
      <Box
        css={{ justifyContent: 'space-between' }}
        sx={{ display: ['block', 'flex'] }}
      >
        <Heading fontSize='lg' width={8}>
          <Link to={`/${repository?.owner || ''}`}>{repository?.owner}</Link>/
          <Link to={baseURL}>{repository?.name}</Link>
        </Heading>

        <Tabs>
          {tabs.map(([tab, url]) => (
            <Tab
              key={tab}
              to={SSG ? '' : `${baseURL}${url}`}
              selected={page == tab}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>
      </Box>
      {children}
    </Flex>
  )
}
export default Layout

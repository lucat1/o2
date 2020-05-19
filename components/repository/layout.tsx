import { styled } from 'goober'
import * as React from 'react'
import { SSG } from '@quercia/quercia'

import Link from '../link'

import { RepositoryProps } from '../../pages/repository'
import S from '../skeleton'
import { A } from '../_typography'
import { Tab, Tabs } from '../tabs'

const Container = styled('main')`
  display: flex;
  flex-direction: column;
  padding: 0 6em;

  @media (max-width: 960px) {
    padding: 2em 0.5em;
  }
`

const Head = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 800px) {
    display: block;
  }
`

const H2 = styled('h2')`
  display: flex;
`

const Skeleton = styled(S)`
  margin: 0 0.5em;
`

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
  let tabs = owns ? _tabs : _tabs.splice(0, _tabs.length - 1)

  return (
    <Container>
      <Head>
        <H2>
          <Link to={`/${repository?.owner || ''}`}>{repository?.owner}</Link>/
          <A>{repository?.name}</A>
        </H2>
        <Tabs>
          {tabs.map(([tab, url]) => (
            <Tab
              key={tab}
              to={SSG ? '' : `/${repository.owner}/${repository.name}${url}`}
              selected={page == tab}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>
      </Head>
      {children}
    </Container>
  )
}
export default Layout

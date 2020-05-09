import * as React from 'react'
import { SSG } from '@quercia/quercia'
import { styled, css } from 'goober'

import { Tabs, Tab } from './tabs'
import _Skeleton from '../skeleton'
import { A, Link } from '../typography'

import { RepositoryProps } from '../../pages/repository'

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

const Skeleton = styled(_Skeleton)`
  margin: 0 0.5em;
`

export type Page =
  | 'Overview'
  | 'Tree'
  | 'Commits'
  | 'Issues'
  | 'Pulls'
  | 'Settings'
const tabs: [Page, string][] = [
  ['Overview', ''],
  ['Tree', '/tree/master'],
  ['Commits', '/commits/master'],
  ['Issues', '/issues'],
  ['Pulls', '/pulls'],
  ['Settings', '/settings']
]

const Layout: React.FunctionComponent<{ page: Page } & Partial<
  RepositoryProps
>> = ({ page, children, repository }) => (
  <Container>
    <Head>
      <H2>
        <Link to={`/${repository?.owner || ''}`}>{repository?.owner}</Link>/
        <A>{repository?.name}</A>
      </H2>
      <Tabs>
        {tabs.map(([tab, url]) =>
          SSG ? (
            <Skeleton key={tab} width={`${tab.length / 2}em`} height='1em' />
          ) : (
            <Tab
              key={tab}
              to={`/${repository.owner}/${repository.name}${url}`}
              selected={page == tab}
            >
              {tab}
            </Tab>
          )
        )}
      </Tabs>
    </Head>
    {children}
  </Container>
)

export default Layout

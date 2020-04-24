import * as React from 'react'
import { usePrerender } from '@quercia/quercia'
import { styled, css } from 'goober'

import { Tabs, Tab } from './tabs'
import _Skeleton from '../skeleton'
import { A, Link } from '../typography'

import { RepositoryProps } from '../../pages/repository'

const Container = styled('main')`
  display: flex;
  flex-direction: column;
  padding: 0 6em;

  @media only screen and (max-width: 960px) {
    padding: 2em 0;
  }
`

const Head = styled('div')`
  display: flex;
  align-items: center;
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

const Layout: React.FunctionComponent<
  { page: Page } & Partial<RepositoryProps>
> = ({ page, children, repository }) => (
  <Container>
    <Head>
      <h2
        className={css`
          display: flex;
        `}
      >
        <Link to={`/${repository?.owner || ''}`}>{repository?.owner}</Link>/
        <A>{repository?.name}</A>
      </h2>
      <Tabs>
        {tabs.map(([tab, url]) =>
          usePrerender() ? (
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

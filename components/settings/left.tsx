import { styled } from 'goober'
import * as React from 'react'

import { SSG } from '@quercia/quercia'

import { Repository } from '../../types/data'
import { Tab as T } from '../repository/tabs'
import { Left as L } from '../split'

const Container = styled(L)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 0;
  border-right: 1px solid var(--bg-3);
  height: 100%;

  @media (max-width: 680px) {
    border: none;
  }
`

const Tab = styled(T)`
  font-size: 1em;
  width: 70%;
  height: 2.25em;
  margin: 0.5em 0;

  &:nth-child(1) {
    margin-top: 0;
  }
`

type Page = 'General' | 'Permissions' | 'Hooks'

interface LeftProps {
  current: Page
  repository: Repository
}

const pages: Page[] = ['General', 'Permissions', 'Hooks']

const Left: React.FunctionComponent<LeftProps> = ({ repository, current }) => (
  <Container>
    {pages.map(page => (
      <Tab
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
  </Container>
)

export default Left

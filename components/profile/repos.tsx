import * as React from 'react'
import { usePrerender } from '@quercia/quercia'
import styled from '@emotion/styled'

import Skeleton from '../skeleton'
import VCS from '../svgs/git'
import { ProfileProps } from '../../pages/profile'

const Repos = styled.section`
  flex: 1;
  padding: 0 2.5em;

  /* apply styles on the repositories divs */
  div {
    margin-top: calc(1rem + 1vw);

    &:nth-child(1) {
      margin-top: 0;
    }
  }

  @media only screen and (max-width: 700px) {
    width: 100%;
    padding: 0;

    div:nth-child(1) {
      margin-top: calc(2rem + 1vw);
    }
  }
`

const Repo = styled.div`
  width: calc(100% - 2px);
  height: calc(8em - 2px);
  border: 1px solid red;
`

const EmptyRepos = styled(Repos)`
  justify-content: center;
  align-items: center;
`

const Repositories = ({ user }: ProfileProps) => {
  // rener a placeholder pointing the user to create his/hers first repo
  if ((user?.repositories || []).length == 0 && !usePrerender()) {
    return (
      <EmptyRepos>
        <VCS style={{ width: '70%' }} />
        <button>test</button>
      </EmptyRepos>
    )
  }

  if (usePrerender()) {
    user = {} as any
    user.repositories = Array.from({ length: 3 })
  }

  return (
    <Repos>
      {(user?.repositories || []).map((repository, i) => {
        if (usePrerender()) {
          return <Skeleton key={i} width='100%' height='8em' />
        }

        return <Repo key={i} />
      })}
    </Repos>
  )
}

if (process.env.NODE_ENV !== 'production') {
  Repositories.displayName = 'Repositories'
}

export default Repositories

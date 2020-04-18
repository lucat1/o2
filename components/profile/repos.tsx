import * as React from 'react'
import { usePrerender, navigate } from '@quercia/quercia'
import { styled } from 'goober'

import Skeleton from '../skeleton'
import Button from '../button'

import VCS from '../svgs/git'
import { ProfileProps } from '../../pages/profile'

const Repos = styled('section')`
  flex: 1;
  padding: 0 2.5em;

  /* apply styles on the repositories divs */
  div {
    margin-top: calc(1rem + 1vw);

    &:nth-child(1) {
      margin-top: 0;
    }
  }

  @media only screen and (max-width: 960px) {
    width: 100%;
    padding: 0 1em;
    padding-top: 2em;

    div:nth-child(1) {
      margin-top: calc(2rem + 1vw);
    }
  }
`

const Repo = styled('div')`
  width: calc(100% - 2px);
  height: calc(8em - 2px);
  border-radius: 0.25em;
  border: 1px solid var(--foreground);
`

const EmptyRepos = styled(Repos)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Repositories = ({ user, account }: ProfileProps) => {
  // rener a placeholder pointing the user to create his/hers first repo
  if ((user?.repositories || []).length == 0 && !usePrerender()) {
    console.log(user?.username, account?.username)
    return (
      <EmptyRepos>
        <h4>
          {user?.username == account?.username ? (
            "You don't"
          ) : (
            <>
              <code>{user.username}</code> doesn't
            </>
          )}{' '}
          have any repositories yet
        </h4>
        <VCS style={{ width: '70%' }} />

        {user?.username == account?.username && (
          <Button onClick={() => navigate('/add')}>Create</Button>
        )}
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

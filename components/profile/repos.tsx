import * as React from 'react'
import { SSG, navigate } from '@quercia/quercia'
import { styled } from 'goober'

import Skeleton from '../skeleton'
import Button from '../button'

import VCS from '../svgs/git'
import { ProfileProps } from '../../pages/profile'
import { H2, Link } from '../typography'

const Repos = styled('section')`
  padding: 0 2.25em;
  flex: 1;
  flex-wrap: wrap;
  flex-basis: 0;
  min-width: 60%;
  flex-grow: 999;

  @media (max-width: 960px) {
    padding: 0 1em;
    padding-top: 2em;
  }
`

const Repo = styled('div')`
  border-radius: 0.25em;
  border: 1px solid var(--bg-3);
  width: calc(100% - 2px);
  height: calc(8em - 2px);

  padding: 0 2em;
  margin-top: calc(1em + 1vw);
  overflow: hidden;
  text-overflow: ellipsis;

  &:nth-child(1) {
    margin-top: 0;
  }

  @media (max-width: 960px) {
    margin-top: calc(2em + 1vw);
  }
`

const EmptyRepos = styled(Repos)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Repositories = ({ user, account }: ProfileProps) => {
  // rener a placeholder pointing the user to create his/hers first repo
  if ((user?.repositories || []).length == 0 && !SSG) {
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

  if (SSG) {
    user = {} as any
    user.repositories = Array.from({ length: 3 })
  }

  return (
    <Repos>
      {(user?.repositories || []).map((repository, i) => (
        <Repo key={i}>
          <H2>
            <Link to={`/${user?.username}/${repository?.name}`}>
              {repository?.name}
            </Link>
          </H2>
          {SSG ? (
            <Skeleton width='100%' height='3.5em' />
          ) : (
            <code>{repository.description}</code>
          )}
        </Repo>
      ))}
    </Repos>
  )
}

if (process.env.NODE_ENV !== 'production') {
  Repositories.displayName = 'Repositories'
}

export default Repositories

import * as React from 'react'
import { Flex, Button } from 'rebass'

import { navigate, SSG } from '@quercia/quercia'

import Link from '../link'
import { Right } from '../split'
import VCS from '../svgs/git'

import Skeleton from '../skeleton'
import { H2 } from '../typography'

import { Base, Repository as IRepository } from '../../types/data'

const Repository: React.FC = props => (
  <Flex
    sx={{
      'height': 'calc(8rem - 2px)',
      'border': '1px solid',
      'borderColor': 'bg.3',
      'borderRadius': 'md',
      'overflow': 'hiddem',
      'textOverflow': 'ellipsis',
      ':nth-child(1)': {
        marginTop: ['2rem', 0]
      }
    }}
    my={4}
    px={6}
    {...props}
  />
)

const Repositories = ({
  owner,
  repositories,
  account
}: Base<{ owner: string; repositories: IRepository[] }>) => {
  // rener a placeholder pointing the user to create his/hers first repo
  if ((repositories || []).length == 0 && !SSG) {
    return (
      <Right flexDirection='column' alignItems='center'>
        <h4>
          {owner == account?.username ? (
            "You don't"
          ) : (
            <>
              <code>{owner}</code> doesn't
            </>
          )}{' '}
          have any repositories yet
        </h4>
        <VCS style={{ width: '70%' }} />

        {owner == account?.username && (
          <Button onClick={() => navigate('/new')}>Create</Button>
        )}
      </Right>
    )
  }

  if (SSG) {
    repositories = Array.from({ length: 3 })
  }

  return (
    <Right px={[4, 6]} paddingTop={[4, 0]} flexDirection='column'>
      {(repositories || []).map((repository, i) => (
        <Repository key={i}>
          <H2>
            <Link to={`/${owner}/${repository?.name}`}>{repository?.name}</Link>
          </H2>
          {SSG ? (
            <Skeleton width='100%' height='3.5em' />
          ) : (
            <code>{repository.description}</code>
          )}
        </Repository>
      ))}
    </Right>
  )
}

export default Repositories

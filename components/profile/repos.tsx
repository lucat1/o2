import * as React from 'react'
import { Flex, Box } from 'rebass'

import { navigate, SSG } from '@quercia/quercia'

import Link from '../link'
import Heading from '../heading'
import Text from '../text'
import Button from '../button'
import { Right } from '../split'
import VCS from '../svgs/git'

import { Base } from '../../types/data'
import { Repository as IRepository } from '../../types/repository'

const Repository: React.FC = props => (
  <Flex
    sx={{
      'flexDirection': 'column',
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
    py={2}
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
          <Heading my={0}>
            <Link to={`/${owner}/${repository?.name}`}>{repository?.name}</Link>
          </Heading>
          <Box width='100%' my={2} height='4rem'>
            <Text as='p' width='75%' height='4rem'>
              {repository?.description}
            </Text>
          </Box>
        </Repository>
      ))}
    </Right>
  )
}

export default Repositories

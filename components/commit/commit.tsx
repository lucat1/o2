import * as React from 'react'
import { Flex } from 'rebass'
import format from 'tinydate'

import Container from '../base'
import Image from '../image'
import Link from '../link'
import Text from '../text'

import { Commit as ICommit } from '../../types/data'

const Commit: React.FC<{ commit: ICommit; base: string }> = ({
  commit,
  base
}) => (
  <Container
    my={2}
    p={2}
    css={{
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <Flex alignItems='center'>
      <Link
        known
        css={{ outline: 'none', flexShrink: 0, display: 'flex' }}
        to={`/${commit?.author?.name}`}
      >
        <Image
          width={5}
          height={5}
          alt={
            commit
              ? `${commit.author.name}'s profile picture`
              : "commit author's profile picture"
          }
          src={`/picture/${commit?.author?.picture}`}
        />
      </Link>
      <Flex
        css={{
          'flexDirection': 'column',
          'a, span': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }}
        mx={2}
      >
        <Link width={8} color='fg.5' to={`${base}/commit/${commit?.commit}`}>
          {commit?.subject}
        </Link>

        <Text known fontSize='xs' display='flex' mt={2} as='span'>
          <Link height={2} to={`/${commit?.author.name}`}>
            {commit?.author?.name}
          </Link>
          <Text height={2} px={1}>
            commited on
          </Text>
          <Text height={2}>
            {format('{DD} {MM} {YYYY}')(new Date(commit?.author?.date))}
          </Text>
        </Text>
      </Flex>
    </Flex>

    <Link css={{ flexShrink: 0 }} to={`${base}/tree/${commit?.tree}`}>
      {commit?.abbrv_tree}
    </Link>
  </Container>
)

export default Commit

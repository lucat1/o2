import * as React from 'react'
import { Flex } from 'rebass'
import format from 'tinydate'

import Heading from '../heading'
import Link from '../link'
import Text from '../text'
import Commit from '../commit/commit'

import { CommitEvent as Event } from '../../types/data'

const CommitEvent: React.FC<{ event: Event }> = ({ event }) => {
  const base = '/' + event.owner + '/' + event.name
  return (
    <Flex flex={1} flexDirection='column' my={2}>
      <Text color='bg.3' fontSize='xs'>
        {format('on the {DD} {MM} {YYYY} at {HH}:{mm}:{ss}')(
          new Date(event.time)
        )}
      </Text>

      <Heading fontWeight='normal'>
        {event.data.commits.length} commit
        {event.data.commits.length > 1 ? 's' : ''}{' '}
        {event.data.commits.length > 1 ? 'have' : 'has'} been pushed to{' '}
        <Link to={base}>
          {event.owner}/{event.name}
        </Link>
        :
      </Heading>

      <Flex flexDirection='row'>
        <Flex width='1px' bg='bg.3' ml={[1, 3]} mr={[3, 6]} />
        <Flex pt={2} flexDirection='column' flex={1}>
          {event.data.commits.map(commit => (
            <Commit key={commit.abbrv} base={base} commit={commit} />
          ))}
        </Flex>
      </Flex>

      {event.data.more && <Text my={1}>and more</Text>}
    </Flex>
  )
}

export default CommitEvent

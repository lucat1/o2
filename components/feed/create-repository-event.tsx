import * as React from 'react'
import { Flex } from 'rebass'
import format from 'tinydate'

import Heading from '../heading'
import Link from '../link'
import Text from '../text'

import { CreateRepositoryEvent as Event } from '../../types/data'

const CreateRepositoryEvent: React.FC<{ event: Event }> = ({ event }) => {
  const base = '/' + event.owner + '/' + event.name
  return (
    <Flex flex={1} flexDirection='column' my={2}>
      <Text color='bg.3' fontSize='xs'>
        {format('on the {DD} {MM} {YYYY} at {HH}:{mm}:{ss}')(
          new Date(event.time)
        )}
      </Text>

      <Heading fontWeight='normal'>
        <Link to={`/${event.owner}`}>{event.owner}</Link> created a new
        repository at{' '}
        <Link to={base}>
          {event.owner}/{event.name}
        </Link>
      </Heading>
    </Flex>
  )
}

export default CreateRepositoryEvent

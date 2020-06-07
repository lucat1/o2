import * as React from 'react'
import { Flex } from 'rebass'
import { Head } from '@quercia/quercia'

import Heading from '../components/heading'
import CommitEvent from '../components/feed/commit-event'
import CreateRepositoryEvent from '../components/feed/create-repository-event'

import {
  Event,
  CommitEvent as CEvent,
  CreateRepositoryEvent as CREvent
} from '../types/data'

interface FeedProps {
  events: Event[]
}

export default ({ events }: FeedProps) => {
  return (
    <Flex flex={1} flexDirection='column'>
      <Head>
        <title>index - o2</title>
        <meta
          name='description'
          content='a feed page showing all recent git events in o2'
        />
      </Head>

      <Heading known fontSize='lg' my={4}>
        Latest events:
      </Heading>

      {(events || []).map((event, i) => {
        switch (event.type) {
          case 'commit':
            return <CommitEvent event={event as CEvent} />

          case 'create-repository':
            return (
              <CreateRepositoryEvent event={event as CreateRepositoryEvent} />
            )

          default:
            return null
        }
      })}
    </Flex>
  )
}

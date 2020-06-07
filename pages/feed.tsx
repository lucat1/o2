import * as React from 'react'
import { Flex, Box } from 'rebass'
import { Head, SSG } from '@quercia/quercia'

import Heading from '../components/heading'
import CommitEvent from '../components/feed/commit-event'
import CreateRepositoryEvent from '../components/feed/create-repository-event'
import NoEvents from '../components/svgs/no-events'

import {
  Event,
  CommitEvent as CEvent,
  CreateRepositoryEvent as CREvent
} from '../types/data'
import Center from '../components/center'

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

      {(events || []).length > 0 ? (
        <>
          <Heading known fontSize='lg' my={4}>
            Latest events:
          </Heading>

          {(events || []).map((event, i) => {
            switch (event.type) {
              case 'commit':
                return <CommitEvent key={i} event={event as CEvent} />

              case 'create-repository':
                return (
                  <CreateRepositoryEvent key={i} event={event as CREvent} />
                )

              default:
                return null
            }
          })}
        </>
      ) : !SSG ? (
        <Center height='calc(100vh - 3.5rem)'>
          <Heading textAlign='center' mt={6} fontSize='lg'>
            Noting has happened yet!
          </Heading>
          <Heading textAlign='center' mb={6} color='primary.default'>
            Go make something awsome!
          </Heading>
          <Box as={NoEvents} width='70%' flex={1} />
        </Center>
      ) : null}
    </Flex>
  )
}

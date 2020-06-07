import * as React from 'react'
import { Flex } from 'rebass'
import { Head } from '@quercia/quercia'
import format from 'tinydate'

import Heading from '../components/heading'
import Link from '../components/link'
import Text from '../components/text'
import Commit from '../components/commit/commit'
import { CommitEvent } from '../types/data'

interface FeedProps {
  events: CommitEvent[]
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
        const base = '/' + event.owner + '/' + event.name
        return (
          <Flex flex={1} flexDirection='column' my={2} key={i}>
            <Text color='bg.3' fontSize='xs'>
              {format('on the {DD} {MM} {YYYY} at {HH}:{mm}:{ss}')(
                new Date(event.time)
              )}
            </Text>
            <Heading fontWeight='normal'>
              {event.data.commits.length} commit
              {event.data.commits.length > 1 ? 's' : ''} have been pushed to{' '}
              <Link to={base}>
                {event.owner}/{event.name}
              </Link>
              :
            </Heading>

            <Flex flexDirection='row'>
              <Flex width='1px' bg='bg.3' ml={[1, 3]} mr={[3, 6]} />
              <Flex pt={2} flexDirection='column' flex={1}>
                {event.data.commits.map(commit => (
                  <Commit base={base} commit={commit} />
                ))}
              </Flex>
            </Flex>

            {event.data.more && <Text my={1}>and more</Text>}
          </Flex>
        )
      })}
    </Flex>
  )
}

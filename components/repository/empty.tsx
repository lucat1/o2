import * as React from 'react'
import { Flex, FlexProps } from 'rebass'

import Container from '../base'
import Center from '../center'
import Divider from '../divider'
import Heading from '../heading'
import Text from '../text'
import Code from '../code'
import NoData from '../svgs/no-data'

import { Base } from '../../types/repository'

const Spaced: React.FC<FlexProps> = props => (
  <Flex flexDirection='column' {...(props as any)} sx={{ px: 4, py: 2 }} />
)

const Empty: React.FC<Base<{}>> = ({ repository, owns }) => {
  const url = `http://${window.location.host}/${repository.owner}/${repository.name}`

  return owns ? (
    <Container css={{ flexDirection: 'column' }}>
      <Spaced>
        <Heading>Quickstart guide</Heading>
      </Spaced>
      <Divider />
      <Spaced>
        <Text known as='p'>
          You can clone the repository at this url:
        </Text>
        <Code>{url}</Code>
      </Spaced>
      <Divider />
      <Spaced>
        <Text known as='p'>
          To inizialize and upload a folder:
        </Text>
        <Code>
          git init
          <br />
          git add .
          <br />
          git commit -m "initial commit"
          <br />
          git remote add origin {url}
          <br />
          git push -u origin master
        </Code>
      </Spaced>
      <Divider />
      <Spaced>
        <Text known as='p'>
          To upload an existing repository on your system:
        </Text>
        <Code>
          git remote add origin {url}
          <br />
          git push -u origin master
        </Code>
      </Spaced>
    </Container>
  ) : (
    <Center>
      <h2>This repository is empty</h2>

      <NoData width='70%' />
    </Center>
  )
}

export default Empty

import { styled } from 'goober'
import * as React from 'react'

import Center from '../center'
import Divider from '../divider'

import NoData from '../svgs/no-data'
import { Code, P, SpacedH2 } from '../_typography'
import Container from '../base'

import { Base } from '../../types/repository'

const Spaced = styled('div')`
  padding: 0.5em 1em;
`

const Empty: React.FunctionComponent<Base<{}>> = ({ repository, owns }) => {
  const url = `http://${window.location.host}/${repository.owner}/${repository.name}`

  return owns ? (
    <Container>
      <SpacedH2>Quickstart guide</SpacedH2>
      <Divider />
      <Spaced>
        <P>You can clone the repository at this url:</P>
        <Code>{url}</Code>
      </Spaced>
      <Divider />
      <Spaced>
        <P>To inizialize (initialize) and upload a folder:</P>
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
        <P>To upload an existing repository on your system:</P>
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

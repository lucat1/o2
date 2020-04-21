import * as React from 'react'
import { styled } from 'goober'

import { SpacedH2, P, Code } from '../typography'
import { RepositoryProps } from '../../pages/repository'
import NoData from '../svgs/no-data'

const Container = styled('div')`
  border-radius: 0.25em;
  border: 1px solid var(--bg-3);
  width: calc(100% - 2px);
  margin-top: 2em;
`

const Line = styled('div')`
  height: 1px;
  background: var(--bg-3);
`

const Spaced = styled('div')`
  padding: 0.5em 1em;
`

const Center = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Empty: React.FunctionComponent<Partial<RepositoryProps>> = ({
  repository,
  account
}) => {
  const url = `http://${window.location.host}/${repository.owner}/${repository.name}`

  return account?.username === repository?.owner ? (
    <Container>
      <SpacedH2>Quickstart guide</SpacedH2>
      <Line />
      <Spaced>
        <P>You can clone the repository at this url:</P>
        <Code>{url}</Code>
      </Spaced>
      <Line />
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
      <Line />
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

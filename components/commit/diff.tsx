import * as React from 'react'
import { styled } from 'goober'
import { File } from 'parse-diff'

import _Container from '../repository/container'
import { Line } from '../repository/empty'

const Container = styled(_Container)`
  margin: 1em 0;

  &:nth-child(4) {
    margin-top: 0.5em;
  }
`

const Title = styled('div')`
  padding: 0.35em 0.5em;
`

const Code = styled('code')`
  overflow: auto;

  display: grid;
  grid-template-columns: auto auto 3fr;
`

const LineNumbers = styled('div')`
  padding: 0 0.75em;
  user-select: none;
  text-align: right;
`

const Pre = styled('pre')`
  margin: 0;
`

const Diff: React.FunctionComponent<{ file: File }> = ({ file }) => (
  <Container>
    <Title>
      {file.from !== file.to ? `${file.from} -> ${file.to}` : file.to}
    </Title>
    <Line />
    {file.chunks.map(chunk => (
      <Code key={chunk.content}>
        {chunk.changes.map((change, i) => {
          const style = {
            background:
              change.type === 'del'
                ? 'var(--red)'
                : change.type === 'add'
                ? 'var(--green)'
                : undefined
          }

          return (
            <React.Fragment key={i}>
              <LineNumbers style={style}>{chunk.oldStart + i}</LineNumbers>
              <LineNumbers style={style}>{chunk.newStart + i}</LineNumbers>
              <div style={style}>
                <Pre>{change.content}</Pre>
              </div>
            </React.Fragment>
          )
        })}
      </Code>
    ))}
  </Container>
)

export default Diff

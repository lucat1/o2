import * as React from 'react'
import { styled, css } from 'goober'
import { File } from 'parse-diff'

import _Container from '../repository/container'
import { Line as _Line } from '../repository/empty'
import Button from '../button'
import { SpacedA } from '../typography'
import Arrow from '../svgs/arrow'

const Container = styled(_Container)`
  margin: 1em 0;
  overflow: hidden;

  &:nth-child(4) {
    margin-top: 0.5em;
  }
`

const Title = styled('div')`
  align-items: center;
  display: flex;
  padding: 0.35em 0.5em;
`

const Code = styled('code')`
  overflow: auto;

  display: grid;
  grid-template-columns: auto auto 3fr;
`

const Empty = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  height: 7em;
  padding: 1.25em;
`

const IconButton = styled(Button)<{ flipped: boolean }>`
  margin-right: 0.5em;
  padding: 0;
  background: var(--bg-3);
  transform: rotate(${({ flipped }) => (flipped ? '180' : '360')}deg);
`

const LineNumbers = styled('div')`
  padding: 0 0.75em;
  user-select: none;
  text-align: right;
`

const FullLine = styled('div')<{ big: boolean }>`
  grid-column: 1 / 4;
  padding: 0 0.75em;
  background: var(--bg-6);

  ${({ big }) =>
    big &&
    `
  height: 3.5em;
  display: flex;
  align-items: center;
  `}
`

const Line = styled(_Line)`
  grid-column: 1 / 4;
`

const Pre = styled('pre')`
  margin: 0;
`

const Diff: React.FunctionComponent<{ file: File }> = ({ file }) => {
  const [visible, setVisible] = React.useState(
    !file.deleted && file.deletions < 500 && file.additions < 500
  )
  const [collapsed, collapse] = React.useState(false)

  let title = ''
  if (file.new) {
    title = file.to
  } else if (file.deleted) {
    title = file.from
  } else if (file.from !== file.to) {
    title = `${file.from} -> ${file.to}`
  } else {
    title = file.to
  }

  const red = css`
    background: var(--red);
  `

  const green = css`
    background: var(--green);
  `

  return (
    <Container>
      <Title>
        <IconButton
          flipped={collapsed}
          tiny
          onClick={() => collapse(!collapsed)}
        >
          <Arrow height='1em' />
        </IconButton>
        <a>{title}</a>
        {file.new && <SpacedA style={{ color: 'var(--green)' }}>NEW</SpacedA>}
        {file.deleted && <SpacedA style={{ color: 'var(--red)' }}>DEL</SpacedA>}
      </Title>
      {!collapsed && <Line />}
      {!visible && !collapsed && (
        <Empty>
          {file.deleted
            ? 'The file was deleted, hiding diff'
            : 'The diff is too big, not showing'}

          <Button small onClick={() => setVisible(true)}>
            Show anyway
          </Button>
        </Empty>
      )}
      {visible &&
        !collapsed &&
        file.chunks.map((chunk, i) => (
          <Code key={i}>
            {i !== 0 && <Line />}
            <FullLine big={i !== 0}>{chunk.content}</FullLine>
            {i !== 0 && <Line />}
            {chunk.changes.map((change, i) => {
              const csx =
                change.type === 'del'
                  ? red
                  : change.type === 'add'
                  ? green
                  : undefined

              return (
                <React.Fragment key={i}>
                  <LineNumbers className={csx}>
                    {!file.new && !file.deleted && chunk.oldStart + i}
                  </LineNumbers>
                  <LineNumbers className={csx}>
                    {chunk.newStart + i}
                  </LineNumbers>
                  <div className={csx}>
                    <Pre>
                      {change.type === 'normal' && ' '}
                      {change.content}
                    </Pre>
                  </div>
                </React.Fragment>
              )
            })}
          </Code>
        ))}
    </Container>
  )
}
export default Diff

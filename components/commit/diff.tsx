import * as React from 'react'
import { Flex } from 'rebass'
import { File } from 'parse-diff'

import Container from '../base'
import Center from '../center'
import Divider from '../divider'
import Button from '../button'
import Text from '../text'
import Arrow from '../svgs/arrow'
import Pre from '../code/pre'
import Gutter from '../code/gutter'

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

  return (
    <Container flexDirection='column'>
      <Flex alignItems='center' py={1} px={2} fontSize='sm'>
        <Button
          p={1}
          variant='sm-secondary'
          onClick={() => collapse(!collapsed)}
          aria-label={collapsed ? 'Show diff' : 'Collpase diff'}
        >
          <Arrow
            style={{
              transform: `rotate(${collapsed ? 180 : 360}deg)`
            }}
            height='1em'
          />
        </Button>
        <Text px={2}>{title}</Text>
        {file.new && (
          <Text fontWeight='bold' color='green'>
            NEW
          </Text>
        )}
        {file.deleted && (
          <Text fontWeight='bold' color='red'>
            DEL
          </Text>
        )}
      </Flex>

      {!collapsed && <Divider />}
      {!visible && !collapsed && (
        <Center css={{ textAlign: 'center' }} p={4}>
          {file.deleted
            ? 'The file was deleted, hiding diff'
            : 'The diff is too big, not showing'}

          <Button mt={4} variant='md' onClick={() => setVisible(true)}>
            Show anyway
          </Button>
        </Center>
      )}
      {visible &&
        !collapsed &&
        file.chunks.map((chunk, i) => (
          <Flex flexDirection='column' key={i}>
            {i !== 0 && <Divider />}
            <Flex
              alignItems='center'
              bg='bg.6'
              px={3}
              height={i !== 0 ? 6 : 'auto'}
            >
              {chunk.content}
            </Flex>
            {i !== 0 && <Divider />}

            <Flex width='100%' overflow='auto' flexDirection='row'>
              <Gutter
                sx={{
                  color: !file.new && !file.deleted ? 'inherit' : 'transparent'
                }}
              >
                {chunk.changes.map((_, i) => `${chunk.oldStart + i}\n`)}
              </Gutter>
              <Gutter>
                {chunk.changes.map((_, i) => `${chunk.newStart + i}\n`)}
              </Gutter>
              <Pre>
                {chunk.changes.map((change, i) => {
                  const color =
                    change.type === 'del'
                      ? 'var(--red)'
                      : change.type === 'add'
                      ? 'var(--green)'
                      : 'inherit'

                  return <span style={{ color }}>{change.content + '\n'}</span>
                })}
              </Pre>
            </Flex>
          </Flex>
        ))}
    </Container>
  )
}
export default Diff

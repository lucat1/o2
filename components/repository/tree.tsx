import * as React from 'react'
import { Box, BoxProps } from 'rebass'
import * as pretty from 'pretty-bytes'
import { SSG } from '@quercia/quercia'

import Link from '../link'
import Container from '../base'
import Skeleton from '../skeleton'
import File from '../svgs/file'
import Folder from '../svgs/folder'

import { basename, key, url } from './path'
import { Except } from 'type-fest'
import { EntryKind, Base, Tree as ITree } from '../../types/repository'

const Cell: React.FC<BoxProps> = props => (
  <Box
    as='td'
    css={{
      'textOverflow': 'ellipsis',
      'lineHeight': '1rem',
      'textAlign': 'start',

      ':not(:nth-child(2))': { whiteSpace: 'nowrap' },
      ':nth-child(2)': { width: '100%' },
      ':nth-child(3)': { textAlign: 'end' }
    }}
    sx={{
      p: 2,
      svg: {
        width: 2,
        height: 2
      }
    }}
    {...(props as any)}
  />
)

const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

const Tree: React.FC<Except<Base<{ tree: ITree }>, 'owns'>> = ({
  tree,
  repository
}) => {
  if (SSG) {
    tree = {
      children: Array.from({ length: 12 }).map(() => ({ kind: 0 }))
    } as any
  }

  return (
    <Container
      css={{
        display: 'block',
        borderCollapse: 'collapse',
        tableLayout: 'auto',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
      as='table'
    >
      <thead>
        <Box
          as='tr'
          sx={{ borderBottom: '1px solid', borderColor: 'bg.3', td: { py: 3 } }}
        >
          <Cell as='th'></Cell>
          <Cell as='th'>Name</Cell>
          <Cell as='th'>Size</Cell>
        </Box>
      </thead>
      <tbody>
        {(tree.children || [])
          .sort((a, b) => (key(a) > key(b) ? -1 : 1)) // sort alphetically
          .sort((a, b) => (a.kind > b.kind ? 1 : -1)) // sort by kind (folder, file)
          .map((entry, i) => (
            <tr key={i}>
              <Cell>
                {SSG ? (
                  <Skeleton height={3} width={3} />
                ) : entry.kind === EntryKind.BLOB ? (
                  <File />
                ) : (
                  <Folder />
                )}
              </Cell>
              <Cell>
                <Link
                  unkown
                  height={3}
                  width={`${rnd(13, 4)}rem`}
                  sx={
                    entry.kind
                      ? { color: 'fg.5' }
                      : { color: 'primary.default' }
                  }
                  to={SSG ? '' : url(repository, tree, entry)}
                >
                  {SSG ? '' : basename(key(entry))}
                </Link>
              </Cell>
              <Cell>
                {SSG ? (
                  <Skeleton height={3} width={`${rnd(6, 3)}rem`} />
                ) : (
                  entry.kind !== EntryKind.TREE && pretty(entry.size)
                )}
              </Cell>
            </tr>
          ))}
      </tbody>
    </Container>
  )
}

export default Tree

import * as React from 'react'
import { Box, BoxProps } from 'rebass'
import * as pretty from 'pretty-bytes'
import { SSG } from '@quercia/quercia'

import Link from '../link'
import Base from '../base'
import Skeleton from '../skeleton'
import File from '../svgs/file'
import Folder from '../svgs/folder'

import { EntryKind, Repository, Tree as ITree } from '../../types/data'
import { basename, key, url } from './path'

// const Grid = styled(Container)`
//   display: grid;
//   grid-template-columns: auto 1fr auto;

//   & > div:last-child,
//   & > div:nth-last-child(2),
//   & > div:nth-last-child(3) {
//     border-bottom: 0;
//   }

//   & > div:last-child {
//     border-bottom-right-radius: 0.5em;
//   }

//   & > div:nth-last-child(3) {
//     border-bottom-left-radius: 0.5em;
//   }

//   & > div:nth-child(3) {
//     border-top-right-radius: 0.5em;
//   }

//   & > div:first-child {
//     border-top-left-radius: 0.5em;
//   }
// `

const Cell: React.FC<BoxProps> = props => (
  <Box
    as='td'
    css={{
      'textOverflow': 'ellipsis',

      ':nth-child(2)': { width: '100%' },
      ':nth-child(3)': { textAlign: 'end' }
    }}
    {...(props as any)}
  />
)

// styled('td')`
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   overflow: hidden;

//   display: flex;
//   padding: 0.35em 0.5em;
//   border-bottom: 1px solid var(--bg-3);

//   &:nth-child(6n + 1),
//   &:nth-child(6n + 2),
//   &:nth-child(6n + 3) {
//     background: var(--bg-6);
//   }

//   svg {
//     width: 1em;
//   }
// `

const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

const Tree: React.FunctionComponent<{
  tree: ITree
  repository: Repository
}> = ({ tree, repository }) => {
  if (SSG) {
    tree = {
      children: Array.from({ length: 12 }).map(() => ({ kind: 0 }))
    } as any
  }

  return (
    <Base sx={{ display: 'block' }} as='table'>
      <thead>
        <tr>
          <Cell>/</Cell>
          <Cell>Name</Cell>
          <Cell>Size</Cell>
        </tr>
      </thead>
      <tbody>
        {(tree.children || [])
          .sort((a, b) => (key(a) > key(b) ? -1 : 1)) // sort alphetically
          .sort((a, b) => (a.kind > b.kind ? 1 : -1)) // sort by kind (folder, file)
          .map((entry, i) => (
            <tr key={i}>
              <Cell>
                {SSG ? (
                  <Skeleton height={2} width={2} />
                ) : entry.kind === EntryKind.BLOB ? (
                  <File />
                ) : (
                  <Folder />
                )}
              </Cell>
              <Cell>
                {SSG ? (
                  <Skeleton height={2} width={`${rnd(13, 4)}rem`} />
                ) : (
                  <Link
                    style={{
                      color: `var(--${entry.kind ? 'fg-5' : 'primary'})`
                    }}
                    to={url(repository, tree, entry)}
                  >
                    {basename(key(entry))}
                  </Link>
                )}
              </Cell>
              <Cell>
                {SSG ? (
                  <Skeleton height={2} width={`${rnd(4, 1)}rem`} />
                ) : (
                  entry.kind !== EntryKind.TREE && pretty(entry.size)
                )}
              </Cell>
            </tr>
          ))}
      </tbody>
    </Base>
  )
}

export default Tree

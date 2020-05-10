import { styled } from 'goober'
import * as pretty from 'pretty-bytes'
import * as React from 'react'

import { SSG } from '@quercia/quercia'

import { EntryKind, Repository, Tree as ITree } from '../../types/data'
import Skeleton from '../skeleton'
import File from '../svgs/file'
import Folder from '../svgs/folder'
import { Link } from '../typography'
import Container from './container'
import { basename, key, url } from './path'

const Grid = styled(Container)`
  display: grid;
  grid-template-columns: auto 1fr auto;

  & > div:last-child,
  & > div:nth-last-child(2),
  & > div:nth-last-child(3) {
    border-bottom: 0;
  }

  & > div:last-child {
    border-bottom-right-radius: 0.5em;
  }

  & > div:nth-last-child(3) {
    border-bottom-left-radius: 0.5em;
  }

  & > div:nth-child(3) {
    border-top-right-radius: 0.5em;
  }

  & > div:first-child {
    border-top-left-radius: 0.5em;
  }
`

const Part = styled('div')`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  display: flex;
  padding: 0.35em 0.5em;
  border-bottom: 1px solid var(--bg-3);

  &:nth-child(6n + 1),
  &:nth-child(6n + 2),
  &:nth-child(6n + 3) {
    background: var(--bg-6);
  }

  svg {
    width: 1em;
  }
`

const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

const Tree: React.FunctionComponent<{
  tree: ITree
  repository: Repository
}> = ({ tree, repository }) => {
  if (SSG) {
    tree = {
      children: Array.from({ length: rnd(8, 16) }).map(() => ({ kind: 0 }))
    } as any
  }

  return (
    <Grid>
      <Part>/</Part>
      <Part>Name</Part>
      <Part>Size</Part>

      {(tree.children || [])
        .sort((a, b) => (key(a) > key(b) ? -1 : 1)) // sort alphetically
        .sort((a, b) => (a.kind > b.kind ? 1 : -1)) // sort by kind (folder, file)
        .map((entry, i) => (
          <React.Fragment key={i}>
            <Part>
              {SSG ? (
                <Skeleton
                  style={{ marginTop: '.125em' }}
                  height='1em'
                  width='1em'
                />
              ) : entry.kind === EntryKind.BLOB ? (
                <File />
              ) : (
                <Folder />
              )}
            </Part>
            <Part>
              {SSG ? (
                <Skeleton height='1.2em' width={rnd(13, 4) + 'em'} />
              ) : (
                <Link
                  style={{ color: `var(--${entry.kind ? 'fg-5' : 'primary'})` }}
                  to={url(repository, tree, entry)}
                >
                  {basename(key(entry))}
                </Link>
              )}
            </Part>
            <Part>
              {SSG ? (
                <Skeleton height='1.2em' width={rnd(4, 1) + 'em'} />
              ) : (
                entry.kind !== EntryKind.TREE && pretty(entry.size)
              )}
            </Part>
          </React.Fragment>
        ))}
    </Grid>
  )
}

export default Tree

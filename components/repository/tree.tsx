import * as React from 'react'
import { styled } from 'goober'
import * as pretty from 'pretty-bytes'

import Container from './container'
import { key, url, basename } from './path'

import Folder from '../svgs/folder'
import File from '../svgs/file'
import { Tree as ITree, EntryKind, Repository } from '../../types/data'
import { Link } from '../typography'

const Grid = styled(Container)`
  display: grid;
  grid-template-columns: auto 1fr auto;

  div:last-child,
  div:nth-last-child(2),
  div:nth-last-child(3) {
    border-bottom: 0;
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
    background: var(--bg-4);
  }

  svg {
    width: 1em;
  }
`

const Tree: React.FunctionComponent<{
  tree: ITree
  repository: Repository
}> = ({ tree, repository }) => (
  <Grid>
    <Part>/</Part>
    <Part>Name</Part>
    <Part>Size</Part>

    {(tree.children || [])
      .sort((a, b) => (key(a) > key(b) ? -1 : 1)) // sort alphetically
      .sort((a, b) => (a.kind > b.kind ? 1 : -1)) // sort by kind (folder, file)
      .map((entry, i) => (
        <React.Fragment key={i}>
          <Part>{entry.kind === EntryKind.BLOB ? <File /> : <Folder />}</Part>
          <Part>
            <Link
              style={{ color: `var(--${entry.kind ? 'fg-5' : 'primary'})` }}
              to={url(repository, tree, entry)}
            >
              {basename(key(entry))}
            </Link>
          </Part>
          <Part>{entry.kind !== EntryKind.TREE && pretty(entry.size)}</Part>
        </React.Fragment>
      ))}
  </Grid>
)

export default Tree

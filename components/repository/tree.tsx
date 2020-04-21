import * as React from 'react'
import { styled } from 'goober'

import Container from './container'
import Folder from '../svgs/folder'
import { Tree as ITree, EntryKind, Blob, Entry } from '../../types/data'

const Grid = styled(Container)`
  display: grid;
  grid-template-columns: 2em auto 4em;
`

const Part = styled('div')`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

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

const key = (entry: Entry): string => {
  return entry.kind == EntryKind.BLOB
    ? (entry as Blob).name
    : (entry as ITree).path
}

const Tree: React.FunctionComponent<{ tree: ITree }> = ({ tree }) => (
  <Grid>
    {(tree.children || [])
      .sort((a, b) => (key(a) > key(b) ? 1 : -1)) // sort alphetically
      .sort((a, b) => (a.kind > b.kind ? 1 : -1)) // sort by kind (folder, file)
      .map((entry, i) => (
        <React.Fragment key={i}>
          <Part>{entry.kind == EntryKind.BLOB ? 'f' : <Folder />}</Part>
          <Part>{key(entry)}</Part>
          <Part>{entry.size}</Part>
        </React.Fragment>
      ))}
  </Grid>
)

export default Tree

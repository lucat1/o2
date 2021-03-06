import * as React from 'react'
import { Box } from 'rebass'
import { SSG } from '@quercia/quercia'

import Link from '../link'

import {
  Blob,
  Entry,
  EntryKind,
  Repository,
  Tree
} from '../../types/repository'
import Skeleton from '../skeleton'

export const key = (entry: Entry): string => {
  return entry.kind === EntryKind.BLOB
    ? (entry as Blob).name
    : (entry as Tree).path
}

const base = (repo: Repository, tree: Tree, entry: Entry): string =>
  `/${repo.owner}/${repo.name}/${
    entry.kind === EntryKind.BLOB ? 'blob' : 'tree'
  }/${tree.branch.name}`

export const url = (repo: Repository, tree: Tree, entry: Entry): string =>
  `${base(repo, tree, entry)}${
    tree.path.startsWith('/') ? tree.path : '/'
  }${key(entry)}`

export const basename = (path: string): string => {
  const splits = path.split('/')
  return splits[splits.length - 1]
}

const Path: React.FC<{
  entry: Entry
  repository: Repository
}> = ({ entry, repository }) => {
  if (SSG) {
    return <Skeleton height={3} width={9} />
  }

  const k = key(entry)
  let parts = (k.endsWith('/') ? k.substr(0, k.length - 1) : k).split('/')

  if (k == '.') {
    parts = []
  }

  const pathTo = (k: string): string => {
    return parts.slice(0, parts.indexOf(k) + 1).join('/')
  }

  const _base = base(repository, entry as any, { kind: 0 } as any)

  return (
    <Box height={3}>
      <Link to={_base}>{repository.name}</Link>
      {parts.map((path, i) => (
        <React.Fragment key={i}>
          /
          {i !== parts.length - 1 ? (
            <Link to={`${_base}/${pathTo(path)}`}>{path}</Link>
          ) : (
            path
          )}
        </React.Fragment>
      ))}
    </Box>
  )
}

export default Path

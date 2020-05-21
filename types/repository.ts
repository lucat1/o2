export interface Repository {
  owner: string
  name: string
  description: string
}

export enum EntryKind {
  TREE = 0,
  BLOB = 1
}

export interface Entry {
  kind: EntryKind
  mode: string
  size: number
  branch: { name: string }
}

export interface Tree extends Entry {
  path: string
  children?: Entry[]
}

export interface Blob extends Entry {
  name: string
}

export interface Ref {
  kind: 'branch' | 'tag'
  name: string
  sha: string
}

export interface RepositoryProps {
  repository: Repository
  owns: boolean
  readme: string
  tree: Tree
  refs: Ref[]
}

import { Base as IBase, User } from './data'

export interface Repository {
  owner: string
  name: string
  description: string
}

export interface BlobProps {
  blob: Blob
  data: string
  ext: string
}

export type Base<T> = IBase<{ repository: Repository; owns: boolean } & T>

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
  readme: string
  tree: Tree
  refs: Ref[]
}

export interface Issue {
  id: number
  title: string
}

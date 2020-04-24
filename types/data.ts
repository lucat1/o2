export interface User extends LoggedUser {
  firstname: string
  lastname: string
  description: string
  location: string
  picture: string

  repositories: Repository[]
}

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

export interface Commit {
  commit: string
  abbreviated_commit: string
  tree: string
  abbreviated_tree: string
  parent: string
  abbreviated_parent: string
  refs: string
  encoding: string
  subject: string
  sanitized_subject_line: string
  body: string
  commit_notes: string
  verification_flag: string
  signer: string
  signer_key: string
  author: Author
  commiter: Author
}

export interface Author {
  name: string
  email: string
  date: string
}

export interface LoggedUser {
  username: string
  email: string
}

export interface BaseData {
  account?: LoggedUser
}

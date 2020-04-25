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
  abbrv: string
  tree: string
  abbrv_tree: string
  subject: string
  body: string
  author: Author
  commiter: Author
}

export interface Author {
  username: string
  email: string
  picture: string
  date: string
}

export interface LoggedUser {
  username: string
  email: string
}

export interface BaseData {
  account?: LoggedUser
}

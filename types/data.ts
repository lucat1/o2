import { Repository } from './repository'

export interface User extends LoggedUser {
  firstname: string
  lastname: string
  description: string
  location: string
  picture: string

  organizations: Organization[]
}

export interface Organization {
  name: string
  description: string
  location: string
  picture: string

  repositories: Repository[]
  users: User[]
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

export interface DetailedCommit extends Commit {
  diff: string
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
  picture: string
}

export type Base<T> = { account?: LoggedUser } & T

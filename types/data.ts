export interface User extends LoggedUser {
  firstname: string
  lastname: string
  description: string
  location: string
  picture: string
}

export interface Organization {
  name: string
  description: string
  location: string
  picture: string
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
  name: string
  email: string
  picture: string
  date: string
}

export interface Event<T = string> {
  type: T
  time: string
  data: any

  // repository data
  owner: string
  name: string
}

export interface CommitEvent extends Event<'commit'> {
  data: CommitEventData
}

export type CreateRepositoryEvent = Event<'create-repository'>

export interface CommitEventData {
  commits: Commit[]
  more: boolean
}

export interface LoggedUser {
  name: string
  email: string
  picture: string
}

export type Base<T> = { account?: LoggedUser } & T

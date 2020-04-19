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

export interface LoggedUser {
  username: string
  email: string
}

export interface BaseData {
  account?: LoggedUser
}

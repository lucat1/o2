export interface User extends LoggedUser {
  firstname: string
  lastname: string
  description: string
  location: string
  picture: string
}

export interface Repository {}

export interface LoggedUser {
  username: string
  email: string
}

export interface BaseData {
  account?: LoggedUser
}

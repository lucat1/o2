export interface LoggedUser {
  username: string
  email: string
}

export interface BaseData {
  account?: LoggedUser
}

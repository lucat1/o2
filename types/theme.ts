export interface Theme {
  dark: boolean
  background: string
  color: string

  red: string
}

const shared = {
  primary: '#C792EA',
  red: 'red'
}

export const light: Theme = {
  ...shared,
  dark: false,
  background: '#f5f5f5',
  color: '#000'
}

export const dark: Theme = {
  ...shared,
  dark: true,
  background: '#000',
  color: '#fff'
}

export default Theme

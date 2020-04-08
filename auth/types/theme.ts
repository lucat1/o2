export interface Theme {
  dark: boolean
  background: string
  color: string
}

export const light: Theme = {
  dark: false,
  background: '#f5f5f5',
  color: '#000'
}

export const dark: Theme = {
  dark: true,
  background: '#000',
  color: '#fff'
}

export default Theme

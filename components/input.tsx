import * as React from 'react'
import styled from '@emotion/styled'
import { darken, lighten } from 'polished'

import Theme from '../types/theme'

const Container = styled.div<{ theme?: Theme }>`
  display: flex;
  flex-direction: column;
`

const Label = styled.label<{ theme?: Theme; error?: boolean }>`
  margin: 0.25rem 0 0.25rem 1rem;
  color: ${props => (props.error ? props.theme.red : props.theme.color)};
  float: ${props => (props.error ? 'right' : 'left')};
`

const InputBase = styled.input<{ theme?: Theme }>`
  height: 2rem;
  font-size: 1rem;
  min-width: 16rem;
  padding: 0 0.75rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.color};
  background: ${({ theme, disabled }) =>
    theme.dark
      ? disabled
        ? darken(0.5)(theme.background)
        : darken(0.1)(theme.background)
      : disabled
      ? lighten(0.1)(theme.background)
      : lighten(0.5)(theme.background)};

  outline: none;
  transition: border-width, height 0.3s ease-in-out;
  border-radius: 2rem;
  border: 0.0625rem solid
    ${({ theme }) =>
      theme.dark
        ? lighten(0.2)(theme.background)
        : darken(0.2)(theme.background)};

  :focus {
    border-width: 0.125rem;
  }
`

interface InputProps {
  label?: string
  error?: string
}

const Input: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    InputProps
> = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <Container>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <InputBase {...props} ref={ref} />
      {error && (
        <Label error htmlFor={props.id}>
          {error}
        </Label>
      )}
    </Container>
  )
})

if (process.env.NODE_ENV !== 'production') {
  Input.displayName = 'Input'
}

export default Input

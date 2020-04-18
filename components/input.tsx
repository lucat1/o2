import * as React from 'react'
import { styled } from 'goober'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
`

const Label = styled('label')<{ error?: boolean }>`
  margin: 0.25rem 0 0.25rem 1rem;
  color: var(${props => (props.error ? '--red' : '--fg-5')});
  float: ${props => (props.error ? 'right' : 'left')};
`

const InputBase = styled('input')`
  height: 2rem;
  font-size: 1rem;
  min-width: 16rem;
  padding: 0 0.75rem;
  margin-bottom: 1.5rem;
  color: var(--fg-5);
  background: var(--bg-5);

  outline: none;
  transition: border-width, height 0.3s ease-in-out;
  border-radius: 2rem;
  border: 0.0625rem solid var(--bg-5);

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

import { styled } from 'goober'
import * as React from 'react'

const Container = styled('div')`
  width: 20%;
  display: flex;
  flex-direction: column;
  font-size: 1em;
  margin: 1em 0;
`

const ErrorLabel = styled('label')`
  font-size: 0.65em;
  margin-top: 0.25em;
  color: var(--error);
  user-select: none;
`

const InputBase = styled('input', React.forwardRef)<{ ref: any }>`
  width: 100%;
  font-size: 0.85em;
  font-family: var(--ff);
  padding: 0.5em 1em;
  border-radius: 0.5em;
  color: var(--fg-5);
  background: var(--bg-5);
  outline: none;
  transition: box-shadow 200ms ease-in-out;
  border: 1px solid var(--bg-3);

  &:focus {
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.2);
    border-color: rgba(var(--primary-rgb), 0.4);
  }

  &:-webkit-autofill {
    animation: autofill 0s forwards;
  }

  @keyframes autofill {
    100% {
      background: transparent;
      color: inherit;
    }
  }
`

interface InputProps {
  label?: string
  error?: string
  inline?: string
}

// TODO: reimplement inline

const Input: React.FunctionComponent<React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  InputProps> = React.forwardRef(
  ({ label, error, inline, className, ...props }, ref) => {
    return (
      <Container className={className}>
        <InputBase placeholder={label || inline} {...props} ref={ref} />

        {error && <ErrorLabel htmlFor={props.id}>{error}</ErrorLabel>}
      </Container>
    )
  }
)

if (process.env.NODE_ENV !== 'production') {
  Input.displayName = 'Input'
}

export default Input

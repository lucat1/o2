import * as React from 'react'
import { styled } from 'goober'

const Container = styled('div')`
  width: 20%;
  display: flex;
  flex-direction: column;
  font-size: 1em;
  margin: 1em 0;

  @media (max-width: 960px) {
    width: 90%;
  }
`

const Label = styled('label')<{ error?: boolean }>`
  font-size: 0.75em;
  margin: 0.25em 0;
  color: var(--fg-5);
`

const ErrorLabel = styled('label')`
  font-size: 0.65em;
  margin-top: 0.25em;
  color: var(--error);
  user-select: none;
`

const InputBase = styled('input', React.forwardRef)<{ ref: any }>`
  height: 1.5em;
  width: 100%;
  font-size: 1em;
  padding: 0 0.75em;
  border-radius: 1.5em;
  color: var(--fg-5);
  background: var(--bg-5);
  outline: none;
  transition: border-width, height 0.3s ease-in-out;
  border: 1px solid var(--bg-3);

  &:-webkit-autofill {
    animation: autofill 0s forwards;
  }

  @keyframes autofill {
    100% {
      background: transparent;
      color: inherit;
      font-size: inherit;
    }
  }
`

const InlineContainer = styled('div')`
  display: flex;
  margin-bottom: 1.5em;

  input {
    margin: 0;
  }
`

const Inline = styled('div')`
  height: 1.5em;
  line-height: 1.5em;
  border-radius: 1.5em;
  padding: 0 0.75em;

  padding-right: 2em;
  margin-right: -1.75em;

  background: var(--primary);
  color: var(--bg-5);
  border: 1px solid var(--bg-5);
`

interface InputProps {
  label?: string
  error?: string
  inline?: string
}

const Input: React.FunctionComponent<React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  InputProps> = React.forwardRef(({ label, error, inline, ...props }, ref) => {
  return (
    <Container>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      {inline ? (
        <InlineContainer>
          <Inline>{inline}</Inline>
          <InputBase {...props} ref={ref} />
        </InlineContainer>
      ) : (
        <InputBase {...props} ref={ref} />
      )}

      {error && <ErrorLabel htmlFor={props.id}>{error}</ErrorLabel>}
    </Container>
  )
})

if (process.env.NODE_ENV !== 'production') {
  Input.displayName = 'Input'
}

export default Input

import * as React from 'react'
import { styled } from 'goober'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  font-size: 1em;
`

const Label = styled('label')<{ error?: boolean }>`
  margin: 0.25rem 0 0.25rem 1rem;
  color: var(${props => (props.error ? '--red' : '--fg-5')});
  float: ${props => (props.error ? 'right' : 'left')};
`

const InputBase = styled('input')`
  height: 1.5em;
  width: 12em;
  font-size: 1em;
  padding: 0 0.75em;
  margin-bottom: 1.5em;
  border-radius: 1.5em;
  color: var(--fg-5);
  background: var(--bg-5);

  outline: none;
  transition: border-width, height 0.3s ease-in-out;
  border: 1px solid var(--bg-3);
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

const Input: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    InputProps
> = React.forwardRef(({ label, error, inline, ...props }, ref) => {
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

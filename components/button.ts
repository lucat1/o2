import { styled } from 'goober'

interface ButtonProps {
  small?: boolean
  tiny?: boolean
  secondary?: boolean
}

const Button = styled('button')<ButtonProps>`
  min-height: ${({ small, tiny }) => (tiny ? 1.25 : small ? 2.3 : 2.6)}em;
  min-width: ${({ small, tiny }) => (tiny ? 1.25 : small ? 5.5 : 8)}em;
  border-radius: 0.5em;
  font-family: var(--ff);
  font-size: 0.75em;
  background: ${({ secondary }) =>
    secondary ? 'transparent' : 'var(--primary)'};
  color: var(--bg-5);
  padding: 0.5em 1em;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;

  border: ${({ secondary }) =>
    '1px solid ' + (secondary ? 'var(--bg-4)' : 'transparent')};
  outline: none;
  margin: ${({ small, tiny }) => (tiny ? 0 : small ? '0 1em' : '1.5em')};
  transition: box-shadow 200ms ease-in-out;

  &:focus {
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.4);
  }

  &[disabled] {
    box-shadow: none;
    cursor: default;
    background: var(--bg-3);
  }
`

export default Button

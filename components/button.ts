import { styled } from 'goober'

const Button = styled('button')<{ sm?: boolean }>`
  height: ${({ sm }) => (sm ? 2 : 2.5)}em;
  min-width: ${({ sm }) => (sm ? 5.5 : 8)}em;
  border-radius: 0.45em;
  font-family: var(-ff);
  font-size: 0.75em;
  background: var(--primary);
  color: var(--bg-5);

  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border: none;
  outline: none;
  margin: ${({ sm }) => (sm ? '0 1em' : '1.5em')};
  box-shadow: var(--box-shadow-small);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: var(--box-shadow-medium);
  }

  &[disabled] {
    box-shadow: none;
    cursor: default;
    background: var(--bg-6);
  }
`

export default Button

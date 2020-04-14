import styled from '@emotion/styled'
import { rgba } from 'polished'

import Theme from '../types/theme'

const Button = styled.button<{ theme?: Theme }>`
  height: 2.5em;
  min-width: 8em;
  border-radius: 0.5em;
  font-size: 0.75em;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};

  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border: none;
  outline: none;
  margin: 1.5rem;
  box-shadow: ${({ theme }) =>
    theme.dark
      ? `0 5px 30px ${rgba(theme.color, 0.5)}`
      : `0 5px 10px ${rgba(theme.color, 0.12)}`};
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: ${({ theme }) =>
      theme.dark
        ? `0 8px 60px ${rgba(theme.color, 0.5)}`
        : `0 8px 30px ${rgba(theme.color, 0.12)}`};
  }
`

export default Button

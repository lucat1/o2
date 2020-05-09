import { styled } from 'goober'

export const List = styled('ul')`
  list-style: none;
  padding: 0.5em 0;
  margin: 0;
`

export const Item = styled('li')<{ selected?: boolean }>`
  padding: 0.5em 0.75em;

  &:hover {
    background: var(--bg-4);
  }
`

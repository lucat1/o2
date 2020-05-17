import { styled } from 'goober'

export const List = styled('ul')`
  list-style: none;
  line-height: 1em;
  padding 0;
  margin: 0;
`

export const Item = styled('li')<{ selected?: boolean }>`
  padding: 0.5em 0.75em;
  cursor: pointer;

  color: ${({ selected }) => (selected ? 'var(--primary)' : 'inherit')};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'inherit')};

  display: flex;
  align-items: center;

  &:hover {
    background: var(--bg-4);
  }
`

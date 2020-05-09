import { Link } from '@quercia/quercia'
import { styled } from 'goober'

export const Tabs = styled('nav')`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: auto;
  padding: 0.5em 0;
  margin-bottom: 1em;
`

export const Tab = styled(Link)<{ selected: boolean }>`
  font-size: 0.75em;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'inherit')};
  padding: 0.45em 0.75em;
  margin: 0 0.25em;

  transition: box-shadow 200ms ease-in-out;
  text-decoration: none;
  outline: none;
  color: var(--fg-4);

  border: 1px solid var(--bg-4);
  border-radius: 0.75em;
  background: ${({ selected }) => (selected ? 'var(--bg-4)' : 'inherit')};

  &:focus {
    border-color: rgba(var(--primary-rgb), 0.4);
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.2);
  }
`

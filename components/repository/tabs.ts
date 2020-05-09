import { Link } from '@quercia/quercia'
import { styled } from 'goober'

export const Tabs = styled('nav')`
  display: flex;
  flex-direction: row;
  overflow: auto;

  margin: 0.5em 0;
  align-items: center;
  overflow-y: hidden;
  overflow-x: scroll;
  flex-basis: 0;
  flex-grow: 999;
  min-width: 24em;

  @media (min-width: 600px) {
    justify-content: flex-end;
  }
`

export const Tab = styled(Link)<{ selected: boolean }>`
  font-size: 0.75em;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'inherit')};
  padding: 0.45em 1em;

  text-decoration: none;
  color: var(--fg-4);

  border-radius: 0.75em;
  background: ${({ selected }) => (selected ? 'var(--bg-4)' : 'inherit')};
`

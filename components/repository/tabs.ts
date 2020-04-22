import { Link } from '@quercia/quercia'
import { styled } from 'goober'

export const Tabs = styled('nav')`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: auto;

  height: 1.5em;
  align-items: center;
  justify-content: flex-end;
`

export const Tab = styled(Link)<{ selected: boolean }>`
  font-size: 0.85em;
  padding: 0.25em 0.6em;

  text-decoration: none;
  color: var(--fg-5);

  border-radius: 0.45em;
  background: var(--${({ selected }) => (selected ? 'bg-3' : 'bg-5')});
`

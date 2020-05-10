import { styled } from 'goober'

export const Line = styled('div')`
  height: 1px;
  background: var(--bg-3);
`

export default styled('div')`
  border-radius: 0.5em;
  border: 1px solid var(--bg-3);
  width: calc(100% - 2px);
  margin: 1em 0;
`

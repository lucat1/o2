import { styled } from 'goober'
import B, { Center as C } from '../base'

export const Center = styled(C)`
  height: calc(100vh - 3.5rem);
  flex: 1;
`

export const Base = styled(B)`
  width: 50%;

  @media (max-width: 960px) {
    width: 90%;
  }
`

export const Content = styled('div')`
  padding: 0.5em;
`

export const PadContent = styled(C)`
  padding: 2em 0.5em;
`

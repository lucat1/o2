import { styled } from 'goober'

export const Parent = styled('main')`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
`

export const Left = styled('nav')`
  height: 50%;
  flex-basis: 15em;
  flex-grow: 1;
`

export const Right = styled('section')`
  height: 100%;
  flex-basis: 0;
  flex-grow: 999;
  min-width: 60%;
`

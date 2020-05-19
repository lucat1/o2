import styled from '@emotion/styled'
import { Flex } from 'rebass'

export const Parent = styled(Flex)`
  flex: 1;
  flex-wrap: wrap;
  overflow: hidden;
`

export const Left = styled(Flex)`
  flex-basis: 15rem;
  flex-grow: 1;
`

export const Right = styled(Flex)`
  flex-basis: 0;
  flex-grow: 999;
  min-width: 60%;
`

import styled from '@emotion/styled'
import { themeGet } from '@styled-system/theme-get'
import { Flex } from 'rebass'

const Body = styled(Flex)`
  margin: auto;
  width: min(100%, calc(60em + 6vw));
  padding: 0 ${themeGet('space.3')};
`

export default Body

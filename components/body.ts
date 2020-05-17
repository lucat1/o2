import styled from '@emotion/styled'
import { size } from 'styled-system'
import { themeGet } from '@styled-system/theme-get'
import { Flex } from 'rebass'

const Body = styled(Flex)`
  margin: auto;
  width: min(100%, calc(60em + 6vw));
  height: calc(100vh - ${({ height }) => height || themeGet('sizes.5')});
  padding: 0 ${themeGet('space.3')};
`

export default Body

import * as React from 'react'
import { themeGet } from '@styled-system/theme-get'
import styled from '@emotion/styled'
import { Flex, FlexProps } from 'rebass'

const CustomFlex = styled(Flex)`
  margin: auto;
  overflow: ${({ height }) => (height ? 'unset' : 'auto')};
  width: min(100%, calc(60em + 6vw));
`

const Body: React.FC<FlexProps> = props => (
  <CustomFlex
    {...(props as any)}
    as='main'
    sx={Object.assign({ px: 4 }, props.sx)}
  />
)

export default Body

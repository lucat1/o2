import * as React from 'react'
import { Flex } from 'rebass'

import Image from '../image'
import Container from '../base'

const Comment: React.FC<{ picture: string }> = ({ children, picture }) => (
  <Flex my={4} flex={1}>
    <Image width={4} height={4} src={`/picture/${picture}`} />
    <Container flexDirection='column' flex={1} ml={2} my={0}>
      {children}
    </Container>
  </Flex>
)

export default Comment

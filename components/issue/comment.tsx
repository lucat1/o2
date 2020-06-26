import * as React from 'react'
import { Flex } from 'rebass'

import Link from '../link'
import Image from '../image'
import Container from '../base'

const Comment: React.FC<{ picture: string; name: string }> = ({
  children,
  picture,
  name
}) => (
  <Flex my={4} flex={1}>
    <Link mt={1} known to={`/${name}`}>
      <Image width={4} height={4} src={`/picture/${picture}`} />
    </Link>
    <Container flexDirection='column' flex={1} ml={2} my={0}>
      {children}
    </Container>
  </Flex>
)

export default Comment

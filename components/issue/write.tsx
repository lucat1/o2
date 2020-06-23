import * as React from 'react'
import { Flex, Box } from 'rebass'
import { Textarea } from '@rebass/forms'
import { usePage } from '@quercia/quercia'

import Comment from './comment'
import Text from '../text'
import Divider from '../divider'

const Write = React.forwardRef((_, ref) => {
  const { account } = usePage()[1]

  return (
    <Comment picture={account?.picture}>
      <Box css={{ userSelect: 'none' }} py={1} px={4}>
        <Text color='bg.3' fontSize='xs'>
          about to comment:
        </Text>
      </Box>
      <Divider />
      <Textarea
        ref={ref}
        sx={{
          'fontFamily': 'default',
          'fontSize': 'xs',
          'minHeight': 7,

          // shadow on focus
          'transition': 'box-shadow 200ms ease-in-out',
          'borderBottomRightRadius': 'md',
          'borderBottomLeftRadius': 'md',
          ':focus': {
            boxShadow: 'focus'
          }
        }}
        css={{
          outline: 'none',
          border: 0,
          maxWidth: '100%',
          minWidth: '100%'
        }}
      />
    </Comment>
  )
})

export default Write

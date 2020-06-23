import * as React from 'react'
import { usePage } from '@quercia/quercia'
import { Flex } from 'rebass'
import { Textarea } from '@rebass/forms'

import Comment from './comment'
import Button from '../button'
import Divider from '../divider'

const Write: React.FC = () => {
  const { account } = usePage()[1]

  return (
    <Comment picture={account?.picture}>
      <Textarea
        maxWidth='100%'
        minWidth='100%'
        minHeight={7}
        css={{ outline: 'none', border: 0 }}
      />
      <Divider />
      <Flex justifyContent='flex-end' py={2} px={4}>
        <Button type='submit' maxWidth={5}>
          Comment
        </Button>
      </Flex>
    </Comment>
  )
}

export default Write

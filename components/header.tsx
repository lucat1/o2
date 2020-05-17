import * as React from 'react'
import { Flex, Button } from 'rebass'

import { navigate } from '@quercia/quercia'

import Body from './body'
import Link from './link'
import Avatar from './avatar'
import Logo from './svgs/logo'

import { Base } from '../types/data'

const Header: React.FC<Base<{}>> = ({ account }) => {
  return (
    <Flex
      as='nav'
      bg='bg.6'
      height={6}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'bg.3',
        position: 'sticky'
      }}
    >
      <Body height={6} alignItems='center' justifyContent='space-between'>
        <Link color='fg.5' to='/'>
          <Logo width='1rem' onClick={() => navigate('/')} />
        </Link>
        {account ? (
          <Avatar {...account} />
        ) : (
          <Flex alignItems='center'>
            <Link mx={4} to='/login'>
              Login
            </Link>
            <Button variant='md' onClick={() => navigate('/register')}>
              Sign up
            </Button>
          </Flex>
        )}
      </Body>
    </Flex>
  )
}

export default Header

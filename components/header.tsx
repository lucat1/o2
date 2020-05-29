import * as React from 'react'
import { Flex } from 'rebass'

import { navigate } from '@quercia/quercia'

import Body from './body'
import Link from './link'
import Avatar from './avatar'
import Logo from './svgs/logo'
import Button from './button'

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
        position: 'sticky',
        zIndex: 200
      }}
    >
      <Body height={6} alignItems='center' justifyContent='space-between'>
        <Link known aria-label='Link to the homepage' color='fg.5' to='/'>
          <Logo width='1rem' onClick={() => navigate('/')} />
        </Link>
        {account ? (
          <Avatar {...account} />
        ) : (
          <Flex alignItems='center'>
            <Link mx={4} to='/login'>
              Login
            </Link>
            <Link css={{ textDecoration: 'none' }} color='bg.5' to='/register'>
              <Button variant='md'>Sign up</Button>
            </Link>
          </Flex>
        )}
      </Body>
    </Flex>
  )
}

export default Header

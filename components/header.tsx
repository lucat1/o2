import * as React from 'react'
import { Flex, Button } from 'rebass'
import styled from '@emotion/styled'

import { navigate } from '@quercia/quercia'

import Body from './body'
import Relative from './relative'
import Dropdown from './dropdown'

import { BaseData, LoggedUser } from '../types/data'
import I from './image'
import { List, Item } from './list'
import { Line } from './base'
import { SpacedLink } from './typography'
import Logo from './svgs/logo'
import Link from './link'

const Image = styled(I)`
  width: 1.5em;
  height: 1.5em;
  cursor: pointer;
  outline: none;
  transition: box-shadow 200ms ease-in-out;

  &:focus {
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.3);
  }
`
const Avatar: React.FC<LoggedUser> = ({ picture, username }) => {
  const [open, setOpen] = React.useState(false)
  const go = React.useCallback((url: string) => {
    setOpen(false)
    navigate(url)
  }, [])

  return (
    <Relative as={Flex}>
      <Image
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyUp={e => e.keyCode == 13 && setOpen(!open)}
        alt='Your profile picture'
        src={picture}
      />
      <Dropdown
        sx={{ top: '2.25em' }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <List>
          <Item onClick={() => go(`/${username}`)}>Your profile</Item>
          <Item onClick={() => go('/new')}>New</Item>
          <Line />
          <Item onClick={() => go('/logout')}>Logout</Item>
        </List>
      </Dropdown>
    </Relative>
  )
}

const Header: React.FC<BaseData> = ({ account }) => {
  return (
    <Flex
      as='nav'
      bg='bg.6'
      height={5}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'bg.3',
        position: 'sticky'
      }}
    >
      <Body height={5} alignItems='center' justifyContent='space-between'>
        <Link color='fg.5' to='/'>
          <Logo width='1rem' onClick={() => navigate('/')} />
        </Link>
        {account ? (
          <Avatar {...account} />
        ) : (
          <Flex alignItems='center'>
            <SpacedLink known to='/login'>
              Login
            </SpacedLink>
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

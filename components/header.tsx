import * as React from 'react'
import { Flex } from 'rebass'
import styled from '@emotion/styled'

import { navigate } from '@quercia/quercia'

import { BaseData } from '../types/data'
import Button from './button'
import D, { Container as DC } from './dropdown'
import I from './image'
import { List, Item } from './list'
import { Line } from './base'
import { SpacedH4, SpacedLink } from './typography'
import Logo from './svgs/logo'

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

const Dropdown = styled(D)`
  top: 2.25em;
`

const DContainer = styled(DC)`
  margin: 0 0.85em;
`

const Header: React.FunctionComponent<BaseData> = ({ account }) => {
  const [open, setOpen] = React.useState(false)

  const go = React.useCallback((url: string) => {
    setOpen(false)
    navigate(url)
  }, [])

  return (
    <Flex
      px={4}
      height={5}
      sx={{ borderBottom: '1px solid', borderColor: 'grey.3' }}
      alignItems='center'
      justifyContent='space-between'
    >
      <Flex alignItems='center'>
        <Logo width='1rem' onClick={() => navigate('/')} />
        <SpacedH4 known>o2</SpacedH4>
      </Flex>
      {account ? (
        <DContainer>
          <Image
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyUp={e => e.keyCode == 13 && setOpen(!open)}
            alt='Your profile picture'
            src={account.picture}
          />
          <Dropdown open={open} onClose={() => setOpen(false)}>
            <List>
              <Item onClick={() => go(`/${account?.username}`)}>
                Your profile
              </Item>
              <Item onClick={() => go('/new')}>New</Item>
              <Line />
              <Item onClick={() => go('/logout')}>Logout</Item>
            </List>
          </Dropdown>
        </DContainer>
      ) : (
        <Flex alignItems='center'>
          <SpacedLink known to='/login'>
            Login
          </SpacedLink>
          <Button small onClick={() => navigate('/register')}>
            Sign up
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default Header

import { styled } from 'goober'
import * as React from 'react'

import { navigate } from '@quercia/quercia'

import { BaseData } from '../types/data'
import B from './body'
import Button from './button'
import D, { Container as DC } from './dropdown'
import I from './image'
import { List, Item } from './list'
import L from './svgs/logo'
import { Line } from './base'
import { SpacedH4, SpacedLink } from './typography'

const Container = styled('nav')`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;

  height: calc(2.5em - 1px);

  background: var(--bg-6);
  border-bottom: 1px solid var(--bg-3);
  z-index: 10;
`

const Body = styled(B)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }
`

const Logo = styled(L)`
  height: 0.75em;
  margin: 0.85em;
  cursor: pointer;
`

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
  right: 0;
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
    <Container>
      <Body>
        <div>
          <Logo onClick={() => navigate('/')} />
          <SpacedH4 known>o2</SpacedH4>
        </div>
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
          <div>
            <SpacedLink known to='/login'>
              Login
            </SpacedLink>
            <Button small onClick={() => navigate('/register')}>
              Sign up
            </Button>
          </div>
        )}
      </Body>
    </Container>
  )
}

if (process.env.NODE_ENV !== 'production') {
  Header.displayName = 'Header'
}

export default Header

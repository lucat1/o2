import { styled } from 'goober'
import * as React from 'react'

import { navigate, usePage } from '@quercia/quercia'

import { BaseData } from '../types/data'
import B from './body'
import Button from './button'
import D from './dropdown'
import I from './image'
import { Line } from './base'
import A from './svgs/add'
import L from './svgs/logo'
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
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;
  cursor: pointer;
  outline: none;
  transition: box-shadow 200ms ease-in-out;

  img {
    border-radius: 50%;
  }

  &:focus {
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.3);
  }
`

const Add = styled(A)`
  height: 1em;
  cursor: pointer;
`

const Dropdown = styled(D)`
  font-size: 0.75em;
  position: absolute;
  top: 3em;
  margin-left: -5.5em;
  width: calc(8em - 2px);

  a {
    display: block;
    margin: 0.75em 0.5em;
  }
`

const Header: React.FunctionComponent = () => {
  const props = usePage()[1] as BaseData
  const [open, setOpen] = React.useState(false)

  return (
    <Container>
      <Body>
        <div>
          <Logo onClick={() => navigate('/')} />
          <SpacedH4 known>o2</SpacedH4>
        </div>
        <div>
          {props.account ? (
            <>
              <Add onClick={() => navigate('/add')} />
              {/* TODO: find a more elegant way :( */}
              <div style={{ padding: '0 0.85em' }}>
                <Image
                  tabIndex={0}
                  onClick={() => setOpen(true)}
                  onKeyUp={e => e.keyCode == 13 && setOpen(!open)}
                  alt='Your profile picture'
                  src={props.account.picture}
                />
                <Dropdown open={open} onClose={() => setOpen(false)}>
                  <SpacedLink to={`/${props.account.username}`}>
                    your profile
                  </SpacedLink>
                  <Line />
                  <SpacedLink to='/logout'>logout</SpacedLink>
                </Dropdown>
              </div>
            </>
          ) : (
            <>
              <SpacedLink known to='/login'>
                Login
              </SpacedLink>
              <Button small onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </Body>
    </Container>
  )
}

if (process.env.NODE_ENV !== 'production') {
  Header.displayName = 'Header'
}

export default Header

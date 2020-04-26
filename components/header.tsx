import * as React from 'react'
import { usePage, navigate } from '@quercia/quercia'
import { styled } from 'goober'

import { SpacedH4, SpacedLink, Link } from './typography'
import Button from './button'
import _Logo from './svgs/logo'

import { BaseData } from '../types/data'
import _Body from './body'

const Container = styled('nav')`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;

  height: calc(2.5em - 1px);

  background: var(--bg-4);
  border-bottom: 1px solid var(--bg-3);
  z-index: 10;
`

const Body = styled(_Body)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }
`

const Logo = styled(_Logo)`
  height: 0.75em;
  margin: 0.85em;
  cursor: pointer;
`

const Header: React.FunctionComponent = () => {
  const props = usePage()[1] as BaseData

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
              <SpacedLink to='/add'>+</SpacedLink>
              <SpacedH4>
                <Link known to={`/${props.account.username}`}>
                  {props.account.username}
                </Link>
              </SpacedH4>
              <SpacedLink to='/logout'>⟶</SpacedLink>
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

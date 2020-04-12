import * as React from 'react'
import { usePage, Link as QLink } from '@quercia/quercia'
import styled from '@emotion/styled'
import { darken, lighten } from 'polished'

import { SpacedA, SpacedH4, SpacedLink, Link } from './typography'
import _Logo from './logo'

import Theme from '../types/theme'
import services from '../types/services'
import { BaseData } from '../types/data'

const Container = styled.nav<{ theme?: Theme }>`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;

  /* 2.5 ems - the border (0.0625em) */
  height: 2.4375em;
  padding: 0 3em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  background: ${({ theme }) =>
    theme.dark
      ? darken(0.1)(theme.background)
      : lighten(0.5)(theme.background)};
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.dark
        ? lighten(0.2)(theme.background)
        : darken(0.2)(theme.background)};
`

const Logo = styled(_Logo)`
  height: 0.75em;
  margin: 1em;
  margin-left: 0;
`

interface HeaderProps {
  service: string
}

const Header: React.FunctionComponent<HeaderProps> = ({ service }) => {
  const props = usePage()[1] as BaseData

  return (
    <Container>
      <div>
        <QLink to='/'>
          <Logo />
        </QLink>
        <SpacedH4 known>{service}</SpacedH4>
        {services
          .filter(srv => srv !== service)
          .map(service => (
            <SpacedA key={service} href='/'>
              {service}
            </SpacedA>
          ))}
      </div>
      <div>
        {props.account ? (
          <>
            <SpacedH4>
              <Link known to='/profile'>
                {props.account.username}
              </Link>
            </SpacedH4>
            <Link to='/logout'>⟶</Link>
          </>
        ) : (
          <>
            <SpacedLink known to='/login'>
              login
            </SpacedLink>
            <a style={{ userSelect: 'none' }}>/</a>
            <SpacedLink known to='/register'>
              register
            </SpacedLink>
          </>
        )}
      </div>
    </Container>
  )
}

if (process.env.NODE_ENV !== 'production') {
  Header.displayName = 'Header'
}

export default Header

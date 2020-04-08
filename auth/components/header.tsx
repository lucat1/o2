import * as React from 'react'
import { usePage } from '@quercia/quercia'
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

  height: 3.5rem;
  padding: 0 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  font-size: 1.15rem;
  background: ${({ theme }) =>
    theme.dark
      ? darken(0.1)(theme.background)
      : lighten(0.5)(theme.background)};
  border-bottom: 1px solid ${props => darken(0.2)(props.theme.background)};
`

const Logo = styled(_Logo)`
  height: 1.5rem;
  margin: 1rem;
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
        <Logo />
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
        {props.loggedUser ? (
          <SpacedH4>
            <Link known to='/profile'>
              {props.loggedUser.username}
            </Link>
          </SpacedH4>
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

export default Header

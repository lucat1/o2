import * as React from 'react'
import { Flex, FlexProps, Button } from 'rebass'
import merge from 'deep-extend'

import Link, { LinkProps } from './link'

export const Tabs: React.FC<FlexProps> = props => (
  <Flex
    {...(props as any)}
    as='nav'
    css={merge(
      {
        alignItems: 'center',
        overflow: 'auto'
      },
      props.css
    )}
    sx={merge(
      {
        py: 2
        // margin-bottom: 1em;
      },
      props.sx
    )}
  />
)

export const Tab: React.FC<LinkProps & { selected?: boolean }> = ({
  selected,
  to,
  href,
  ...props
}) => (
  <Link
    to={to}
    href={href}
    css={{ outline: 'none', textDecoration: 'none' }}
    sx={{ fontSize: 'sm' }}
  >
    <Button
      sx={merge({ py: 2, px: 3, mx: 1 }, props.sx)}
      css={{ minWidth: 'unset' }}
      variant='md-secondary'
      {...(props as any)}
    />
  </Link>
)

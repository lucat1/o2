import * as React from 'react'
import { Flex, FlexProps } from 'rebass'
import merge from 'deep-extend'

import Link, { LinkProps } from './link'
import Button from './button'

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
  ...props
}) => (
  <Link
    to={to}
    css={{ outline: 'none', textDecoration: 'none', minWidth: 'unset' }}
    sx={{ fontSize: 'sm' }}
  >
    <Button
      sx={merge(
        {
          'py': 2,
          'px': 3,
          'mx': 2,
          ':last-child': { mr: 0 },
          'color': selected && 'primary.default'
        },
        props.sx
      )}
      css={{ minWidth: 'unset' }}
      variant='md-secondary'
      {...(props as any)}
    />
  </Link>
)

import * as React from 'react'
import { Flex, FlexProps } from 'rebass'
import merge from '../types/xtend'

import Button from './button'
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
  ...props
}) => (
  <Link
    known
    to={to}
    css={{ outline: 'none', textDecoration: 'none', minWidth: 'unset' }}
    sx={{ 'fontSize': 'sm', 'mx': 1, ':last-child': { mr: 0 } }}
  >
    <Button
      sx={merge(
        {
          py: 2,
          px: 3,
          color: selected ? 'primary.default' : 'fg.5'
        },
        props.sx
      )}
      css={{ minWidth: 'unset' }}
      variant='md-secondary'
      {...(props as any)}
    />
  </Link>
)

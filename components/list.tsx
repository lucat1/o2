import * as React from 'react'
import { Box, BoxProps, Flex, FlexProps } from 'rebass'

export const List: React.FC<BoxProps> = props => (
  <Box
    as='ul'
    p={0}
    m={0}
    css={{ listStyle: 'none', lineHeight: '1rem' }}
    {...(props as any)}
  />
)

export const Item: React.FC<FlexProps & { selected?: boolean }> = ({
  selected,
  ...props
}) => (
  <Flex
    as='ul'
    py={1}
    px={3}
    alignItems='center'
    css={{
      listStyle: 'none',
      lineHeight: '1rem',
      cursor: 'pointer'
    }}
    sx={Object.assign(
      {
        'color': selected ? 'primary.default' : 'inherit',
        'fontWeight': selected ? 'bold' : 'inherit',
        ':hover': { bg: 'bg.4' }
      },
      (props as any).sx
    )}
    {...(props as any)}
  />
)

// styled(Flex)<{ selected?: boolean }>`
//     padding: 0.5em 0.75em;
//     cursor: pointer;

//     color: ${({ selected }) => (selected ? 'var(--primary)' : 'inherit')};
//     font-weight: ${({ selected }) => (selected ? 'bold' : 'inherit')};

//     display: flex;
//     align-items: center;

//     &:hover {
//       background: var(--bg-4);
//     }
//   `

import * as React from 'react'
import { FlexProps, Text, TextProps } from 'rebass'
import { navigate } from '@quercia/quercia'

import Relative from '../relative'
import Center from '../center'
import Button from '../button'
import Arrow from '../svgs/arrow'
import Dropdown from '../dropdown'
import { Item, List } from '../list'

import { Ref, Repository } from '../../types/data'

const HideOnSmall: React.FC<TextProps> = props => (
  <Text as='a' sx={{ display: ['none', 'inherit'] }} {...(props as any)} />
)

const Tag: React.FC<FlexProps> = props => (
  <Center
    sx={{
      fontSize: 'xs',
      bg: 'bg.3',
      width: 3,
      height: 3,
      px: 2,
      borderRadius: 'md',
      mr: 3
    }}
    {...(props as any)}
  />
)

const Branch: React.FunctionComponent<{
  current: string
  refs: Ref[]
  repository: Repository
  disabled?: boolean
}> = ({ current, refs, repository, disabled }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Relative mx={1}>
      <Button
        variant='secondary'
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        Branch
        <HideOnSmall>
          : <strong>{current}</strong>
        </HideOnSmall>
        <Arrow
          style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
          height='1em'
        />
      </Button>
      <Dropdown open={open} onClose={() => setOpen(false)}>
        <List>
          {refs.map(ref => (
            <Item
              key={ref.sha}
              onClick={() =>
                navigate(
                  `/${repository.owner}/${repository.name}/tree/${ref.sha}`
                )
              }
              selected={ref.name == current}
            >
              <Tag>{ref.kind === 'branch' ? 'b' : 't'}</Tag>
              {ref.name}
            </Item>
          ))}
        </List>
      </Dropdown>
    </Relative>
  )
}

export default Branch

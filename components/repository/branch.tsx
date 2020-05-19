import * as React from 'react'
import styled from '@emotion/styled'

import { navigate } from '@quercia/quercia'

import Relative from '../relative'
import Button from '../button'
import Arrow from '../svgs/arrow'

import { Ref, Repository } from '../../types/data'
import Dropdown from '../dropdown'
import { Item, List } from '../list'

//margin: 0 0.25em;

const HideOnSmall = styled('span')`
  @media (max-width: 500px) {
    display: none;
  }
`

const Tag = styled('div')`
  font-size: 0.75em;
  background: var(--bg-3);
  height: 1.5em;
  width: 1.5em;
  padding: 0.5em;
  border-radius: 0.35em;
  margin-right: 0.75em;

  display: flex;
  align-items: center;
  justify-content: center;
`

const B = () => <Tag>b</Tag>
const T = () => <Tag>t</Tag>

const Branch: React.FunctionComponent<{
  current: string
  refs: Ref[]
  repository: Repository
  disabled?: boolean
}> = ({ current, refs, repository, disabled }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Relative>
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
              {ref.kind === 'branch' ? <B /> : <T />}
              {ref.name}
            </Item>
          ))}
        </List>
      </Dropdown>
    </Relative>
  )
}

export default Branch

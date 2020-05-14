import { styled } from 'goober'
import * as React from 'react'

import { navigate } from '@quercia/quercia'

import { Ref, Repository } from '../../types/data'
import DB from '../dropbox'
import Dropdown, { Container } from '../dropdown'
import { Item, List } from '../list'

const Dropbox = styled(DB)`
  margin: 0 0.25em;
`

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
    <Container>
      <Dropbox open={open} onClick={() => setOpen(true)} disabled={disabled}>
        Branch
        <HideOnSmall>
          : <strong>{current}</strong>
        </HideOnSmall>
      </Dropbox>
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
    </Container>
  )
}

export default Branch

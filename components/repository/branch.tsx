import * as React from 'react'
import { navigate } from '@quercia/quercia'
import { styled, css } from 'goober'

import Button from '../button'
import _Dropdown from '../dropdown'
import _Arrow from '../svgs/arrow'
import { List, Item } from '../list'

import { Ref, Repository } from '../../types/data'

const Arrow = styled(_Arrow)`
  margin-left: 0.5em;
`

const Dropbox = styled(Button)`
  margin: 0 0.25em;
  color: var(--fg-5);

  height: 2.35em;
`

const Dropdown = styled(_Dropdown)`
  font-size: 0.75em;
  position: absolute;
  right: 0;
  margin-top: 0.75em;

  max-height: 15em;
  overflow: auto;

  @media (min-width: 960px) {
    min-width: 10em;
  }
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
}> = ({ current, refs, repository }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className={css`
        position: relative;
      `}
    >
      <Dropbox small secondary onClick={() => setOpen(true)}>
        Branch
        <HideOnSmall>
          : <strong>{current}</strong>
        </HideOnSmall>
        <Arrow height='1em' />
      </Dropbox>
      <Dropdown open={open} onClose={() => setOpen(false)}>
        <List>
          {refs.map(ref => (
            <Item
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
    </div>
  )
}

export default Branch

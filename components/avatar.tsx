import * as React from 'react'
import { Flex } from 'rebass'
import styled from '@emotion/styled'

import { navigate } from '@quercia/quercia'

import Relative from './relative'
import Dropdown from './dropdown'
import Divider from './divider'

import Image from './image'
import { List, Item } from './list'

import { LoggedUser } from '../types/data'

// transition: box-shadow 200ms ease-in-out;

// &:focus {
//   box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.3);
// }

const Avatar: React.FC<LoggedUser> = ({ picture, username }) => {
  const [open, setOpen] = React.useState(false)
  const go = React.useCallback((url: string) => {
    setOpen(false)
    navigate(url)
  }, [])

  return (
    <Relative as={Flex}>
      <Image
        sx={{
          'borderRadius': 'lg',
          'width': 2,
          'height': 2,
          'transition': 'box-shadow 200ms ease-in-out',

          ':focus': {
            boxShadow: 'focus'
          }
        }}
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyUp={e => e.keyCode == 13 && setOpen(!open)}
        alt='Your profile picture'
        src={picture}
      />
      <Dropdown sx={{ top: 5 }} open={open} onClose={() => setOpen(false)}>
        <List>
          <Item onClick={() => go(`/${username}`)}>Your profile</Item>
          <Item onClick={() => go('/new')}>New</Item>
          <Divider />
          <Item onClick={() => go('/logout')}>Logout</Item>
        </List>
      </Dropdown>
    </Relative>
  )
}

export default Avatar

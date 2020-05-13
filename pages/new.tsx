import * as React from 'react'

import { Head } from '@quercia/quercia'

import { Center, Base } from '../components/new/layout'
import Header from '../components/new/head'

import { User, LoggedUser } from '../types/data'
import { Line } from '../components/base'
import Repository from '../components/new/repository'
import Organization from '../components/new/organization'

interface AddProps {
  error?: string
  account: LoggedUser
  user: User
}

const types = ['Repository', 'Organization']
const Elements = [Repository, Organization]

export default ({ user }: AddProps) => {
  const [selected, setSelected] = React.useState(0)
  const Element = Elements[selected]

  return (
    <>
      <Head>
        <title>add - o2</title>
        <meta
          name='description'
          content='create a new repositroy/organization in o2'
        />
      </Head>
      <Center>
        <Base>
          <Header types={types} selected={selected} setSelected={setSelected} />
          <Line />
          <Element user={user} />
        </Base>
      </Center>
    </>
  )
}

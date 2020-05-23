import * as React from 'react'
import { Head } from '@quercia/quercia'

import Container from '../components/base'
import Center from '../components/center'
import Heading from '../components/heading'
import Divider from '../components/divider'

import Header from '../components/new/head'
import Repository from '../components/new/repository'
import Organization from '../components/new/organization'

import { Base, User } from '../types/data'

interface AddProps {
  error?: string
  user: User
}

const types = ['Repository', 'Organization']

export default ({ user, error }: Base<AddProps>) => {
  const [selected, setSelected] = React.useState(0)
  const Element = [Repository, Organization][selected]

  return (
    <Center css={{ height: 'calc(100vh - 3.5rem)', flex: 1 }}>
      <Head>
        <title>new - o2</title>
        <meta
          name='description'
          content='create a new repositroy/organization in o2'
        />
      </Head>
      <Container>
        <Header types={types} selected={selected} setSelected={setSelected} />
        <Divider />
        <Center>{error && <Heading color='error'>{error}</Heading>}</Center>
        <Element user={user} />
      </Container>
    </Center>
  )
}

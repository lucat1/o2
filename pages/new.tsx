import * as React from 'react'
import { css } from 'goober'

import { Head } from '@quercia/quercia'

import { Base, Center } from '../components/new/layout'
import Header from '../components/new/head'

import { User, LoggedUser } from '../types/data'
import { Line, Center as ErrorContainer } from '../components/base'
import Repository from '../components/new/repository'
import Organization from '../components/new/organization'
import { H2 } from '../components/typography'

interface AddProps {
  error?: string
  account: LoggedUser
  user: User
}

const types = ['Repository', 'Organization']
const Elements = [Repository, Organization]

export default ({ user, error }: AddProps) => {
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
          <ErrorContainer>
            {error && (
              <H2
                className={css`
                  color: var(--error);
                `}
              >
                {error}
              </H2>
            )}
          </ErrorContainer>
          <Element user={user} />
        </Base>
      </Center>
    </>
  )
}

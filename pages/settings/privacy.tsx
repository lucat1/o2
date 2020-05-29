import * as React from 'react'
import { Flex } from 'rebass'
import { useForm } from 'react-hook-form'
import { navigate, Head } from '@quercia/quercia'

import { Parent, Right } from '../../components/split'
import Heading from '../../components/heading'
import Button from '../../components/button'

import Left from '../../components/settings/left'
import Field from '../../components/settings/field'

import { User } from '../../types/data'

export interface SettingsProps {
  error?: string
  profile: { username: string }
}

export default ({ profile, error }: SettingsProps) => {
  const [isLoading, setLoading] = React.useState(
    error && typeof error !== 'string'
  )
  const {
    handleSubmit,
    register,
    errors,
    reset,
    formState: { dirty }
  } = useForm<User>()
  const onSubmit = (data: User) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('username', data.username)
    body.set('firstname', data.firstname)
    body.set('lastname', data.lastname)
    body.set('location', data.location)
    body.set('description', data.description)

    navigate('/settings', 'POST', {
      body,
      credentials: 'same-origin'
    })
  }

  return (
    <>
      <Head>
        <title>profile settings - o2</title>
        <meta
          name='description'
          content='the settings of a user/organization'
        />
      </Head>
      <Parent py={6} px={[0, 9]}>
        <Left
          pages={['General', 'Privacy']}
          current='Privacy'
          base='/settings'
        />
        <Right
          as='form'
          onSubmit={handleSubmit(onSubmit)}
          flexDirection='column'
          px={[0, 4]}
        >
          <Heading my={3} fontSize='2rem' height={5} width={9}>
            Privacy - {profile?.username}
          </Heading>

          <Field
            errors={errors}
            disabled={isLoading}
            name='username'
            placeholder='Username'
            defaultValue={profile?.username}
            description='The username is displayed in your profile and in every repository you own / contribute to.'
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[a-z0-9_-]{3,15}$/,
                message: 'invalid username'
              }
            })}
          />

          <Flex py={6} px={2} justifyContent='space-between'>
            <Button onClick={() => reset()} disabled={!dirty}>
              Reset
            </Button>
            <Button type='submit' disabled={!dirty}>
              Save
            </Button>
          </Flex>
        </Right>
      </Parent>
    </>
  )
}

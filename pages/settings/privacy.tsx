import * as React from 'react'
import { Flex } from 'rebass'
import { useForm } from 'react-hook-form'
import { navigate, Head, SSG } from '@quercia/quercia'

import { Parent, Right } from '../../components/split'
import Heading from '../../components/heading'
import Button from '../../components/button'
import Label from '../../components/label'
import Divider from '../../components/divider'

import Left from '../../components/settings/left'
import Field from '../../components/settings/field'

import { User } from '../../types/data'

export interface SettingsProps {
  error?: string
  profile: User
}

interface Data {
  current: string
  new: string
}

export default ({ profile, error }: SettingsProps) => {
  const [isLoading, setLoading] = React.useState(
    error ? typeof error == 'string' : false
  )

  const {
    handleSubmit,
    register,
    errors,
    reset,
    getValues,
    formState: { dirty }
  } = useForm<Data>()
  const onSubmit = (data: Data) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('current', data.current)
    body.set('new', data.new)

    navigate('/settings/privacy', 'POST', {
      body,
      credentials: 'same-origin'
    })
  }

  return (
    <>
      <Head>
        <title>profile settings (privacy) - o2</title>
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
            Privacy - {profile?.name}
          </Heading>

          {error && <Heading color='error'>{error}</Heading>}

          <Label>
            In order to update your password pelase provide your current
            password and the new one you want to set.
          </Label>

          <Field
            errors={errors}
            disabled={isLoading}
            name='current'
            type='password'
            placeholder='Current password'
            description='Your current password.'
            ref={register({
              required: 'Required',
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: 'invalid password'
              }
            })}
          />

          <Field
            errors={errors}
            disabled={isLoading}
            name='new'
            type='password'
            placeholder='New password'
            description='The new password.'
            ref={register({
              required: 'Required',
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message:
                  'invalid password. Must contain at least 8 characters, at least 1 numeric and 1 letter'
              },
              validate: value =>
                value === getValues()['current']
                  ? 'Cannot use the current password as the new one'
                  : true
            })}
          />

          <Divider />

          <Flex py={6} px={2} justifyContent='space-between'>
            <Button onClick={() => reset()} disabled={!dirty}>
              Reset
            </Button>
            <Button type='submit' disabled={!dirty}>
              Update
            </Button>
          </Flex>
        </Right>
      </Parent>
    </>
  )
}

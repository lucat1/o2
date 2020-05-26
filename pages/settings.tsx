import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Box } from 'rebass'
import { Head } from '@quercia/quercia'

import { Parent, Right } from '../components/split'
import Heading from '../components/heading'
import Input from '../components/input'
import Label from '../components/label'

import Left from '../components/settings/left'
import Field from '../components/settings/field'

import { User } from '../types/data'

export interface SettingsProps {
  profile: User
  error?: string
}

export default ({ profile, error }: SettingsProps) => {
  const [isLoading, setLoading] = React.useState(
    error && typeof error !== 'string'
  )
  const { handleSubmit, register, errors } = useForm<User>()

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
        <Left pages={['General']} current='General' base='/settings' />
        <Right flexDirection='column' px={[0, 4]}>
          <Heading my={3} fontSize='2rem' height={5} width={9}>
            Settings - {profile?.username}
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
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'invalid username'
              }
            })}
          />

          <Field
            errors={errors}
            disabled={isLoading}
            name='firstname'
            placeholder='First name'
            defaultValue={profile?.firstname}
            description='Your First name is displayed in your profile and is visible to everybody. You can omit it for privacy concerns.'
            ref={register({
              pattern: {
                value: /^[a-z ,.'-]+$/i,
                message: 'invalid first name'
              }
            })}
          />

          <Field
            errors={errors}
            disabled={isLoading}
            name='lastname'
            placeholder='Last name'
            defaultValue={profile?.lastname}
            description='Follows the same rules as your Fist name.'
            ref={register({
              pattern: {
                value: /^[a-z ,.'-]+$/i,
                message: 'invalid last name'
              }
            })}
          />

          <Field
            errors={errors}
            disabled={isLoading}
            name='location'
            placeholder='Location'
            defaultValue={profile?.location}
            description='Your location is displayed in your profile. You can of course omit it for privacy concerns.'
            ref={register()}
          />
        </Right>
      </Parent>
    </>
  )
}

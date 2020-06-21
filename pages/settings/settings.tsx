import * as React from 'react'
import { Box, Flex } from 'rebass'
import { Textarea } from '@rebass/forms'
import { useForm } from 'react-hook-form'
import { navigate, Head } from '@quercia/quercia'
import { readAsDataURL } from 'promisify-file-reader'

import { Parent, Right } from '../../components/split'
import Heading from '../../components/heading'
import Button from '../../components/button'
import Input from '../../components/input'
import Label from '../../components/label'
import Divider from '../../components/divider'
import Center from '../../components/center'
import Image from '../../components/image'

import Left from '../../components/settings/left'
import Field from '../../components/settings/field'

import { User } from '../../types/data'

export interface SettingsProps {
  profile: User
  error?: string
}

export default ({ profile, error }: SettingsProps) => {
  const [isLoading, setLoading] = React.useState(
    error ? typeof error == 'string' : false
  )
  const pictureRef = React.useRef<HTMLInputElement>()
  const [picture, setPicture] = React.useState('/picture/' + profile?.picture)

  const {
    handleSubmit,
    register,
    errors,
    reset,
    getValues,
    setValue,
    formState: { dirty }
  } = useForm<User>()
  const onSubmit = (data: User) => {
    setLoading(true)

    // instantiate the POST form data
    const body = new FormData()
    body.set('picture', data.picture)
    body.set('name', data.name)
    body.set('firstname', data.firstname)
    body.set('lastname', data.lastname)
    body.set('location', data.location)
    body.set('description', data.description)

    navigate(window.location.pathname, 'POST', {
      body,
      credentials: 'same-origin'
    })
  }

  return (
    <>
      <Head>
        <title>profile settings (general) - o2</title>
        <meta
          name='description'
          content='the settings of a user/organization'
        />
      </Head>
      <Parent py={6} px={[0, 9]}>
        <Left
          pages={['General', 'Privacy']}
          current='General'
          base='/settings'
        />
        <Right
          as='form'
          onSubmit={handleSubmit(onSubmit)}
          flexDirection='column'
          px={[0, 4]}
        >
          <Heading my={3} fontSize='2rem' height={5} width={9}>
            Settings - {profile?.name}
          </Heading>

          {error && <Heading color='error'>{error}</Heading>}

          <Box px={2} py={4}>
            <Heading known color='primary.default'>
              Profile picture
            </Heading>

            <Center>
              <input
                style={{ display: 'none' }}
                type='file'
                name='picture'
                accept='image/png, image/jpeg'
                ref={pictureRef}
                onChange={async e => {
                  const { files } = pictureRef.current
                  setValue('picture', files as any)
                  // ignore empty file selection
                  if (files.length < 1) {
                    return
                  }

                  setPicture(await readAsDataURL(files[0]))
                }}
              />
              <Image
                onClick={() => pictureRef.current.click()}
                width={8}
                height={8}
                src={picture}
              />
            </Center>
          </Box>

          <Field
            errors={errors}
            disabled={isLoading}
            name='name'
            placeholder='Username'
            defaultValue={profile?.name}
            description='The username is displayed in your profile and in every repository you own / contribute to.'
            ref={register({
              required: 'required',
              pattern: {
                value: /^[a-z0-9_-]{3,15}$/,
                message:
                  'invalid username: can only contain a-z, 0-9, _ and -. no uppercase letters'
              }
            })}
          />

          <Divider />

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
            description='Follows the same rules as your First name.'
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

          <Divider />

          <Box px={2} py={4}>
            <Heading known color='primary.default'>
              Description
            </Heading>

            <Input
              as={Textarea}
              css={{
                minWidth: '100%',
                maxWidth: '100%'
              }}
              sx={{ minHeight: 5, height: 7 }}
              disabled={isLoading}
              name='description'
              placeholder='Empty description'
              defaultValue={profile?.description}
              ref={register({
                maxLength: {
                  value: 250,
                  message: 'The description cannot be loger than 250 chars.'
                }
              })}
            />

            <Label htmlFor='description'>
              A brief description of yourself.
            </Label>
            {errors.description && (
              <Label htmlFor='description' variant='error'>
                {errors.description?.message.toString()}
              </Label>
            )}
          </Box>

          <Divider />

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

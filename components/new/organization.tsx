import * as React from 'react'
import { Flex } from 'rebass'
import { useForm } from 'react-hook-form'
import { navigate } from '@quercia/quercia'

import Center from '../center'
import Divider from '../divider'
import Input from '../input'
import Label from '../label'
import Button from '../button'

import { User } from '../../types/data'

interface Data {
  name: string
  description: string
}

const Organization: React.FunctionComponent<{ user: User }> = ({ user }) => {
  const { handleSubmit, register, errors } = useForm<Data>()

  const ref = React.useRef<HTMLFormElement>()
  const onSubmit = React.useCallback((data: Data) => {
    // instantiate the POST form data
    const body = new FormData()
    body.set('kind', 'organization')
    body.set('owner', user.name)
    body.set('name', data.name)

    navigate(`/new`, 'POST', {
      body,
      credentials: 'same-origin'
    })
  }, [])

  return (
    <>
      <Flex
        ref={ref}
        as='form'
        onSubmit={handleSubmit(onSubmit)}
        alignItems='center'
        flexDirection='row'
        px={4}
        py={6}
      >
        <Input
          name='name'
          placeholder='Organization name'
          ref={register({
            required: 'Required',
            pattern: {
              value: /^[a-z0-9_-]{1,256}$/,
              message: 'Invalid name'
            }
          })}
        />
      </Flex>
      <Divider />
      <Flex py={2} px={4} justifyContent='space-between' alignItems='center'>
        <Button
          onClick={() =>
            ref.current.dispatchEvent(new Event('submit', { cancelable: true }))
          }
          disabled={false}
        >
          Create
        </Button>
        {errors.name && (
          <Label width='auto' htmlFor='name' variant='error'>
            {errors.name?.message.toString()}
          </Label>
        )}
      </Flex>
    </>
  )
}

export default Organization

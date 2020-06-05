import * as React from 'react'
import { Flex } from 'rebass'
import { useForm } from 'react-hook-form'
import { navigate } from '@quercia/quercia'

import Center from '../center'
import Relative from '../relative'
import Divider from '../divider'
import Dropbox from '../dropbox'
import Dropdown from '../dropdown'
import { Item, List } from '../list'
import Input from '../input'
import Text from '../text'
import Label from '../label'
import Image from '../image'
import Button from '../button'

import { User, Organization } from '../../types/data'

type Type = 'user' | 'org'
interface Option {
  type: Type
  value: string
  picture: string
}

interface Data {
  name: string
  description: string
}

interface Props {
  user: User
  organizations: Organization[]
}

const Repository: React.FunctionComponent<Props> = ({
  user,
  organizations
}) => {
  const options: Option[] = React.useMemo(
    () => [
      { type: 'user', value: user?.name, picture: user?.picture },
      ...(organizations || []).map(({ name, picture }) => ({
        type: 'org' as Type,
        value: name,
        picture
      }))
    ],
    [user]
  )

  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(0)
  const select = React.useCallback((i: number) => {
    setOpen(false)
    setSelected(i)
  }, [])

  const { handleSubmit, register, errors } = useForm<Data>()

  const ref = React.useRef<HTMLFormElement>()
  const onSubmit = React.useCallback(
    (data: Data) => {
      // instantiate the POST form data
      const body = new FormData()
      body.set('kind', 'repository')
      body.set('owner', options[selected].value)
      body.set('name', data.name)

      navigate(`/new`, 'POST', {
        body,
        credentials: 'same-origin'
      })
    },
    [selected]
  )

  return (
    <>
      <Center alignItems='center' flexDirection='row' px={4} py={6}>
        <Relative display='inline'>
          <Dropbox
            variant='secondary'
            px={[0, 4]}
            open={open}
            onClick={() => setOpen(true)}
          >
            <Image
              mr={2}
              width={2}
              height={2}
              src={`${options[selected].picture}?s=25`}
            />
            {options[selected].value || 'user'}
          </Dropbox>
          <Dropdown open={open} onClose={() => setOpen(false)}>
            <List>
              {options.map(({ value, picture }, i) => (
                <Item key={i} onClick={() => select(i)}>
                  <Image mr={2} width={2} height={2} src={`${picture}?s=25`} />
                  {value}
                </Item>
              ))}
            </List>
          </Dropdown>
        </Relative>

        <Text mx={2} known>
          /
        </Text>

        <Flex
          css={{ flexShrink: 1 }}
          as='form'
          ref={ref}
          flexDirection='column'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            name='name'
            placeholder='Name'
            //error={errors.name?.message.toString()}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[a-z0-9_-]{1,256}$/,
                message: 'Invalid name'
              }
            })}
          />
        </Flex>
      </Center>
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

export default Repository

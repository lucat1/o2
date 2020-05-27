import * as React from 'react'
import { NestDataObject, FieldError } from 'react-hook-form'
import { Box } from 'rebass'
import { InputProps } from '@rebass/forms'

import Heading from '../heading'
import Input from '../input'
import Label from '../label'

import { User } from '../../types/data'

const Field: React.FC<InputProps & {
  description: string
  errors: NestDataObject<User, FieldError>
}> = React.forwardRef(
  ({ errors, placeholder, name, description, ...props }, ref) => (
    <Box px={2} py={4}>
      <Heading known color='primary.default'>{placeholder}</Heading>

      <Input
        {...(props as any)}
        name={name}
        placeholder={placeholder}
        ref={ref}
      />

      <Label htmlFor={name}>{description}</Label>
      {errors[name] && (
        <Label htmlFor={name} variant='error'>
          {errors[name]?.message.toString()}
        </Label>
      )}
    </Box>
  )
)

export default Field

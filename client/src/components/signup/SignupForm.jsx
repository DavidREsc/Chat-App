import React from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import { 
  Button,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Center
} from '@chakra-ui/react'

const schema = yup.object().shape({
  username: yup.string()
    .required('Username is required')
    .min(4, "Username must be 4 characters or more")
    .max(16, "Username must be 16 characters or less")
    .trim(),
  email: yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be 32 characters or less'),
  passwordConfirmation: yup.string()
    .required('Please retype your password')
    .oneOf([yup.ref('password')], 'Passwords do not match')
})

const SignupForm = (props) => { 

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  })
  const {onSubmitHandler, error, loading} = props

  return (
        <form className='signup-form' onSubmit={handleSubmit(onSubmitHandler)} noValidate>
          <Center>
            <Heading m='4'>Sign-up</Heading>
          </Center>

          <FormControl
            isInvalid={!!errors?.username?.message || !!error?.username} 
            isRequired
            p='4'
          >
            <FormLabel>Username</FormLabel>
            <Input 
              {...register('username')}
              placeholder='Username'
              autoComplete='off'>
            </Input>
            <FormErrorMessage>
              {errors?.username?.message || error?.username}
            </FormErrorMessage>
          </FormControl>

          <FormControl 
            isInvalid={!!errors?.email?.message || !!error?.email}
            isRequired
            p='4'
          >
            <FormLabel>Email</FormLabel>
            <Input 
              {...register('email')}
              placeholder='Email'
              autoComplete='off'>
            </Input>
            <FormErrorMessage>
              {errors?.email?.message || error?.email}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!errors?.password?.message || !!error?.password}
            isRequired 
            p='4'  
          >
            <FormLabel>Password</FormLabel>
            <Input
              {...register('password')}
              placeholder='Password' 
              type='password'>
            </Input>
            <FormErrorMessage>
              {errors?.password?.message || error?.password}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!errors?.passwordConfirmation?.message || !!error?.passwordConfirmation}
            isRequired
            p='4'
          >
            <FormLabel>Confirm Password</FormLabel>
            <Input
              {...register('passwordConfirmation')}
              placeholder='Confirm password'
              type='password'>
            </Input>
            <FormErrorMessage>
              {errors?.passwordConfirmation?.message || error?.passwordConfirmation}
            </FormErrorMessage>
          </FormControl>

          <Button 
            type='submit'
            ml='4'
            mt='4'
            colorScheme='teal'
            isLoading={loading ? true : false}>
            Submit
          </Button>
        </form>
  )
}

export default SignupForm
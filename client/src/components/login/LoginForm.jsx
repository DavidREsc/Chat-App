import React from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form";
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
  email: yup.string()
    .email('Invalid email').required("Email is required"),
  password: yup.string()
    .required("Password is required")
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be 32 characters or less')
})

const LoginForm = (props) => {
  
    const {register, handleSubmit, formState: {errors}} = useForm({
      resolver: yupResolver(schema)
    })
    const {onSubmitHandler, error, loading} = props

  return (
      <form className='login-form' onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <Center>
          <Heading m='4'>Login</Heading>
        </Center>
        <FormControl 
          isInvalid={!!errors?.email?.message || !!error?.email}
          p='5'
          isRequired
        >
          <FormLabel>Email</FormLabel>    
          <Input 
            {...register('email')}
            placeholder='Email'
            autoComplete='off'
          />
          <FormErrorMessage>
            {errors?.email?.message || error?.email}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors?.password?.message || !!error?.password} p='5' isRequired>
          <FormLabel>Password</FormLabel>
          <Input 
            {...register('password')} 
            placeholder='Password'
            type='password'
          />
          <FormErrorMessage>
            {errors?.password?.message || error?.password}
          </FormErrorMessage>
        </FormControl>
        <Button type='submit' isLoading={loading ? true : false} m='5' colorScheme='teal'>Submit</Button>
      </form>
  )
}

export default LoginForm
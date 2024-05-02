'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useDebounceValue , useDebounceCallback} from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/schemas/signupSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [usernameAvailMessage, setUsernameAvailMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 500)
  const { toast } = useToast()
  const router = useRouter()

  //zod impl
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {

    const usernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameAvailMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameAvailMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameAvailMessage(axiosError.response?.data.message ?? "Error checking username availbility")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    usernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/signup', data)
      toast({
        title: "Success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("error in user signup", error);
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Mystery message</h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }} />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className='animate-spin'/>}
                  <p className={`text-sm ${usernameAvailMessage==="username is unique"?'text-green-500':'text-red-500'}`}>
                    test {usernameAvailMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="Enter password" {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (<>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </>) : ('Signup')}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member ? {''}
            <Link href="/signin" className='text-blue-600 hover:text-blue-800'>
            Sign in 
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup;

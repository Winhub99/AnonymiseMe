'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export default function SigninForm(){
  const router = useRouter()


  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }

  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    
   // console.log(result);
  //console.log(`the identifier is ${data.identifier} and password is : ${data.password}`);
    
    
    if(result?.error){
      if(result.error==="CredentialsSignin"){
        toast({
          title:"Login Failed",
          description:"Incorrect credentials",
          variant:'destructive'
        })

      }else{
        toast({
          title:"Login Failed",
          description:result.error,
          variant:'destructive'
        })
      } 
    }
    if(result?.url){
      router.replace("/dashboard")
    }
  }



  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Welcome back to True Feedback</h1>
          <p className='mb-4'>Sign in to start your anonymous adventure</p>

        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input  {...field}  />
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
                    <Input  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New Here? please register ? {''}
            <Link href="/signup" className='text-blue-600 hover:text-blue-800'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


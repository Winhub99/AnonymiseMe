'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { contentSchema } from '@/schemas/contentSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const page = () => {

  const {username}= useParams(); 
  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema)

})

const onSubmit = async(data: z.infer<typeof contentSchema>)=>{
  try {
    const response = await axios.post("/api/send-message",{
      username,
      content:data.content
    })
    toast({
      title:"Message sent",
      variant:"default"
    })

  } catch (error) {
    console.error("Error is signup of user", error);
    const axiosError = error as AxiosError<ApiResponse>
    let errorMessage = axiosError.response?.data.message
    toast({
        title: "Failed to send message",
        description: errorMessage,
        variant: "destructive"
    })
  }

}
  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h2 className="text-4xl font-bold mb-4">Public Profile Link</h2>
      <div className='mb-4'>
        <h2 className="text-xl font-medium mb-4">Send anonymous messages to {username}</h2>
        <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='Content' {...field}/>
                                    </FormControl>
                                 
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>

      </div>
    </div>
  )
}

export default page

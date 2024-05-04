import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const page = () => {
  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h2 className="text-4xl font-bold mb-4">Public Profile Link</h2>
      <div className='mb-4'>
        <h2 className="text-xl font-medium mb-4">Send anonymous messages to username</h2>
        <div className='flex items-center'>
          <Textarea className="input input-bordered w-full p-2 mr-3" />
          <Button >Send it</Button>
        </div>
      </div>
    </div>
  )
}

export default page

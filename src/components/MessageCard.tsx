import React from 'react'
import dayjs from 'dayjs';
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from './ui/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  

type MessageCardProps={
    message:Message;
    onMessageDelete:(messageId:string)=>void
}
const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
 console.log("The message is : ");
 
  console.log(message);
  
  
    const {toast} = useToast()
    const handleDeleteConfirm= async()=>{
       const response= await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
       toast({
        title:response.data.message     
       })
       onMessageDelete(message._id)
    }
    // console.log("Printing the message");
    
    // console.log(message)

  return (
    <Card className="card-bordered">
  <CardHeader>
  <div className="flex justify-between items-center">
    <CardTitle>{message.content}</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
    <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
        </CardHeader>
  <CardContent></CardContent>
  <CardFooter></CardFooter>
</Card>

  )
}

export default MessageCard

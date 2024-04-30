import {z} from "zod"

export const contentSchema=z.object({
    content:z.string().min(10,{message:"content should have 10 chars atleast"}).max(300,{message:"Can't have over 300 chars as content"})
})
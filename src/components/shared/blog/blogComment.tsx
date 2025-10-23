'use client'
import React, { useState } from 'react'
import { MessageSquareText, SendHorizontal, Share2, ThumbsUp } from "lucide-react";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BlogComment = ({likes,comments}:{likes:number;comments:number}) => {
    const [comment, setcomment] = useState(false);
    const [like,setLike]=useState(0)
    // const [comments,setComments]=useState(0)

    const handelcomment=()=>{
       toast.success('Thank you for your comment')
       setcomment(!comment)
    //    setComments((prev)=> prev+1)
    }
      const handelLike=()=>{
       toast.success('Thank you for your comment')
       setLike((prev)=> prev+1)
        
    }
    return (
        <div>

            <div className="grid grid-cols-3 gap-5 pt-4 text-gray-700">
                <p className='flex items-center gap-1' onClick={()=>handelLike()}>

                <ThumbsUp className=" w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
                    strokeWidth={1.5} />
                    <span>{likes}</span>
                </p>
                <p className='flex items-center gap-1' onClick={()=>handelcomment()}>

                <MessageSquareText  className=" w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
                    strokeWidth={1.5} />
                    <span>{comments}</span>
                </p>
                <p>

                <Share2 className=" w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
                    strokeWidth={1.5} />
                </p>
            </div>
            {comment ? <div>
                <p className='border-1 rounded-2xl flex gap-1'>
                    <input className='w-full outline-none px-3 py-1' type="text" />
                    <Button onClick={handelcomment} className=' cursor-pointer hover:bg-green-400 bg-transparent'><SendHorizontal color="#121111" strokeWidth={1} /></Button>
                </p>
            </div> : ''

            }

        </div>
    )
}

export default BlogComment

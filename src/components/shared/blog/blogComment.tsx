'use client'
import React, { useState } from 'react'
import { MessageSquareText, SendHorizontal, Share2, ThumbsUp } from "lucide-react";
import { Button } from '@/components/ui/button';

const BlogComment = () => {
    const [comment, setcomment] = useState(false);
    const handelcomment=()=>{

        setcomment(!comment)
    }
    return (
        <div>

            <div className="grid grid-cols-3 gap-5 pt-4 text-gray-700">
                <ThumbsUp className=" w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
                    strokeWidth={1.5} />
                <MessageSquareText onClick={()=> setcomment(!comment)} className=" w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
                    strokeWidth={1.5} />
                <Share2 className=" w-8 h-8 cursor-pointer hover:bg-green-400 hover:text-white hover:rounded-full p-2 transition-all duration-300"
                    strokeWidth={1.5} />
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

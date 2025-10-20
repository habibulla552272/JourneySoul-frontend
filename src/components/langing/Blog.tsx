'use client'
import { blogData } from '@/hooks/fackdata'
import React, { useState } from 'react'
import BlogCard from '../shared/blog/blog';
import BlogFilter from '../blog/BlogFilter';
import CreateNewBlog from '../shared/blog/CreateNewBlog';
import { PlusCircleIcon } from 'lucide-react';

const Blog = () => {
  const [isDialogOpen,setIsDialogOpen]=useState(false)
    const data= blogData;
    console.log(data,'blog')
  return (
    <section className='my-16'>
       <div className='container mx-auto'>
        <div className='flex justify-between items-center'>

        <BlogFilter />
        <PlusCircleIcon onClick={()=>setIsDialogOpen(!isDialogOpen)} />
         <CreateNewBlog open={isDialogOpen} onOpenChange={setIsDialogOpen}  />
        </div>
         <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 items-stretch'>
            {data.map((item)=>(
                <div key={item.id}>
                       <BlogCard 
                        image={item.image}
                        date={item.date}
                        tittle={item.title}
                        description={item.description}
                        type={item.category}
                       />
                </div>
            ))

            }
         </div>
       </div>
    </section>
  )
}

export default Blog

import { blogData } from '@/hooks/fackdata'
import React from 'react'
import BlogCard from '../shared/blog/blog';
import BlogFilter from '../blog/BlogFilter';

const Blog = () => {
    const data= blogData;
    console.log(data,'blog')
  return (
    <section className='my-16'>
       <div className='container mx-auto'>
        <BlogFilter />
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

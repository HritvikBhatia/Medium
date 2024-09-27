import { Blog } from "../hooks";
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: {blog: Blog}) => {
  return <div>
     <Appbar/>

        <div className="flex justify-center">
            <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
        
                <div className="col-span-8">
                    <div className="text-5xl font-extrabold"> { blog.title } </div>
                    <div className="text-slate-500 pt-2">post on 26 sept 2024</div>
                    <div className="pt-4"> { blog.content } </div>
                </div>
                <div className="col-span-4">
                    Author
                    <div className="flex w-full">
                        <div className="pr-2 flex flex-col justify-center">
                            <Avatar size={2} name={blog.author.name || "Anonymous"}/>
                        </div>
                        <div>
                            <div className="text-xl font-bold">
                                { blog.author.name || "Anonymous"} 
                            </div>
                            <div className="pt-2 text-slate-500">
                                "Unleash Your Story, Inspire the World!"
                            </div>
                        </div>
                    </div>
                
                </div>
            
            </div>
        </div>
    </div>
};

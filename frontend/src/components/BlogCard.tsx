import { CheckCheck, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom"

interface BlogCardProps{
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
} : BlogCardProps) => {
    return <Link to={`/blog/${id}`}> 
    <div className="p-4 border-b border-slate-200 pb-4  w-screen sm:max-w-screen-lg max-w-screen-md  card-shadow rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300">
        <div className="flex">
            <Avatar name={authorName} size={1.7}/>
            <div className="font-semibold pl-2 text-sm flex justify-center flex-col"> {authorName} </div>
            <div className="flex justify-center flex-col pl-2"> <Circle/> </div>
            <div className="font-bold pl-3  text-slate-500 text-sm flex justify-center flex-col"> {publishedDate} </div>
        </div>
        <div className="text-xl font-semibold">
            {title}
        </div>
        <div className="text-md font-thin">
            {content.slice(0,100)+"..."}
        </div>
        <div className="text-sm font-thin text-slate-500 pt-4 flex items-center gap-2">
            <p>{`${Math.ceil(content.length/100)} min read`}</p>
            {/* <CheckCheck size={16} className="text-green-500 font-bold"/> */}
            <CheckCircle size={16} className="text-green-500 font-bold"/>
        </div>
    </div>
    </Link>
}

export function Circle(){
    return <div className="h-1 w-1 rounded-full bg-slate-400">

    </div>
}

export function Avatar({ name, size }: { name: string, size: number }) {
    return (
        <div
            className="relative inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
            style={{ width: `${size}rem`, height: `${size}rem` }} // Inline styles for width and height
        >
            <span className="font-medium text-gray-600 dark:text-gray-300">
                {name[0]}
            </span>
        </div>
    );
}

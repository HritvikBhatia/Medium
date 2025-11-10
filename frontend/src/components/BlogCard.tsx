import { CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom"

interface BlogCardProps{
    authorName?: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
    views: number
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate,
    views
}: BlogCardProps) => {

    return (
        <Link key={id} to={`/blog/${id}`} className="block group"> 
            <article className="relative p-6 bg-white border border-zinc-200 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/30 group-hover:via-purple-50/30 group-hover:to-pink-50/30 transition-all duration-300 rounded-3xl pointer-events-none" />
                

                <div className="relative z-10">
                    {/* Author info */}
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar name={authorName? authorName: "Anonymous"} size="small" />
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                            <span className="font-bold text-zinc-900">{authorName}</span>
                            <Circle />
                            <span className="text-zinc-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {publishedDate}
                            </span>
                        </div>
                    </div>
                    
                    {/* Title */}
                    <div className="mb-3">
                        <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-indigo-700 line-clamp-2 transition-colors leading-tight">
                            {title}
                        </h2>
                    </div>
                    
                    {/* Content preview */}
                    <div className="mb-5">
                        <p className="text-zinc-600 leading-relaxed line-clamp-3">
                            {content.slice(0, 150) + (content.length > 150 ? "..." : "")}
                        </p>
                    </div>
                    
                    {/* Footer with tags and meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <span className="flex items-center gap-1 font-medium">
                                <Clock size={14} />
                                {`${Math.ceil(content.length / 100)} min`}
                            </span>
                            <Circle />
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                {views}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-xs font-semibold text-green-600">Verified</span>
                        </div>
                    </div>

                    {/* Read more indicator */}
                    <div className="mt-4 flex items-center gap-2 text-green-500 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Read article</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export function Circle() {
    return <div className="w-1 h-1 rounded-full bg-zinc-400" />;
}

interface AvatarProps {
    name: string;
    size: "small" | "medium" | "large";
}

export function Avatar({ name, size }: AvatarProps) {
    const sizeClasses = {
        small: "w-8 h-8 text-xs",
        medium: "w-10 h-10 text-sm",
        large: "w-14 h-14 text-base"
    };

    return (
        <div className={`${sizeClasses[size]} bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-md ring-2 ring-indigo-100`}>
            {name[0].toUpperCase()}
        </div>
    );
}
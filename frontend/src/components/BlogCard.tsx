import { CheckCircle } from "lucide-react";
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
}: BlogCardProps) => {

    // console.log("publish date : " +publishedDate);
    

    return (
        <Link key={id} to={`/blog/${id}`} className="block group"> 
            <div className="p-6 bg-white border border-gray-200 rounded-2xl mb-4 hover:bg-white/80 hover:backdrop-blur-sm transition-colors">
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Avatar name={authorName} size="small" />
                    <span className="font-medium text-gray-900">{authorName}</span>
                    <Circle />
                    <span className="text-gray-500">{publishedDate}</span>
                </div>
                
                <div className="mb-3">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 line-clamp-2">
                        {title}
                    </h2>
                </div>
                
                <div className="mb-4">
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {content.slice(0, 120) + (content.length > 120 ? "..." : "")}
                    </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{`${Math.ceil(content.length / 100)} min read`}</span>
                    <CheckCircle size={16} className="text-green-500" />
                </div>
            </div>
        </Link>
    );
}

export function Circle() {
    return <div className="w-1 h-1 rounded-full bg-gray-400" />;
}

interface AvatarProps {
    name: string;
    size: "small" | "medium" | "large";
}

export function Avatar({ name, size }: AvatarProps) {
    const sizeClasses = {
        small: "w-6 h-6 text-xs",
        medium: "w-8 h-8 text-sm",
        large: "w-12 h-12 text-base"
    };

    return (
        <div className={`${sizeClasses[size]} bg-gray-100 rounded-full flex items-center justify-center font-medium text-gray-700`}>
            {name[0].toUpperCase()}
        </div>
    );
}
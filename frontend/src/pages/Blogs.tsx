import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {

    const {loading , blogs} = useBlogs();

    if(loading){
        return <div>
          <div className="flex justify-center mt-20">
              <div>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
              </div>
          </div>
        </div>
    }

  return (
    <div>
      <div className="flex justify-center mt-24 mb-20 ">
        <div className="flex flex-col space-y-4 "> 
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={blog.author.name || "Anonymous"}
              title={blog.title}
              content={blog.content}
              publishedDate={new Date(blog.createdAt).toDateString()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

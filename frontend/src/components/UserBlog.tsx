import { useUserBlog } from "@/hooks";
import { useParams } from "react-router-dom";
import { BlogCard } from "./BlogCard";

function UserBlog() {
  const { id } = useParams();
  const { user } = useUserBlog({ id: id || "" });
  if (!user) {
    return (
      <>
        <div>USER ANONYMOUS</div>
      </>
    );
  }
  return (
    <div className="flex justify-center mt-24 mb-20 ">
      <div className="flex flex-col space-y-4 ">
        {user.blog.map((blog) => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            authorName={user.name || "Anonymous"}
            title={blog.title}
            content={blog.content}
            publishedDate={new Date(blog.createdAt).toDateString()}
            views={blog.views}
          />
        ))}
      </div>
    </div>
  );
}

export default UserBlog;
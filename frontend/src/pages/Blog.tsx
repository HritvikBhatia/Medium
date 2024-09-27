import { useParams } from "react-router-dom";
import { useBlog } from "../hooks";
import { FullBlog } from "../components/FullBlog";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Appbar } from "../components/Appbar";

export const Blog = () => {
    const { id } = useParams();
    const {loading , blog} = useBlog({
        id: id || ""
    });

    if(loading){
      return <div>
        <Appbar/>
        <div className="flex justify-center">
          <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
              <div className="col-span-8">
                <BlogSkeleton/>
              </div>
              <div className="col-span-4">
                <BlogSkeleton/>
              </div>
          </div>
        </div>
      </div>
}

  return <div>
    <FullBlog blog={blog}/>
  </div>
}
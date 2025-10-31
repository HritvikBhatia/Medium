import { BACKEND_URL } from "@/config";
import Blog from "@/interface/BlogInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const Avatar = ({ size, name }: { size: number; name: string }) => {
  const initial = name.charAt(0).toUpperCase();
  const sizeClasses: Record<number, string> = {
    1: "w-9 h-9 text-sm",
    2: "w-12 h-12 text-base",
    3: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold ring-4 ring-indigo-100 shadow-lg`}
    >
      {initial}
    </div>
  );
};

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState(blog._count.likedBy);

  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [bookmarkes, setBookmarkes] = useState(blog._count.bookmarkedBy);

  useEffect(() => {
    if (blog) {
      const userLiked = blog.likedBy.some(
        (u) => u.username === localStorage.getItem("username")
      );
      const userBookmarked = blog.bookmarkedBy.some(
        (u) => u.username === localStorage.getItem("username")
      );
      setLiked(userLiked);
      setBookmarked(userBookmarked);
    }
  }, [blog]);

  const likeHandler = async () => {
    try {
      if (!liked) {
        await axios.post(
          `${BACKEND_URL}/api/v1/blog/${blog.id}/like`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("authorization"),
            },
          }
        );
        setLiked(true);
        setLikes(likes + 1);
      } else {
        await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}/like`, {
          headers: { Authorization: localStorage.getItem("authorization") },
        });
        setLiked(false);
        setLikes(likes - 1);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const bookmarkHandler = async () => {
    try {
      if (!bookmarked) {
        await axios.post(
          `${BACKEND_URL}/api/v1/blog/${blog.id}/bookmark`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("authorization"),
            },
          }
        );
        setBookmarked(true);
        setBookmarkes(bookmarkes + 1);
      } else {
        await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}/bookmark`, {
          headers: { Authorization: localStorage.getItem("authorization") },
        });
        setBookmarked(false);
        setBookmarkes(bookmarkes - 1);
      }
    } catch (error) {
      console.error(error);
    }
  };


async function shareHandler() {
  const blogUrl = `${window.location.origin}/blog/${blog.id}`;
  try {
    if (navigator.share) {
      await navigator.share({
        title: blog.title,
        text: `Check out this blog: ${blog.title}`,
        url: blogUrl,
      });
    } else {
      await navigator.clipboard.writeText(blogUrl);
      toast.success("Link copied to clipboard!");
    }
  } catch (err) {
    console.log(err);
  }
}


  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
          <span className="hover:text-zinc-900 cursor-pointer transition-colors">Home</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-zinc-900 font-medium">
            {blog.title.substring(0, 40)}...
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-zinc-200/50 border border-zinc-100">

              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight bg-linear-to-r from-zinc-900 to-zinc-700 bg-clip-text">
                {blog.title}
              </h1>

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-100">
                <Avatar size={2} name={blog.author.name || "Anonymous"} />
                <div className="flex-1">
                  <p className="font-bold text-zinc-900 text-lg">
                    {blog.author.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(blog.createdAt).toDateString()}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {Math.ceil(blog.content.split(' ').length / 200)} min read
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-zinc-100">
                <span className="px-4 py-2 bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
                  #Writing
                </span>
                <span className="px-4 py-2 bg-linear-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
                  #Inspiration
                </span>
                <span className="px-4 py-2 bg-linear-to-r from-pink-50 to-pink-100 text-pink-700 rounded-full text-sm font-semibold border border-pink-200 hover:shadow-md transition-shadow cursor-pointer">
                  #Stories
                </span>
              </div>
            </article>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  liked 
                    ? 'bg-linear-to-r from-red-500 to-pink-500 text-white border-0' 
                    : 'bg-white border-2 border-zinc-200 text-zinc-700 hover:border-red-300 hover:bg-red-50'
                }`}
                onClick={likeHandler}
              >
                {liked ? (
                  <svg
                    className="w-5 h-5"
                    fill="white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
                <span className="font-bold">{likes}</span>
              </button>

              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  bookmarked 
                    ? 'bg-linear-to-r from-indigo-500 to-blue-500 text-white border-0' 
                    : 'bg-white border-2 border-zinc-200 text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
                onClick={bookmarkHandler}
              >
                {bookmarked ? (
                  <svg
                    className="w-5 h-5"
                    fill="white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                )}
                <span className="font-bold">{bookmarkes}</span>
              </button>

              <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              onClick={shareHandler}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            {/* Author Card */}
            <div className="bg-linear-to-br from-white to-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-xl shadow-zinc-200/50 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <Avatar size={3} name={blog.author.name || "Anonymous"} />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">
                    {blog.author.name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-zinc-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    234 Followers
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed mb-5">
                Passionate writer sharing thoughts and ideas through blogs.
                Always exploring new perspectives.
              </p>
              <button className="w-full px-5 py-3 bg-linear-to-r from-zinc-900 to-zinc-700 text-white rounded-xl text-sm font-bold hover:from-zinc-800 hover:to-zinc-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Follow Author
                </span>
              </button>
            </div>           
          </div>
        </div>
      </main>
    </div>
  );
};
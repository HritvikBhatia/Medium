import { useUser } from "@/context/UserContext";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type PageType = "posts" | "bookmarked" | "liked";

function Profile() {

  const { loading, user, refreshUser } = useUser();
  
  useEffect(() => {
    refreshUser();
  }, []);

  const [page, setPage] = useState<PageType>("posts");
  if (!user) {
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-24">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to="/signin" replace />
    );
  }
  const multiplePage =
    page === "posts"
      ? user.blog
      : page === "bookmarked"
      ? user.bookmarkedBlogs ?? []
      : user.likedBlogs ?? [];

  return (
    <div className="container mx-auto mt-24 px-4">
      {/* Responsive grid: 1 column on mobile, 2 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-[0.30fr_0.70fr] gap-12">
        {/* --- Left Side: Profile Card --- */}
        <div className="flex justify-center md:justify-end">
          <div className="border border-black/[0.2] rounded-2xl flex flex-col items-start max-w-sm w-full p-6 shadow-lg sticky top-24">
            {/* Decorative Icons */}
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-black" />

            {/* Card Effect */}
            <EvervaultCard text={user.name} />

            {/* User Info */}
            <div className="mt-6 text-center w-full">
              <h2 className="text-2xl font-bold text-black">{user.name}</h2>
              <p className="text-gray-500">@{user.username}</p>
            </div>

            {/* Stats */}
            <div className="flex justify-around w-full mt-6 text-sm text-gray-700">
              <div>
                <p className="font-semibold">{user._count.likedBlogs}</p>
                <p>Liked</p>
              </div>
              <div>
                <p className="font-semibold">{user._count.bookmarkedBlogs}</p>
                <p>Bookmarked</p>
              </div>
              <div>
                <p className="font-semibold">{user.blog.length}</p>
                <p>Posts</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Right Side: User Posts --- */}
        <div className="overflow-y-auto max-h-[80vh] pr-2">
          <button
            className={`text-xl font-semibold mb-4 mr-5 text-black text-center md:text-left cursor-pointer ${page === "posts" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black" } `}
            onClick={() => setPage("posts")}
          >
            Your Posts
          </button>
          <button
            className={`text-xl font-semibold mb-4 mr-5 text-black text-center md:text-left cursor-pointer ${page === "liked" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"} `}
            onClick={() => setPage("liked")}
          >
            Liked Posts
          </button>
          <button
            className={`text-xl font-semibold mb-4 mr-5 text-black text-center md:text-left cursor-pointer ${page === "bookmarked" ? "text-black border-b-2 border-black" :"text-gray-500 hover:text-black" } `}
            onClick={() => setPage("bookmarked")}
          >
            Bookmarked Posts
          </button>

          {multiplePage.length > 0 ? (
            <ul className="space-y-4">
              {multiplePage.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.id}`}
                  className="block group"
                >
                  <li
                    key={blog.title}
                    className="border border-black/[0.1] rounded-lg p-4 hover:shadow-md transition mb-1"
                  >
                    <h4 className="text-lg font-semibold text-black">
                      {blog.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {blog.content.slice(0, 150)}...
                    </p>
                    <span className="text-xs mt-1 text-zinc-500 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(blog.createdAt).toDateString()}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-center md:text-left text-gray-500">
              You haven’t written any posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

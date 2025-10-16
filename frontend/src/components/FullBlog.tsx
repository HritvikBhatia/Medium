interface Blog {
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string
}

const Avatar = ({ size, name }: { size: number; name: string }) => {
  const initial = name.charAt(0).toUpperCase();
  const sizeClasses : Record<number, string> = {
    1: "w-9 h-9 text-sm",
    2: "w-12 h-12 text-base",
    3: "w-16 h-16 text-xl",
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold ring-2 ring-zinc-700`}>
      {initial}
    </div>
  );
};


export const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="min-h-screen bg-zinc-50">

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Breadcrumb */}
        <div className="text-sm text-zinc-500 mb-8">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Articles</span>
          <span className="mx-2">/</span>
          <span className="text-zinc-900">{blog.title.substring(0, 30)}...</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
              
              <h1 className="text-4xl font-semibold text-zinc-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-200">
                <Avatar size={2} name={blog.author.name || "Anonymous"} />
                <div>
                  <p className="font-semibold text-zinc-900">{blog.author.name || "Anonymous"}</p>
                  <p className="text-sm text-zinc-500">Published on {new Date(blog.createdAt).toDateString()}</p>
                </div>
              </div>

              <div className="text-zinc-700 text-lg leading-relaxed whitespace-pre-wrap space-y-4">
                {blog.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-zinc-200">
                <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium border border-zinc-200">
                  Writing
                </span>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium border border-zinc-200">
                  Inspiration
                </span>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium border border-zinc-200">
                  Stories
                </span>
              </div>

            </article>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                124
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                18
              </button>
              <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Author Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm backdrop-blur-md hover:bg-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Avatar size={3} name={blog.author.name || "Anonymous"} />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-zinc-900 mb-1">
                    {blog.author.name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    234 Followers
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                Passionate writer sharing thoughts and ideas through blogs. Always exploring new perspectives.
              </p>
              <button className="w-full px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 border border-zinc-900">
                Follow
              </button>
            </div>

            {/* Recommended */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Recommended</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pb-4 border-b border-zinc-200 last:border-0 last:pb-0">
                    <h4 className="text-sm font-semibold text-zinc-900 mb-1 leading-snug">
                      The Future of Remote Work in 2024
                    </h4>
                    <p className="text-xs text-zinc-500">John Doe · 3 min read</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Writing', 'Design', 'Productivity', 'Life'].map((topic) => (
                  <span key={topic} className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium border border-zinc-200 hover:bg-zinc-200">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

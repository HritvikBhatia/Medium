import { Link, useNavigate } from "react-router-dom";
import { LogOut, PenSquare, Sparkles, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "./BlogCard";

export const Appbar = () => {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("authorization");
    localStorage.removeItem("username");
    navigate("/Signin");
  };

  const [username, setUsername] = useState({ name: "", username: "" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  async function fetchUser() {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/user`, {
        headers: {
          Authorization: localStorage.getItem("authorization"),
        },
      });
      setUsername(response.data.user);
    } catch (e) {
      toast.error("Failed to fetch user info");
      console.log(e);
    }
  }
  
  useEffect(() => {
    fetchUser();
  }, []);

  const displayName = useMemo(
    () => username.name || username.username || "User",
    [username]
  );

  localStorage.setItem("username", username.username);

  return (
    <header className="border-b border-zinc-200 backdrop-blur-xl bg-white/80 shadow-sm z-50 fixed top-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-2">
          {/* Logo Section */}
          <Link
            to={"/blogs"}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-lime-500 via-lime-400 to-lime-300  rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-lime-500 to-lime-400 bg-clip-text text-transparent hidden sm:block">
              Medium
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Create Blog Button */}
            <Link
              to={"/publish"}
              className="group"
            >
              <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm">
                <PenSquare size={16} className="hidden sm:block" />
                <span className="hidden sm:inline">Create</span>
                <span className="sm:hidden">Write</span>
              </button>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 hover:bg-zinc-100 rounded-2xl transition-colors"
              >
                <Avatar name={displayName} size="medium" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-zinc-900 leading-tight">
                    {displayName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {username.username || "user"}
                  </p>
                </div>
                <svg
                  className={`hidden sm:block w-4 h-4 text-zinc-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Section */}
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-zinc-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar name={displayName} size="large" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-zinc-600 truncate">
                            @{username.username || "user"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to={"/blogs"}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors group"
                      >
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            My Stories
                          </p>
                          <p className="text-xs text-zinc-500">
                            View all your posts
                          </p>
                        </div>
                      </Link>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          // Navigate to bookmarks page when available
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors group"
                      >
                        <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                          <BookmarkCheck className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-zinc-900">
                            Saved Posts
                          </p>
                          <p className="text-xs text-zinc-500">
                            Your bookmarks
                          </p>
                        </div>
                      </button>

                      <div className="my-2 border-t border-zinc-200" />

                      <button
                        onClick={() => {
                          logOut();
                          toast.success("Logged out successfully");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors group"
                      >
                        <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-red-600">
                            Sign Out
                          </p>
                          <p className="text-xs text-red-400">
                            See you soon!
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
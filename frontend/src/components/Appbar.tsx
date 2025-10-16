import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "./BlogCard";
export const Appbar = () => {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("authorization");
    navigate("/Signin");
  };

  const [username, setUsername] = useState({ name: "", username: "" });
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

  return (
    <div className="border-b flex justify-between px-4 sm:px-10 py-3 header-shadow  w-full backdrop-blur-lg bg-white/20 z-50 fixed top-0">
      <Link
        to={"/blogs"}
        className="flex flex-col justify-center cursor-pointer"
      >
        <p className="font-bold px-4 py-2 text-xl rounded-xl ">Medium</p>
      </Link>

      <div className="flex flex-row items-center">
        <Link
          to={"/publish"}
          className="mr-4 flex items-center space-x-4 hover:opacity-90 hover:scale-105 transition-all"
        >
          <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-xl font-bold grad_back">
            Create Blog
          </button>
        </Link>

        <div className="flex items-center gap-4">
          <Avatar name={displayName} size="large" />
          <button
            onClick={() => {
              logOut();
              toast.success("Logged out successfully");
            }}
          >
            <LogOut />
          </button>
        </div>
      </div>
    </div>
  );
};

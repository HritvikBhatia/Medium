import { Link, useNavigate } from "react-router-dom";
// import { Avatar } from "./BlogCard";
import { LogOut } from "lucide-react";
import avatarImage from "../assets/bussiness-man.png"
export const Appbar = () => {

  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/Signin");
  }

  return (
    <div className="border-b flex justify-between px-4 sm:px-10 py-3 header-shadow  w-full backdrop-blur-lg bg-white/20 z-50 fixed top-0">
      
      <Link to={"/blogs"} className="flex flex-col justify-center cursor-pointer">
        <p className="font-bold px-4 py-2 text-xl rounded-xl ">Medium</p>
      </Link>
      
      <div className="flex flex-row items-center">
        
        <Link to={"/publish"} className="mr-4">
          <div className="flex items-center space-x-4 hover:opacity-90 hover:scale-105 transition-all">
            <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-xl font-bold grad_back">
              Create Blog
            </button>
          </div>
        </Link>
      
        <div className="flex items-center gap-4">
          {/* <Avatar  name="Hritvik" size={2.3} /> */}
          <img src={avatarImage} loading="lazy" alt="avatar image" className="h-9 w-9" />
          <button onClick={logOut}><LogOut/></button>
        </div>
      
      </div>
    </div>
  );
};

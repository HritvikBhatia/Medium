import { Link } from "react-router-dom";
import { Avatar } from "./BlogCard";

export const Appbar = () => {
  return (
    <div className="border-b flex justify-between px-10 py-3 ">
      
      <Link to={"/blogs"} className="flex flex-col justify-center cursor-pointer">
        <div>Medium</div>
      </Link>
      
      <div className="flex flex-row">
        
        <Link to={"/publish"} className="mr-4">
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-full">
              Create Blog
            </button>
          </div>
        </Link>
      
        <div>
          <Avatar name="Hritvik" size={2.3} />
        </div>
      
      </div>
    </div>
  );
};

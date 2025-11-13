import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";
import Blog from "@/interface/BlogInterface";
import User from "@/interface/UserInterface";


export const useBlog = ({ id } : { id: string }) => {
    const [loading , setLoading] =  useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("authorization")
            }
        })
            .then(response => {
                setBlog(response.data.blog);
                // console.log("id blogs "+response.data.blogs);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch blogs:", err);
                setLoading(false);
            });
    }, [id])

    return {
        loading,
        blog
    }
}

export const useBlogs = () => {
    const [loading , setLoading] =  useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("authorization")
            }
        })
            .then(response => {
                setBlogs(response.data.blogs);
                // console.log("Full bulk response:", response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch blogs:", err);
                setLoading(false); 
            });
    }, [])

    return {
        loading,
        blogs
    }
}

export const useUserBlog = ({ id } : { id: string }) => {
    const [loading , setLoading] =  useState(true);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/user/${id}/blogs`, {
            headers: {
                Authorization: localStorage.getItem("authorization")
            }
        })
            .then(response => {
                setUser(response.data.user);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch user blogs:", err);
                setLoading(false);
            });
    }, [])

    return {
        loading,
        user
    }
}

// export const useUser = () => {
//     const [loading , setLoading] =  useState(true);
//     const [user, setUser] = useState<User>();

//     useEffect(() => {
//         axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
//             headers: {
//                 Authorization: localStorage.getItem("authorization")
//             }
//         })
//             .then(response => {
//                 setUser(response.data.user);
//                 setLoading(false);
//             })
//     }, [])

//     return {
//         loading,
//         user
//     }
// }
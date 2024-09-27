import { Plus } from "lucide-react"
import { Appbar } from "../components/Appbar"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useState } from "react"
import {  useNavigate } from "react-router-dom"

export const Publish = () =>{
    const [title , setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    return <div>
        <Appbar/>
        <main className="flex-grow p-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center mb-4">
                    <Plus className="text-gray-400 mr-2" />
                    <input
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                    type="text"
                    placeholder="Title"
                    className="text-4xl font-bold outline-none w-full h-14"
                    />
                </div>
                <textarea
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                    placeholder="Tell your story..."
                    className="w-full h-96 text-lg outline-none resize-none"
                />
                <button onClick={async() => {
                    const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                        title,
                        content: description
                    }, {
                        headers:{
                            Authorization: localStorage.getItem("token")
                        }
                    })
                    navigate(`/blog/${response.data.id}`)
                }} type="button" className="mt-5 text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Publish Post</button>
            </div>
        </main>
    </div>
}
 
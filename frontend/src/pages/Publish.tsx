import { Plus } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handlePublish() {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    if (!description.trim()) {
      toast.error("Description cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content: description,
        },
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );
      toast.success("Blog published successfully!");
      navigate(`/blog/${response.data.id}`);
    } catch (error: unknown) {
      console.error("Publish Error:", error);

      let message = "Something went wrong. Please try again.";
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error.response?.status) {
          message = `Request failed with status ${error.response.status}`;
        } else if (error.message) {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <main className="flex-grow p-4 mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-4">
            <Plus className="text-gray-400 mr-2" />
            <input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              type="text"
              placeholder="Title"
              className="text-4xl font-bold outline-none w-full h-14"
            />
          </div>
          <textarea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Tell your story..."
            className="w-full h-96 text-lg outline-none resize-none"
          />
          <button
            onClick={handlePublish}
            type="button"
            disabled={loading}
            className="mt-5 text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </main>
    </div>
  );
};

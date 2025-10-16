import { SignupInput } from "@hritvik707/medium-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // <-- import Sonner

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [postInput, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

async function SendRequest() {
  try {
    setLoading(true);

    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
      postInput
    );

    const jwt = response.data;
    // console.log(jwt);
    
    localStorage.setItem("authorization", `Bearer ${jwt}`);
    // console.log(localStorage.getItem("authorization"))

    toast.success(`${type === "signup" ? "Signup" : "Signin"} successful!`);
    navigate("/blogs");
  } catch (error: unknown) {
    console.error("Auth Error:", error);

    let message = "Something went wrong. Please try again.";

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const dataMessage = error.response?.data?.message;

      if (type === "signup" && (status === 411 || status === 409)) {
        message = "User already exists. Please sign in instead.";
      } else if (dataMessage) {
        message = dataMessage;
      } else if (status) {
        message = `Request failed with status ${status}`;
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
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center ">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">Create an account</div>

            <div className="text-slate-400">
              {type === "signin" ? "Don't have an account?" : "Already have an account?"}
              <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>

          <div className="pt-8">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="Hritvik"
                onChange={(e) => {
                  setPostInputs({ ...postInput, name: e.target.value });
                }}
              />
            ) : null}
            <LabelledInput
              label="Email"
              placeholder="abc123@gmail.com"
              onChange={(e) => {
                setPostInputs({ ...postInput, username: e.target.value });
              }}
            />
            <LabelledInput
              label="Password"
              type={"password"}
              placeholder="password"
              onChange={(e) => {
                setPostInputs({ ...postInput, password: e.target.value });
              }}
            />
            <button
              disabled={loading}
              onClick={SendRequest}
              type="button"
              className={`mt-8 w-full grad_back text-white font-bold rounded-lg hover:opacity-85 transition-all duration-150 text-sm px-5 py-2.5 text-center me-2 mb-2 ${
                loading && "opacity-80 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : type === "signup" ? (
                "Sign up"
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface labelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: labelledInputType) {
  return (
    <div>
      <label className="block pt-3 mb-2 text-sm font-medium text-black">{label}</label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

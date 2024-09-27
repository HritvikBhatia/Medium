import { SignupInput } from "@hritvik707/medium-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInput, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  async function SendRequest(){
    try{
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup"? "signup" : "signin" }`, postInput)
      const jwt = response.data;
      localStorage.setItem("token",jwt);
      navigate("/blogs")
    }catch(e){

    }
  }

  return (
    <div className="h-screen flex justify-center flex-col  ">
      <div className="flex justify-center ">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">Create an account</div>

            <div className="text-slate-400">
              {type === "signin"? "Don't have an account?" : "Already have an account?" }
              <Link className="pl-2 underline" to={type === "signin"? "/signup" : "/signin" }>
              {type === "signin"? "Sign up" : "Sign in" }
              </Link>
            </div>
          </div>

          <div className="pt-8">
            {type === "signup" ? <LabelledInput
              label="Name"
              placeholder="Hritvik"
              onChange={(e) => {
                setPostInputs({
                  ...postInput,
                  name: e.target.value,
                });
              }}
            /> : null}
            <LabelledInput
              label="UserName"
              placeholder="abc123@gmail.com"
              onChange={(e) => {
                setPostInputs({
                  ...postInput,
                  username: e.target.value,
                });
              }}
            />
            <LabelledInput
              label="Password"
              type={"password"}
              placeholder="password"
              onChange={(e) => {
                setPostInputs({
                  ...postInput,
                  password: e.target.value,
                });
              }}
            />
            <button onClick={SendRequest} type="button" className="mt-8 w-full text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{type === "signup"? "Sign up" : "Sign in"}</button>
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

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: labelledInputType) {
  return (
    <div>
      <label className="block pt-3 mb-2 text-sm font-medium text-black">{label}</label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder}
        required
      />
    </div>
  );
}

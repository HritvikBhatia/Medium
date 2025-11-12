import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    "Verifying your email, please wait..."
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError(true);
      setMessage("No verification token found. Invalid link.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/user/verify-email`,
          { token }
        );

        // On success, backend returns a JWT
        const { jwt } = response.data;

        if (!jwt) {
          throw new Error("Verification failed, no token received.");
        }

        // Log the user in
        localStorage.setItem("authorization", `Bearer ${jwt}`);

        setMessage("Email verified successfully! Redirecting...");
        toast.success("Email verified successfully!");

        // Redirect to the main blogs page
        setTimeout(() => {
          navigate("/blogs", { replace: true });
        }, 2000);
      } catch (err) {
        setError(true);
        let errorMessage =
          "Verification failed. The link may be invalid or expired.";
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="h-screen flex items-center justify-center flex-col space-y-4">
      {!error ? (
        <Loader2 size={48} className="animate-spin text-lime-500" />
      ) : (
        <svg
          className="w-16 h-16 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <p className={`text-xl ${error ? "text-red-600" : "text-zinc-700"}`}>
        {message}
      </p>
    </div>
  );
};

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import User from "@/interface/UserInterface";

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
        headers: {
          Authorization: localStorage.getItem("authorization"),
        },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("authorization")
    if(token){
      fetchUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

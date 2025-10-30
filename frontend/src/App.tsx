import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import { Appbar } from "./components/Appbar";
import Profile from "./pages/Profile";
import { UserProvider } from "./context/UserContext";

function AppLayout() {
  return (
    <>
      <Appbar />
      <Outlet /> {/* Renders child routes */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* Routes without Appbar */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Routes with Appbar */}
          <Route element={<AppLayout />}>
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

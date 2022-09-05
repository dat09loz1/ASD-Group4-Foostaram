import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HeaderLayout from "./components/header/HeaderLayout";
import Search from "./pages/Search";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ManagePosts from "./pages/Business/ManagePosts";
import SchedulePosts from "./pages/Business/SchedulePosts";

function App() {
  return (
    <>
      <Router>
        <HeaderLayout>
          <Header headerFocused="CreatePost" />
        </HeaderLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test" element={<Test />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/manageposts" element={<ManagePosts />} />
          <Route path="/scheduleposts" element={<SchedulePosts />} />
          <Route index element={<Register />} />
        </Routes>

        <Footer />
      </Router>
    </>
  );
}

export default App;

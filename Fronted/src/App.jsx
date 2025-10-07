import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/educator/Dashboard";
import Courses from "./pages/educator/Courses";
import CreateCourses from "./pages/educator/CreateCourses";
import EditCourse from "./pages/educator/EditCourse";
import CreateLecture from "./pages/educator/CreateLecture";

import getCurrentUser from "./customHooks/getCurrentUser";
import getCreatorCourse from "./customHooks/getCreatorCourse";
import getPublishCourse from "./customHooks/getPublishCourse";
import AllCourses from "./pages/AllCourses";
import EditLecture from "./pages/educator/EditLecture";
import ViewCourse from "./pages/ViewCourse";
import ScrollToTop from "./component/ScrollToTop";
import ViewLecture from "./pages/ViewLecture";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";
import getAllReviews from './customHooks/getAllReviews'
import SearchWithAi from "./pages/SearchWithAi";

export const serverUrl = "http://localhost:8000";

const App = () => {
  const { userData } = useSelector((state) => state.user);

  // Fix: load user and courses only once after mount

  getCurrentUser();
  getCreatorCourse();

  getPublishCourse();
  getAllReviews();
  ScrollToTop()

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/forget"
          element={!userData ? <ForgetPassword /> : <Navigate to="/signup" />}
        />

        {/* User Routes */}
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" />}
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to="/signup" />}
        />

        {/* Educator Routes */}
        <Route
          path="/dashboard"
          element={
            userData?.role === "educator" ? (
              <Dashboard />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/courses"
          element={
            userData?.role === "educator" ? (
              <Courses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/createcourse"
          element={
            userData?.role === "educator" ? (
              <CreateCourses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/allcourses"
          element={userData ? <AllCourses /> : <Navigate to="/signup" />}
        />

        {/* Fix: longer route first */}
        <Route
          path="/editcourse/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditCourse />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/editcourse/:courseId"
          element={
            userData?.role === "educator" ? (
              <EditCourse />
            ) : (
              <Navigate to="/signup" />
            )
          }
          
        />
        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
          
        />
         <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
          
        />
        <Route
          path="/viewcourse/:courseId"
          element={
            userData ? (
              <ViewCourse />
            ) : (
              <Navigate to="/signup" />
            )
          }
          
        />
        <Route
          path="/viewlecture/:courseId"
          element={
            userData ?  (
              <ViewLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
          
        />
         <Route
          path="/mycourses"
          element={
            userData ? (
              <MyEnrolledCourses />
            ) : (
              <Navigate to="/signup" />
            )
          }
          
        />
        <Route
          path="/search"
          element={
            userData ? (
              <SearchWithAi />
            ) : (
              <Navigate to="/signup" />
            )
          }
          
        />
      </Routes>
    </>
  );
};

export default App;

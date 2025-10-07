import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoPersonCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiSplitCross } from "react-icons/gi";

const Nav = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showHam, setShowHam] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      console.log(result.data);

      toast.success("Logout Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className=" w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10">
        <div className=" lg:w-[20%] w-[40%] lg:pl-[50px]">
          <img
            src={logo}
            alt=""
            className=" w-[60px] rounded-[5px] border-2 border-white "
          />
        </div>
        {/* Desktop Menu */}
        <div className=" w-[30%] lg:flex items-center justify-center gap-4 hidden">
          {!userData && (
            <IoPersonCircle
              className=" w-[50px] h-[50px] fill-black cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
          )}

          {userData && (
            <div
              className=" w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            >
              {userData?.name.slice(0, 1).toUpperCase()}
            </div>
          )}

          {userData?.role === "educator" && (
            <div className=" px-[20px] py-[10px] border-2 border-white  text-white bg-[black] rounded-[10px] text-[18px]  font-light  cursor-pointer"   onClick={() => navigate("/dashboard")}>
              Dashboard
            </div>
          )}

          {!userData ? (
            <span
              className=" px-[20px] py-[10px] text-[18px] font-light cursor-pointer bg-[#000000d5] text-white"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          ) : (
            <span
              className=" px-[20px] py-[10px] bg-white rounded-[10px] shadow-sm shadow-black text-[18px]  cursor-pointer"
              onClick={handleLogout}
            >
              LogOut
            </span>
          )}
          {show && (
            <div className=" absolute top-[110%] right-[15%] flex flex-col gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-[2px] border-black">
              <span className=" bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600" onClick={()=>navigate("/profile")}>
                My Profile
              </span>
              <span className=" bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600" onClick={()=>navigate('/mycourses')}>
                My Courses
              </span>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <GiHamburgerMenu
          className=" w-[30px] h-[30px] lg:hidden fill-white cursor-pointer "
          onClick={() => setShowHam((prev) => !prev)}
        />

        {/* Mobile Menu */}
        <div
          className={` fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden ${
            showHam
              ? "translate-x-[0] transition duration-700"
              : "translate-x-[-100%] transition duration-700"
          }`}
        >
          <GiSplitCross
            className=" w-[35px] h-[35px] fill-white absolute top-5 right-[4%]"
            onClick={() => setShowHam((prev) => !prev)}
          />

          {/* Always show Profile & Courses */}
          <div className=" w-[200px] h-[65px] border-2 border-white text-white bg-black flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"onClick={()=>navigate("/profile")}>
            My Profile
          </div>
          <div className=" w-[200px] h-[65px] border-2 border-white text-white bg-black flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"  onClick={()=>navigate('/mycourses')}>
            My Courses
          </div>
         
          {/* If logged in */}
          {userData && (
            <>
              <div className=" w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer">
                {userData?.name.slice(0, 1).toUpperCase()}
              </div>

              {userData?.role === "educator" && (
                <div className=" w-[200px] h-[65px] border-2 border-white text-white bg-black flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer" onClick={()=>navigate("/dashboard")}>
                  Dashboard
                </div>
              )}

              <span
                className=" w-[200px] h-[65px] border-2 border-white text-white bg-black flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
                onClick={() => {
                  handleLogout();
                  setShowHam(false);
                }}
              >
                LogOut
              </span>
            </>
          )}

          {/* If not logged in */}
          {!userData && (
            <span
              className=" w-[200px] h-[65px] border-2 border-white text-white bg-black flex items-center justify-center rounded-[10px] text-[18px] font-light cursor-pointer"
              onClick={() => {
                navigate("/login");
                setShowHam(false);
              }}
            >
              Login
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;

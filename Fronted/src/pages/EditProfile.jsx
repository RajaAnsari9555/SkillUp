import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [name, setName] = useState(userData.name || "");
  const [description, setDescription] = useState(userData.description || "");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  if (photoUrl) {
    formData.append("photoUrl", photoUrl);
  }

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/user/profile",
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Profile Updated");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaLongArrowAltLeft
          className="absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col items-center text-center">
            {userData?.photoUrl ? (
              <img
                src={userData?.photoUrl}
                className="w-24 h-24 rounded-full object-cover border-4 border-black"
                alt=""
              />
            ) : (
              <div className="w-24 h-24 rounded-full object-cover border-2 border-white text-white flex items-center justify-center text-[30px] bg-black">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="image"
              className="text-sm font-medium text-gray-700"
            >
              Select Avatar
            </label>
            <input
              id="image"
              type="file"
              name="photoUrl"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-md text-sm"
              onChange={(e) => setPhotoUrl(e.target.files[0])}
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              UserName
            </label>
            <input
              id="name"
              type="text"
              placeholder={userData.name}
              className="w-full px-4 py-2 border rounded-md text-sm"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              readOnly
              type="text"
              placeholder={userData.email}
              className="w-full px-4 py-2 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="description"
              placeholder="Tell us about yourself"
              rows={3}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-black"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <button
            className="w-full bg-black active:bg-[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer"
            onClick={handleEditProfile}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

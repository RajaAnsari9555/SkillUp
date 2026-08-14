import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { FiArrowLeft, FiCamera, FiUser, FiSave } from "react-icons/fi";
import Nav from "../component/Nav";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [name, setName] = useState(userData?.name || "");
  const [description, setDescription] = useState(userData?.description || "");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [preview, setPreview] = useState(userData?.photoUrl || null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoUrl(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (photoUrl) formData.append("photoUrl", photoUrl);
      const result = await axios.post(serverUrl + "/api/user/profile", formData, { withCredentials: true });
      dispatch(setUserData(result.data));
      toast.success("Profile updated!");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="page-bg min-h-screen relative overflow-hidden">
      <Nav />
      <div className="absolute top-40 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-orb"
        style={{ background: "rgba(168,85,247,0.12)" }} />

      <div className="max-w-xl mx-auto px-4 pt-28 pb-16">
        <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-sm mb-6 hover:scale-105 transition-transform"
          style={{ color: "var(--text-secondary)" }}>
          <FiArrowLeft className="w-4 h-4" /> Back to Profile
        </button>

        <div className="glass rounded-3xl border p-8 animate-slide-up" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Edit Profile</h2>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <label className="relative cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-lg animate-pulse-glow"
                  style={{ background: "rgba(168,85,247,0.4)" }} />
                {preview ? (
                  <img src={preview} alt="" className="relative w-24 h-24 rounded-full object-cover border-4"
                    style={{ borderColor: "var(--border)" }} />
                ) : (
                  <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4"
                    style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", borderColor: "var(--border)" }}>
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCamera className="text-white w-6 h-6" />
                </div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                <FiUser className="inline w-3.5 h-3.5 mr-1.5" />Username
              </label>
              <input type="text" className="input-glass" placeholder="Your name"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Email (readonly) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Email (read-only)</label>
              <input type="text" className="input-glass opacity-50 cursor-not-allowed"
                value={userData?.email} readOnly />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Bio</label>
              <textarea className="input-glass" rows={4} placeholder="Tell us about yourself..."
                value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-secondary flex-1 py-3 rounded-2xl text-sm font-medium"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => navigate("/profile")}>
                Cancel
              </button>
              <button type="button" className="btn-primary flex-1 py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                onClick={handleEditProfile} disabled={loading}>
                {loading ? <ClipLoader size={20} color="white" /> : <><FiSave className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

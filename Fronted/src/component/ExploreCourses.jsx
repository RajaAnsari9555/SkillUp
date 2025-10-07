import React from "react";
import { SiViaplay, SiUikit, SiGoogledataproc, SiOpenaigym } from "react-icons/si";
import { TbDeviceDesktopAnalytics, TbBrandOpenai } from "react-icons/tb";
import { IoMdPhonePortrait } from "react-icons/io";
import { FaHackerrank, FaDatabase } from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const ExploreCourses = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between px-[20px] md:px-[40px] lg:px-[80px] py-[50px]">
      {/* Left: Heading, Paragraph, Button */}
      <div className="lg:w-1/2 flex flex-col items-start justify-center gap-4">
        <h2 className="text-[35px] font-semibold leading-tight">
          Explore <br /> Our Courses
        </h2>

        <p className="text-[17px] text-gray-700 w-full sm:w-[90%] md:w-[80%]">
          Skill Up is a learning platform powered by advanced Large Language Models, 
          designed to help learners grow their knowledge and skills with ease. 
          Our mission is to make high-quality education accessible, 
          personalized, and engaging for everyone.
        </p>

        <button className="px-[20px] py-[10px] bg-black text-white rounded-[10px] text-[18px] font-light flex items-center gap-2 mt-[20px] hover:bg-gray-800 transition" onClick={()=>navigate("/allcourses")}>
          Explore Courses
          <SiViaplay className="w-[30px] h-[30px]" />
        </button>
      </div>

      {/* Right: Course Cards */}
      <div className="lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[30px] mt-[40px] lg:mt-0">
        {/* Card 1 */}
        <div className="flex flex-col items-center text-center text-[13px] font-light gap-3">
          <div className="w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center">
            <TbDeviceDesktopAnalytics className="w-[60px] h-[60px] text-[#6d6c6c]" />
          </div>
          Web Dev
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center text-center text-[13px] font-light gap-3">
          <div className="w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center">
            <SiUikit className="w-[60px] h-[60px] text-[#6c6c6c]" />
          </div>
          UI/UX Design
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-center text-center text-[13px] font-light gap-3">
          <div className="w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center">
            <IoMdPhonePortrait className="w-[60px] h-[60px] text-[#6c6cc8]" />
          </div>
          App Dev
        </div>

        {/* Card 4 */}
        <div className="flex flex-col items-center text-center text-[13px] font-light gap-3">
          <div className="w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center">
            <FaHackerrank className="w-[60px] h-[60px] text-[#6c6c6c]" />
          </div>
          Ethical Hacking
        </div>

        {/* Card 5 */}
        <div className="flex flex-col items-center text-center text-[13px] font-light gap-3">
          <div className="w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center">
            <TbBrandOpenai className="w-[60px] h-[60px] text-[#6d6c6c]" />
          </div>
          AI/ML
        </div>

        {/* Card 6 */}
        <div className="flex flex-col items-center text-center text-[13px] font-light gap-3">
          <div className="w-[100px] h-[90px] bg-[#fcd9c8] rounded-lg flex items-center justify-center">
            <SiGoogledataproc className="w-[60px] h-[60px] text-[#6d6c6c]" />
          </div>
          Data Science
        </div>

        {/* Card 7 */}
        <div className="flex flex-col items-center text-center text-[13px] font-light gap-3">
          <div className="w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center">
            <FaDatabase className="w-[60px] h-[60px] text-[#6d6c6c]" />
          </div>
          Data Analytics
        </div>

        {/* Card 8 */}
        <div className="flex flex-col items-center text-center text-[13px] font-light gap-3">
          <div className="w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center">
            <SiOpenaigym className="w-[60px] h-[60px] text-[#6d6c6c]" />
          </div>
          AI Tools
        </div>
      </div>
    </div>
  );
};

export default ExploreCourses;

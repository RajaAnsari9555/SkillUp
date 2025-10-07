import React from "react";
import Nav from "../component/Nav";
import home from "../assets/home1.jpg";
import { SiViaplay } from "react-icons/si";
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import Logos from "../component/Logos";
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import { useNavigate } from "react-router-dom";
import About from "../component/About.jsx";
import Footer from "../component/Footer.jsx";
import ReviewPage from "../component/ReviewPage.jsx";




const Home = () => {

  
  const navigate = useNavigate();

   

  return (
    <div className="w-[100%] overflow-hidden">
      <div className="w-[100%] lg:h-[140vh] h-[70vh] relative">
        <Nav />
        <img
          src={home}
          alt=""
          className="object-cover w-[100%] lg:h-[100%] h-[50vh]"
        />
        <div className="absolute lg:top-[10%] top-[15%] w-full flex flex-col items-center justify-center text-white font-bold text-center leading-tight">
          <span className="lg:text-[70px] md:text-[40px] text-[20px]">
            Grow Your Skill to Advance
          </span>
          <span className="lg:text-[70px] md:text-[40px] text-[20px] mt-2">
            Your Career Path
          </span>
        </div>
        <div className=' absolute lg:top-[30%] top-[75%] md:top-[80%] w-[100%] flex items-center justify-center gap-3 flex-wrap'> <button className=' px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white text-black text-[18px] font-light flex gap-2 cursor-pointer rounded-[10px]' onClick={()=>navigate("/allcourses")}>View All Courses <SiViaplay  className=" w-[30px] h-[30px] lg:fill-white fill-black"/></button> 
        <button className='px-[20px] py-[10px] border-2 lg:bg-white bg-black border-black lg:text-black text-white text-[18px] font-light flex gap-2 cursor-pointer rounded-[10px] items-center justify-center' onClick={()=>navigate("/search")}>Search With Ai <img src={ai} alt="" className=" w-[30px] h-[30px] rounded-full hidden   lg:block" /> <img src={ai1} alt=""  className=" w-[35px] h-[35px] rounded-full lg:hidden "/></button> </div>

       
        

        
      </div>
       <Logos/>
       <ExploreCourses/>
       <CardPage/>
       <About/>
       <ReviewPage/>
       <Footer/>
    </div>
  );
};

export default Home;

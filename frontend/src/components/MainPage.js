import React from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import emblem_of_india from "../assets/images/emblem_of_india.png";
import ministry from "../assets/images/ministry.png";
import lifestyle_for_environment from "../assets/images/lifestyle_for_environment.png";
import casfos_dehradun from "../assets/images/casfos_dehradun.png";
import casfos_vana_vigyan from "../assets/images/casfos_vana_vigyan.png";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-green-700 text-white p-6 fixed w-full top-0 shadow-lg z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-xl px-6 text-green-700">
            {/* Left: Emblem + Title */}
            <div className="flex items-center space-x-6">
                {/* Emblem */}
                <img src={emblem_of_india} alt="Emblem of India" className="h-[8.5rem] w-[8.5rem]" />

                {/* Title Box */}
                <div>
                  <h1 className="text-2xl font-bold">GRIEVANCE REDRESSAL SYSTEM</h1>
                  <h1 className="text-2xl font-bold">CASFOS, COIMBATORE</h1>
                  <p className="text-lg mt-2">Ministry of Environment, Forest and Climate Change,</p>
                  <p className="text-lg mt-2">Government of India</p>
                </div>
            </div>

            {/* Right: Three Images */}
            <div className="flex space-x-3">
                <img src={ministry} alt="Ministry of Environment, Forest and Climate Change," className="h-[7.5rem] w-[7.5rem]" />
                <img src={casfos_dehradun} alt="Ministry of Environment, Forest and Climate Change," className="h-[7.5rem] w-[7.5rem]" />
                <img src={lifestyle_for_environment} alt="Ministry of Environment, Forest and Climate Change," className="h-[7.5rem] w-[7.5rem]" />
            </div>
        </div>

        {/* Navigation Bar - Aligned to Cover the Space from Emblem to Three Images */}
        <div className="flex justify-between items-center max-w-6xl mx-auto mt-5">
          <div className="flex space-x-6">
            <Link to="about" smooth duration={500} offset={-140} className="cursor-pointer text-lg">Home</Link>
            <Link to="about" smooth duration={500} offset={-140} className="cursor-pointer text-lg">About Us</Link>
            <Link to="history" smooth duration={500} offset={-140} className="cursor-pointer text-lg">History</Link>
            <Link to="reach" smooth duration={500} offset={-140} className="cursor-pointer text-lg">How to Reach</Link>
            <Link to="certificate" smooth duration={500} offset={-140} className="cursor-pointer text-lg">Certificate of Accreditation</Link>
            <Link to="infrastructure" smooth duration={500} offset={-140} className="cursor-pointer text-lg">Infrastructure</Link>
            <Link to="training" smooth duration={500} offset={-140} className="cursor-pointer text-lg">Training</Link>
            <Link to="contact" smooth duration={500} offset={-140} className="cursor-pointer text-lg">Contact Us</Link>
          </div>

          <button 
            className="bg-white text-green-700 px-6 py-3 rounded-md transition-all duration-300 hover:shadow-2xl hover:bg-green-600 hover:text-white"
            onClick={() => navigate("/home")}>
            Login
          </button>
        </div>
      </nav>

      {/* Sections */}
      <div className="pt-[18.5rem] mt-50">
        <section id="about" className="min-h-screen bg-white flex justify-center items-center px-6">
          <div className="text-center max-w-4xl w-full">
            {/* First Paragraph */}
            <p className="text-lg text-justify mb-6">
              The Central Academy for State Forest Service, Central Academy For State Forest Service, 
              Coimbatore (erstwhile State Forest Service college) is one of the premier institutions under the 
              aegis of Directorate of Forest Education, Ministry of Environment, Forests and Climate Change, which 
              imparts professional training to newly recruited RFO’s and in-service training to the State Forest Service
              Officers of ACF and DCF ranks.
            </p>

            {/* Image */}
            <img src={casfos_vana_vigyan} alt="Ministry of Environment, Forest and Climate Change" className="h-[25.5rem] w-[40.5rem] mx-auto mb-6" />

            {/* Second Paragraph */}
            <p className="text-lg text-justify">
              The Academy was set up in the year 1980. Earlier to this, the State Forest Service Officers had been trained 
              at the erstwhile Indian Forest College, Dehradun and State Forest Service College, Burnihat. 
              With the advent of developmental schemes in the Forestry sector during the IV and V Five-year plans, and launching of the
              Social Forestry Projects in many States, the Government of India felt the urgency of starting two more institutions 
              to train the increasing number of officers specially from the State Services, and as a sequel to this, the college was 
              established on 25th January 1980, along with the State Forest Service College, Burnihat.
            </p>
          </div>
        </section>
    </div>

    <div className="pt-[4.5rem] mt-50">
        <section id="history" className="min-h-screen bg-gray-200 flex justify-center items-center px-6">
          <div className="text-center max-w-4xl w-full">
            {/* First Paragraph */}
            <p className="text-lg text-justify mb-6">
              The Central Academy for State Forest Service, Central Academy For State Forest Service, 
              Coimbatore (erstwhile State Forest Service college) is one of the premier institutions under the 
              aegis of Directorate of Forest Education, Ministry of Environment, Forests and Climate Change, which 
              imparts professional training to newly recruited RFO’s and in-service training to the State Forest Service
              Officers of ACF and DCF ranks.
            </p>

            {/* Image */}
            <img src={casfos_vana_vigyan} alt="Ministry of Environment, Forest and Climate Change" className="h-[25.5rem] w-[40.5rem] mx-auto mb-6" />

            {/* Second Paragraph */}
            <p className="text-lg text-justify">
              The Academy was set up in the year 1980. Earlier to this, the State Forest Service Officers had been trained 
              at the erstwhile Indian Forest College, Dehradun and State Forest Service College, Burnihat. 
              With the advent of developmental schemes in the Forestry sector during the IV and V Five-year plans, and launching of the
              Social Forestry Projects in many States, the Government of India felt the urgency of starting two more institutions 
              to train the increasing number of officers specially from the State Services, and as a sequel to this, the college was 
              established on 25th January 1980, along with the State Forest Service College, Burnihat.
            </p>
          </div>
        </section>
    </div>

    <div className="pt-[4.5rem] mt-50">
        <section id="history" className="min-h-screen bg-gray-200 flex justify-center items-center px-6">
          <div className="text-center max-w-4xl w-full">
            {/* First Paragraph */}
            <p className="text-lg text-justify mb-6">
              The Central Academy for State Forest Service, Central Academy For State Forest Service, 
              Coimbatore (erstwhile State Forest Service college) is one of the premier institutions under the 
              aegis of Directorate of Forest Education, Ministry of Environment, Forests and Climate Change, which 
              imparts professional training to newly recruited RFO’s and in-service training to the State Forest Service
              Officers of ACF and DCF ranks.
            </p>

            {/* Image */}
            <img src={casfos_vana_vigyan} alt="Ministry of Environment, Forest and Climate Change" className="h-[25.5rem] w-[40.5rem] mx-auto mb-6" />

            {/* Second Paragraph */}
            <p className="text-lg text-justify">
              The Academy was set up in the year 1980. Earlier to this, the State Forest Service Officers had been trained 
              at the erstwhile Indian Forest College, Dehradun and State Forest Service College, Burnihat. 
              With the advent of developmental schemes in the Forestry sector during the IV and V Five-year plans, and launching of the
              Social Forestry Projects in many States, the Government of India felt the urgency of starting two more institutions 
              to train the increasing number of officers specially from the State Services, and as a sequel to this, the college was 
              established on 25th January 1980, along with the State Forest Service College, Burnihat.
            </p>
          </div>
        </section>
    </div>

    <div className="pt-[4.5rem] mt-50">
        <section id="history" className="min-h-screen bg-gray-200 flex justify-center items-center px-6">
          <div className="text-center max-w-4xl w-full">
            {/* First Paragraph */}
            <p className="text-lg text-justify mb-6">
              The Central Academy for State Forest Service, Central Academy For State Forest Service, 
              Coimbatore (erstwhile State Forest Service college) is one of the premier institutions under the 
              aegis of Directorate of Forest Education, Ministry of Environment, Forests and Climate Change, which 
              imparts professional training to newly recruited RFO’s and in-service training to the State Forest Service
              Officers of ACF and DCF ranks.
            </p>

            {/* Image */}
            <img src={casfos_vana_vigyan} alt="Ministry of Environment, Forest and Climate Change" className="h-[25.5rem] w-[40.5rem] mx-auto mb-6" />

            {/* Second Paragraph */}
            <p className="text-lg text-justify">
              The Academy was set up in the year 1980. Earlier to this, the State Forest Service Officers had been trained 
              at the erstwhile Indian Forest College, Dehradun and State Forest Service College, Burnihat. 
              With the advent of developmental schemes in the Forestry sector during the IV and V Five-year plans, and launching of the
              Social Forestry Projects in many States, the Government of India felt the urgency of starting two more institutions 
              to train the increasing number of officers specially from the State Services, and as a sequel to this, the college was 
              established on 25th January 1980, along with the State Forest Service College, Burnihat.
            </p>
          </div>
        </section>
    </div>

    <div className="pt-[4.5rem] mt-50">
        <section id="history" className="min-h-screen bg-gray-200 flex justify-center items-center px-6">
          <div className="text-center max-w-4xl w-full">
            {/* First Paragraph */}
            <p className="text-lg text-justify mb-6">
              The Central Academy for State Forest Service, Central Academy For State Forest Service, 
              Coimbatore (erstwhile State Forest Service college) is one of the premier institutions under the 
              aegis of Directorate of Forest Education, Ministry of Environment, Forests and Climate Change, which 
              imparts professional training to newly recruited RFO’s and in-service training to the State Forest Service
              Officers of ACF and DCF ranks.
            </p>

            {/* Image */}
            <img src={casfos_vana_vigyan} alt="Ministry of Environment, Forest and Climate Change" className="h-[25.5rem] w-[40.5rem] mx-auto mb-6" />

            {/* Second Paragraph */}
            <p className="text-lg text-justify">
              The Academy was set up in the year 1980. Earlier to this, the State Forest Service Officers had been trained 
              at the erstwhile Indian Forest College, Dehradun and State Forest Service College, Burnihat. 
              With the advent of developmental schemes in the Forestry sector during the IV and V Five-year plans, and launching of the
              Social Forestry Projects in many States, the Government of India felt the urgency of starting two more institutions 
              to train the increasing number of officers specially from the State Services, and as a sequel to this, the college was 
              established on 25th January 1980, along with the State Forest Service College, Burnihat.
            </p>
          </div>
        </section>
    </div>

    <div className="pt-[4.5rem] mt-50">
        <section id="history" className="min-h-screen bg-gray-200 flex justify-center items-center px-6">
          <div className="text-center max-w-4xl w-full">
            {/* First Paragraph */}
            <p className="text-lg text-justify mb-6">
              The Central Academy for State Forest Service, Central Academy For State Forest Service, 
              Coimbatore (erstwhile State Forest Service college) is one of the premier institutions under the 
              aegis of Directorate of Forest Education, Ministry of Environment, Forests and Climate Change, which 
              imparts professional training to newly recruited RFO’s and in-service training to the State Forest Service
              Officers of ACF and DCF ranks.
            </p>

            {/* Image */}
            <img src={casfos_vana_vigyan} alt="Ministry of Environment, Forest and Climate Change" className="h-[25.5rem] w-[40.5rem] mx-auto mb-6" />

            {/* Second Paragraph */}
            <p className="text-lg text-justify">
              The Academy was set up in the year 1980. Earlier to this, the State Forest Service Officers had been trained 
              at the erstwhile Indian Forest College, Dehradun and State Forest Service College, Burnihat. 
              With the advent of developmental schemes in the Forestry sector during the IV and V Five-year plans, and launching of the
              Social Forestry Projects in many States, the Government of India felt the urgency of starting two more institutions 
              to train the increasing number of officers specially from the State Services, and as a sequel to this, the college was 
              established on 25th January 1980, along with the State Forest Service College, Burnihat.
            </p>
          </div>
        </section>
    </div>

    <div className="pt-[4.5rem] mt-50">
        <section id="history" className="min-h-screen bg-gray-200 flex justify-center items-center px-6">
          <div className="text-center max-w-4xl w-full">
            {/* First Paragraph */}
            <p className="text-lg text-justify mb-6">
              The Central Academy for State Forest Service, Central Academy For State Forest Service, 
              Coimbatore (erstwhile State Forest Service college) is one of the premier institutions under the 
              aegis of Directorate of Forest Education, Ministry of Environment, Forests and Climate Change, which 
              imparts professional training to newly recruited RFO’s and in-service training to the State Forest Service
              Officers of ACF and DCF ranks.
            </p>

            {/* Image */}
            <img src={casfos_vana_vigyan} alt="Ministry of Environment, Forest and Climate Change" className="h-[25.5rem] w-[40.5rem] mx-auto mb-6" />

            {/* Second Paragraph */}
            <p className="text-lg text-justify">
              The Academy was set up in the year 1980. Earlier to this, the State Forest Service Officers had been trained 
              at the erstwhile Indian Forest College, Dehradun and State Forest Service College, Burnihat. 
              With the advent of developmental schemes in the Forestry sector during the IV and V Five-year plans, and launching of the
              Social Forestry Projects in many States, the Government of India felt the urgency of starting two more institutions 
              to train the increasing number of officers specially from the State Services, and as a sequel to this, the college was 
              established on 25th January 1980, along with the State Forest Service College, Burnihat.
            </p>
          </div>
        </section>
    </div>    
    </div>
  );
};

export default MainPage;

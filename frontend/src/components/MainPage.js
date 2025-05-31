/*
 * MainPage.js
 *
 * Purpose:
 * This React component serves as the public landing page for the CASFOS Grievance Redressal System.
 * It provides navigation, institutional information, and contact details for users before login.
 *
 * Features:
 * - Responsive navigation bar with institutional branding and login button.
 * - Sectioned layout for About Us, History, How to Reach, and Contact Us.
 * - Mobile-friendly menu and smooth scrolling navigation.
 * - Displays images and accreditation links.
 *
 * Usage:
 * Used as the main entry point for unauthenticated users. Should be rendered at the root or landing route.
 * Example: <MainPage />
 *
 * Dependencies:
 * - react-scroll for smooth section navigation.
 * - react-router-dom for navigation to login.
 * - react-icons for menu icons.
 * - Various institutional images from assets.
 *
 * Notes:
 * - All content and images are static except for navigation.
 * - Designed for accessibility and responsiveness.
 */

import React, { useState } from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import emblem_of_india from "../assets/images/emblem_of_india.png";
import ministry from "../assets/images/ministry.png";
import lifestyle_for_environment from "../assets/images/lifestyle_for_environment.png";
import casfos_dehradun from "../assets/images/casfos_dehradun.png";
import casfos_vana_vigyan from "../assets/images/casfos_vana_vigyan.png";
import casfos_coimbatore_img4 from "../assets/images/casfos-coimbatore-img4.jpg";
import casfos_coimbatore_img5 from "../assets/images/casfos-coimbatore-img5.jpg";
import casfos_coimbatore_img3 from "../assets/images/casfos-coimbatore-img3.jpg";

// MainPage component for public landing and institutional info
const MainPage = () => {
  // State for mobile menu open/close
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Navigation Bar with branding, images, and login */}
      <nav className="bg-green-700 text-white py-3 fixed w-full top-0 shadow-lg z-10">
        <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-xl px-4 md:px-6 text-green-700">
          {/* Left: Emblem + Title */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <img
              src={emblem_of_india}
              alt="Emblem of India"
              className="h-[7rem] w-[7rem] min-h-[7rem] min-w-[7rem] md:h-[8rem] md:w-[8rem]"
            />
            <div>
              <h1 className="text-base md:text-lg font-bold">
                GRIEVANCE REDRESSAL SYSTEM
              </h1>
              <h1 className="text-base md:text-lg font-bold">
                CASFOS, COIMBATORE
              </h1>
              <p className="text-xs md:text-sm">
                Ministry of Environment, Forest and Climate Change,
              </p>
              <p className="text-xs md:text-sm">Government of India</p>
            </div>
          </div>

          {/* Right: Images */}
          <div className="hidden md:flex space-x-3">
            <img
              src={ministry}
              alt="Ministry"
              className="h-12 w-12 md:h-16 md:w-16"
            />
            <img
              src={casfos_dehradun}
              alt="CASFOS"
              className="h-12 w-12 md:h-16 md:w-16"
            />
            <img
              src={lifestyle_for_environment}
              alt="Lifestyle"
              className="h-12 w-12 md:h-16 md:w-16"
            />
          </div>
          {/* Mobile Menu Button */}
          <div
            className="md:hidden text-2xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </div>
        </div>

        {/* Navigation Links */}
        <div
          className={`md:flex justify-between items-center max-w-6xl mx-auto mt-2 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-center md:text-left">
            {[
              { id: "about", label: "Home" },
              { id: "about", label: "About Us" },
              { id: "history", label: "History" },
              { id: "reach", label: "How to Reach" },
              { id: "contact", label: "Contact Us" },
            ].map(({ id, label }) => (
              <Link
                key={id}
                to={id}
                smooth
                duration={500}
                offset={-230}
                className="cursor-pointer text-sm md:text-lg text-white hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {/* Certificate Link */}
            <a
              href="https://dfe.gov.in/uploads/documents/37102doc_certifcate-of-accreditation-coimbatore-file.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-sm md:text-lg text-white hover:underline"
            >
              Accreditation
            </a>
          </div>
          <button
            className="bg-white text-green-700 px-4 py-1 md:px-6 md:py-2 rounded-md transition-all duration-300 hover:bg-green-600 hover:text-white mt-2 md:mt-0"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Sections */}
      <div className="pt-[5rem]">
        {/* Section: About Us */}
        <section
          id="about"
          className="min-h-screen bg-white flex justify-center items-center px-4"
        >
          <div className="text-center max-w-4xl w-full pt-[10rem]">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">About Us</h1>
            <p className="text-sm md:text-lg text-justify mb-6">
              The Central Academy for State Forest Service, CASFOS, Coimbatore (erstwhile State Forest Service
              college) is one of the premier institutions under the aegis of
              Directorate of Forest Education, Ministry of Environment, Forests
              and Climate Change, which imparts professional training to newly
              recruited ACF’s and RFO’s and in-service training to the State Forest
              Service Officers of ACF and DCF ranks.
            </p>
            <img
              src={casfos_vana_vigyan}
              alt="CASFOS"
              className="h-auto w-auto object-cover mx-auto mb-6"
            />
            <p className="text-sm md:text-lg text-justify">
              The Academy was set up in the year 1980. Earlier to this, the
              State Forest Service Officers had been were trained at the
              erstwhile Indian Forest College, Dehradun and State Forest Service
              College, Burnihat . With the advent of developmental schemes in
              Forestry sector during the IV and V Five year plans, and launching
              of the Social Forestry Projects in many States, the Government of
              India felt the urgency of starting two more institutions to train
              the increasing number of officers specially from the State
              Services, and as a sequel to this the college was established on
              25th January, 1980, along with the State Forest Service College,
              Burnihat.
              <br />
              <b>Last updated: 05 Mar, 2025</b>
            </p>
          </div>
        </section>
      </div>

      <div className="pt-[5rem]">
        {/* Section: History of the Academy */}
        <section
          id="history"
          className="min-h-screen bg-gray-200 flex justify-center items-center px-4"
        >
          <div className="text-center max-w-4xl w-full pt-[2rem] pb-[2rem]">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              History of the Academy
            </h1>
            <p className="text-sm md:text-lg text-justify mb-6">
              The Central Academy for State Forest Service, Coimbatore is one of
              the premier institutions under the aegis of Directorate of Forest
              Education, Ministry of Environment, Forest and Climate Change,
              Dehradun which imparts Professional Induction Training to the
              newly recruited State Forest Officers (ACF) and Forest Range
              Officers (FRO) from various States and offers In-Service Training
              to the State Forest Service Officers of DCF, ACF, and FRO ranks.
              It also conducts General Awareness & Capacity building
              courses/workshops for other stake holders on importance of
              Forests, Forest Policy and Law to enable smooth interface between
              Forest and other departments
            </p>
            <img
              src={casfos_coimbatore_img4}
              alt="History"
              className="h-auto w-auto object-cover mx-auto mb-6"
            />
            <h1 className="text-left text-xl md:text-xl font-bold mb-4">
              Mandate
            </h1>
            <ul className="text-sm md:text-lg text-justify mb-6 list-disc list-inside">
              <li>
                To impart Professional training to the newly recruited State
                Forest Service officers and to bring them up as capable of
                meeting future challenges in the sphere of Forests, Wildlife &
                Environment through Capacity building & Knowledge sharing
              </li>
              <li>
                Strengthening existing management process and disseminating new
                concepts through continued education, in the shape of In-service
                Courses to augment their managerial skills with administrative &
                technical acumen.
              </li>
              <li>
                Conducting Special & Theme based Workshops and Refresher Courses
                covering emerging issues in forestry research and technology.
              </li>
              <li>
                Re-orienting forest education in tune with requisite parameters
                of ecology and environment.
              </li>
            </ul>
            <h1 className="text-left text-xl md:text-xl font-bold mb-4">
              Genesis of Forest Training in The Coimbatore
            </h1>
            <p className="text-sm md:text-lg text-justify">
              It is interesting to note that CASFOS Coimbatore played a major
              role in forestry education and training in South India. The
              Forestry Education commenced in India in 1867, based on the
              recommendation of Sir Dietrich Brandis, the First Inspector
              General of Forests. A Forest school was set up to train Rangers
              and Foresters at Dehradun in the year 1878 by the then North West
              Province which was later taken over by the Government of India and
              designated as the Imperial Forest College.
              <br />
              Next mile stone in Forestry Education in India was the
              establishment of Madras Forest College at Coimbatore in the year
              1912 by the then Madras Presidency with Mr. F. L. C. Cowley Brown,
              I.F.S., as its first Principal. Mr. F. A. Lodge, then Conservator
              of Forests in Coimbatore was instrumental in the establishment of
              this College. It was the second Forest Rangers College in India,
              after Dehra Dun. It was set up to meet the rising demand of
              trained Foresters in the country, especially those from the South
              India. <br />
              During the Second World War, the Madras Forest College was closed
              down and was revived in 1945 by C. R. Ranganathan as its first
              Indian Principal. It was taken over by Government of India in 1948
              to train more number of Forest Ranger Trainees as the demand was
              going up after the Independence. <br /> <br />
              <img
                src={casfos_coimbatore_img5}
                alt="History"
                className="h-auto w-auto object-cover mx-auto mb-6"
              />
              <img
                src={casfos_coimbatore_img3}
                alt="History"
                className="h-auto w-auto object-cover mx-auto mb-6"
              />
              The historic Forest Campus that housed the MFC which later became
              the “Southern Forest Rangers College” (SFRC) in the year 1955.
              Under the aegis of Government of India, 31 batches of Forest
              Rangers passed out from the SFRC after completing rigorous
              training of two years. SFRC has trained more than 4000 Forest
              Ranger officers between 1912 and 1988. The trainees included not
              only from India but also from Ceylon, Afghanistan, Uganda, Malaya,
              Ghana, Fiji, Laos, Sierra Leone, British Guyana, etc. <br />
              Due to policy decision of Government of India, that imparting of
              Induction and In-service Training to the Forestry Personnel below
              the rank of Assistant Conservator of Forests should rest with the
              State Government, the training activities came to an end on
              31.12.1987 in the Southern Forest Rangers College. <br />
              State Forest Service Officers were trained at the College,
              erstwhile Indian Forest College, Dehradun and State Forest Service
              College, Burnihat. With the advent of various developmental
              schemes in the Forestry sector during the IV and V Five year
              plans, and launching of the Social Forestry Projects in many
              States, the Government of India felt the urgency of starting two
              more institutions to train the increasing number of officers
              specially from the State Services, and as a sequel to this the
              State Forest Service College, Coimbatore was established on 25th
              January, 1980 under the aegis of Directorate of Forest Education,
              Ministry of Environment & Forests. Later it was rechristened as
              Central Academy for State Forest Service (CASFOS). <br />
              CASFOS Coimbatore was brought under the single administrative
              control of Director, IGNFA, Dehradun along with the other
              Academies as integration of all Forest Training Academies under a
              single command. (Vide order no. 15-15/2018-RT, dated 03-02-2022).{" "}
              <br />
              <b>Last updated: 05 Mar, 2025 </b>
            </p>
          </div>
        </section>
      </div>

      <div className="pt-[3rem]">
        {/* Section: How To Reach */}
        <section
          id="reach"
          className="min-h-fit bg-white flex justify-center items-center px-4"
        >
          <div className="text-center max-w-4xl w-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              How To Reach
            </h1>
            <p className="text-sm md:text-lg text-justify mb-6">
              Setup in the picturesque Forest Campus, R. S. Puram, Coimbatore,
              Tamil Nadu, the Central Academy for State Forest Service is
              situated at a distance of 5 km from the Coimbatore Railway Station
              and 12 Km. from Coimbatore International Airport. The Academy
              shares the space of the exquisite Forest Campus along with 2 more
              premier forestry institutions viz., <br />
              Tamil Nadu Forest Academy - TNFA (erstwhile Madras Forest College
              & SFRC), and Institute of Forest Genetics & Tree breeding -IFGTB,
              one of the leading research institutes under Indian Council Forest
              Research and Education. This campus also houses the famous 'GASS
              MUSEUM'.
            </p>
          </div>
        </section>
      </div>

      <div className="pt-[1rem]">
        {/* Section: Contact Us */}
        <section
          id="contact"
          className="min-h-fit bg-gray-200 flex justify-center items-center px-4"
        >
          <div className="text-center max-w-4xl w-full pt-[2rem] pb-[2rem]">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Contact Us</h1>
            <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-md bg-white">
              <h2 className="text-green-700 font-bold text-xl text-center">
                Central Academy for State Forest Service <br />
                Directorate of Forest Education <br />
                Ministry of Environment, Forest and Climate Change <br />
                Government of India
              </h2>
              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  <span className="text-green-600 text-2xl">📧</span>
                  <p className="text-gray-700 font-semibold">
                    <strong>Email :</strong> casfos-coimbatore@gov.in |
                    casfoscbe-trng@gov.in
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-3">
                <span className="text-green-600 text-2xl">📞</span>
                <p className="text-gray-700 font-semibold">
                  <strong>Phone :</strong> 0422-2450313
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainPage;

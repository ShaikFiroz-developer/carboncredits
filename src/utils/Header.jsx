import { React, useContext, useEffect } from "react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./logincontext";
import img from "./pngegg.png";

const Nav = () => {
  const [time, setTime] = useState("");
  const { userDetails } = useContext(LoginContext);
  const username = userDetails ? userDetails.name : "Guest";

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black shadow-xl flex justify-between h-full ">
      <div className="flex items-center">
        <div className="flex flex-col justify-start items-start">
          <img src={img} alt="Logo" className="h-12 object-contain" />
          <p className="text-sm text-white">Regulated by Government of India</p>
        </div>
      </div>
      <div className="w-fit gap-2 flex justify-between items-center bg-black text-white px-4">
        <h1>Hi Mr. {username}</h1>
        <h2>{time}</h2>
      </div>
    </div>
  );
};

export default Nav;
function Header() {
  const { logout, userDetails } = useContext(LoginContext);
  const navigate = useNavigate();

  const handlenav = () => {
    alert(userDetails.role);
    if (userDetails?.role == 1) {
      navigate(`/supplier-dashboard/${userDetails?.nfthash}`);
    } else if (userDetails.role == 2) {
      navigate(`/auditor-dashboard/${userDetails?.nfthash}`);
    } else if (userDetails.role == 3) {
      navigate(`/regulator-dashboard/${userDetails?.nfthash}`);
    } else if (userDetails.role == 4) {
      navigate(`/buyer-dashboard/${userDetails?.nfthash}`);
    }
  };

  return (
    <header className="w-[100vw] z-10 fixed top-0 bg-gray-800 p-1">
      <div className="flex justify-between items-center">
        {/* Left Side: Logo and Tagline */}
        <div className="flex items-center">
          <div className="flex flex-col justify-start items-start">
            <img src={img} alt="Logo" className="h-14 object-contain" />
            <p className="text-sm">Regulated by Government of India</p>
          </div>
        </div>

        {/* Right Side: Social Media Icons and Guidelines Button */}
        <div className="flex items-center">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mr-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-white h-6 w-6 hover:text-pink-800" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-white h-6 w-6 hover:text-blue-500" />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="text-white h-6 w-6 hover:text-green-500" />
            </a>
          </div>

          {/* Guidelines Button */}
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Guidelines
          </button>
        </div>
      </div>
      <div className="w-full bg-black h-12 p-2 rounded  flex justify-between">
        <div className="flex justify-center font-bold items-center">
          <button
            className="hover:text-orange-600"
            onClick={() => {
              handlenav();
            }}
          >
            Go to Dashboard
          </button>
        </div>
        <div className="flex justify-center items-center font-bold">
          <button
            onClick={() => {
              logout();
            }}
            className="hover:text-blue-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export { Header, Nav };

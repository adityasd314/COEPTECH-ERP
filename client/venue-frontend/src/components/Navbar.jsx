import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import ProfileCardA from "./ProfileCardA";  
function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthContext();
  const location = useLocation(); // Get current location

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 fix top-0 w-full z-20">
      <div className="max-w-screen-xl flex flex-wrap justify-items-center justify-between mx-auto p-4">
        <a
          href="https://coep.org.in/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/images/coeplogoo.png" className="h-12" alt="Ara Logo" />

          <span className="self-center ml-4 text-2xl text-gray-100 font-bold whitespace-nowrap" style={{ fontFamily: 'Your-Preferred-Font, sans-serif' }}>
            VBS
          </span>

        </a>

        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-8 h-10 justify-center text-sm text-gray-100 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ml-auto"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <path
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
            } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="text-gray-100 bg-transparent text-xl font-semibold flex flex-col gap-5 p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            <li className={`text-gray-100 hover:bg-white hover:text-pink-800 rounded-full px-4 py-2 border border-transparent transition-all duration-300 ${location.pathname === '/' ? 'bg-white text-pink-800' : ''}`}>
              <Link to="/">Home</Link>
            </li>
            <li className={`text-gray-100 hover:bg-white hover:text-pink-800 rounded-full px-4 py-2 border border-transparent transition-all duration-300 ${location.pathname === '/about' ? 'bg-white text-pink-800' : ''}`}>
              <Link to="/about">About</Link>
            </li>
            <li className={`md:hidden text-gray-100  hover:text-pink-800 rounded-full px-4 py-2 border border-transparent transition-all duration-300 ${location.pathname === '/login' ? ' text-pink-800' : ''}`}>
              <Link
                to="/login"
                className="md:hidden text-gray-100 hover:bg-white hover:text-pink-800 rounded-full py-2 border border-transparent transition-all duration-300"
              >
                Login
              </Link>
            </li>

            {user && (
              <>
                {user.role === "admin" && (
                  <li className={`text-gray-100 hover:bg-white hover:text-pink-800 rounded-full px-4 py-2 border border-transparent transition-all duration-300 ${location.pathname === '/admin' ? 'bg-white text-pink-800' : ''}`}>
                    <Link to="/admin">Admin Dashboard</Link>
                  </li>
                )}

                {(user.role === "hod" || user.role ==="teacher" )&& (
                  <li className={`text-gray-100 hover:bg-white hover:text-pink-800 rounded-full px-4 py-2 border border-transparent transition-all duration-300 ${location.pathname === '/manager' ? 'bg-white text-pink-800' : ''}`}>
                    <Link to="/manager">Faculty's Dashboard</Link>
                  </li>
                )}

                {(user.role === "student" || user.role === "teacher" || user.role === "hod") && (
                  <li className={`text-gray-100 hover:bg-white hover:text-pink-800 rounded-full px-4 py-2 border border-transparent transition-all duration-300 ${location.pathname === '/employee' ? 'bg-white text-pink-800' : ''}`}>
                    <Link to="/employee">User's Dashboard</Link>
                  </li>
                )}


                <li className="lg:hidden md:hidden hover:text-pink-800 my-auto flex items-center">
                  {!user ? (
                    <Link
                      to="/login"
                      className=" text-gray-100 hover:bg-white hover:text-pink-800 rounded-full px-4 py-2 border border-transparent transition-all duration-300"
                    >
                      Login
                    </Link>
                  ) : (
                      <li className="ml-3">
                        
                      </li>
                    )}
                </li>

              </>
            )}
          </ul>
        </div>
        <div className="hidden md:flex">
          {!user ? (
            <Link
              to="/login"
              className="text-xl font-semibold bg-white text-pink-800 rounded-full px-4 py-2 border border-transparent transition-all duration-300"
            >
              Login
            </Link>
          ) : (
              <div>
                <ProfileCardA />
              </div>
            )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;

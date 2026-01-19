/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAPI } from "../api";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
}

const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {        
    await fetchAPI("/auth/logout", { method: "POST" }, true);
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  }

  const getProfile = async () => {
    const res = await fetchAPI("/auth/profile", { method: "GET" });
    setUser(res.data);
  }

  useEffect(() => {
    getProfile();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 lg:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="sm:hidden text-gray-700 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h10" />
            </svg>
          </button>

          <Link to="/" className="flex items-center ml-2 sm:ml-4">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 mr-3"
              alt="Logo"
            />
            <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-800">
              Mini Quiz
            </span>
          </Link>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-gray-300 p-1"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="User"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50 top-full">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <Link
                    to="/profile"
                    className="block w-full px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </Link>
                </li>                
                <li>
                  <button
                    onClick={() => handleLogout()}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-gray-800"
                  >
                    <p className="text-sm text-red-800">Logout</p>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

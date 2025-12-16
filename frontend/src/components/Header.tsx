import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSession, useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicTestimonialPage = location.pathname.startsWith("/testimonial/");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 lg:px-12 flex justify-between items-center">
        <div className="hidden md:flex md:justify-between space-x-4 w-full">
          <h1 className="text-2xl font-bold">Testimonials App</h1>
          {!isPublicTestimonialPage && (
            <div className="flex items-center justify-between">
              {status === "loading" ? (
                <div className="text-gray-400">Loading...</div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    Sign In
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-6 pb-4">
          <Link to="/" className="block text-gray-300">
            Home
          </Link>
          <Link to="/customers" className="block text-gray-300">
            Customers
          </Link>
          <Link to="/features" className="block text-gray-300">
            Features
          </Link>
          <Link to="/integration" className="block text-gray-300">
            Integration
          </Link>
          <Link to="/pricing" className="block text-gray-300">
            Pricing
          </Link>
          <Link to="/login" className="block text-gray-300">
            Login
          </Link>
          <Link to="/about" className="block text-gray-300">
            About
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

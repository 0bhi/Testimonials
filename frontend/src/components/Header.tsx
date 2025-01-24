import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-slate-900 text-white p-4 border-b border-gray-800">
      <nav className="flex justify-between items-center">
        <div className="hidden md:flex md:justify-between space-x-4 w-full">
          <h1 className="text-2xl font-bold">Testimonials App</h1>
          {/* <div className="flex items-center justify-between space-x-4 ">
            <Link to="/" className="mr-4">
              Home
            </Link>
            <Link to="/customers" className="mr-4">
              Customers
            </Link>
            <Link to="/features" className="mr-4">
              Features
            </Link>
            <Link to="/integration" className="mr-4">
              Integration
            </Link>
            <Link to="/pricing" className="mr-4">
              Pricing
            </Link>
          </div> */}
          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="bg-blue-900 text-white px-4 py-2 rounded-lg"
            >
              Login
            </Link>
          </div>
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
        <div className="md:hidden mt-2 space-y-2">
          <Link to="/" className="block">
            Home
          </Link>
          <Link to="/customers" className="block">
            Customers
          </Link>
          <Link to="/features" className="block">
            Features
          </Link>
          <Link to="/integration" className="block">
            Integration
          </Link>
          <Link to="/pricing" className="block">
            Pricing
          </Link>
          <Link to="/login" className="block">
            Login
          </Link>
          <Link to="/about" className="block">
            About
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

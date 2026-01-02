import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSession, useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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

  // Hide header completely on testimonial submission pages
  if (isPublicTestimonialPage) {
    return null;
  }

  return (
    <header className="bg-apple-dark-bg/80 backdrop-blur-apple border-b border-apple-dark-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 lg:px-12 flex justify-between items-center">
        <div className="hidden md:flex md:justify-between md:items-center w-full">
          <Link
            to="/"
            className="text-title-sm font-semibold text-apple-gray-50 hover:text-apple-gray-300 transition-colors"
          >
            Testimonials
          </Link>
          {!isPublicTestimonialPage && (
            <div className="flex items-center gap-4">
              {status === "loading" ? (
                <div className="text-apple-gray-400 text-body-sm">
                  Loading...
                </div>
              ) : session ? (
                <div className="flex items-center gap-4">
                  <span className="text-body-sm text-apple-gray-300">
                    {session.user?.name || session.user?.email}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-apple bg-red-900/20 text-red-400 text-body-sm font-medium hover:bg-red-900/30 border border-red-800/30 transition-colors"
                  >
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignIn}
                  className="btn-apple-primary px-6 py-2.5 rounded-apple shadow-apple"
                >
                  Sign In
                </motion.button>
              )}
            </div>
          )}
        </div>
        <div className="md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="p-2 text-apple-gray-50 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-apple-dark-border bg-apple-dark-bg/95 backdrop-blur-apple"
          >
            <div className="px-6 py-4 space-y-3">
              {!isPublicTestimonialPage && (
                <>
                  {status === "loading" ? (
                    <div className="text-apple-gray-400 text-body-sm">
                      Loading...
                    </div>
                  ) : session ? (
                    <>
                      <div className="text-body-sm text-apple-gray-300 py-2">
                        {session.user?.name || session.user?.email}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 rounded-apple bg-red-900/20 text-red-400 text-body-sm font-medium hover:bg-red-900/30 border border-red-800/30 transition-colors text-left"
                      >
                        Sign Out
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSignIn}
                      className="w-full btn-apple-primary px-6 py-2.5 rounded-apple shadow-apple"
                    >
                      Sign In
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

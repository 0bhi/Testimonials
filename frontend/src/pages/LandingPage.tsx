import { Link, useNavigate } from "react-router-dom";
import testimoImage from "../assets/testimo.webp";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-6 py-8 lg:px-12 lg:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Effortlessly Gather Testimonials from Your Customers
            </h1>
            <p className="text-xl lg:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              We understand that collecting testimonials can be challenging. That's
              why we created Testimonial! In just minutes, you can easily collect
              text and video testimonials from your customers—no developers or
              website hosting required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={() => navigate("/signin")}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 group"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
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
              <button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 group"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    ></path>
                  </svg>
                  Sign Up
                </span>
              </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16">
              <img 
                src={testimoImage} 
                alt="Testimonials" 
                className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl" 
              />
            </div>
          </div>

          {/* Trusted Customers Section */}
          <div className="text-center mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Trusted Customers
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Nobody 😂
              </p>
              <div className="text-gray-500 text-sm">
                Be the first to join our growing community!
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Add Testimonials to Your Website—No Coding Required!
            </h2>
            <p className="text-xl lg:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Simply copy and paste our HTML code to showcase the Wall of Love (👉
              full version) on your website. It's compatible with all no-code
              platforms like Webflow, WordPress, and more!
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
                <div className="p-3 bg-blue-500/20 rounded-lg w-fit mx-auto mb-4 group-hover:bg-blue-500/30">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
                <p className="text-gray-400">Set up your testimonial collection in minutes, not hours.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
                <div className="p-3 bg-purple-500/20 rounded-lg w-fit mx-auto mb-4 group-hover:bg-purple-500/30">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Secure & Private</h3>
                <p className="text-gray-400">Your data is protected with enterprise-grade security.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
                <div className="p-3 bg-green-500/20 rounded-lg w-fit mx-auto mb-4 group-hover:bg-green-500/30">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Easy Integration</h3>
                <p className="text-gray-400">Works seamlessly with any website or platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

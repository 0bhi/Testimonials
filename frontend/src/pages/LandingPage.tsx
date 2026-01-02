import { Navigate, useNavigate } from "react-router-dom";
import testimoImage from "../assets/testimo.webp";
import { useSession } from "../contexts/AuthContext";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  const { data: session, status } = useSession();

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-apple-dark-bg flex items-center justify-center">
        <div className="text-apple-gray-400">Loading...</div>
      </div>
    );
  }

  // Redirect if authenticated
  if (status === "authenticated" && session) {
    return <Navigate to="/dashboard" replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <div className="min-h-screen bg-apple-dark-bg overflow-hidden">
      <div className="px-6 py-20 lg:px-16 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-40"
          >
            <motion.h1
              variants={itemVariants}
              className="text-display-sm lg:text-display font-semibold mb-8 text-apple-gray-50 leading-[1.05] tracking-[-0.02em]"
            >
              Collect Customer Testimonials
              <br />
              <span className="text-apple-blue-400">in Minutes</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-headline-sm lg:text-headline text-apple-gray-300 mb-16 max-w-2xl mx-auto leading-[1.5] font-light tracking-[-0.01em]"
            >
              No coding required. Collect text and video testimonials from your
              customers and embed them anywhere.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-40"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signin")}
                className="btn-apple-primary text-body-sm px-10 py-4.5 rounded-apple-xl shadow-apple-lg hover:shadow-apple-glow-md transition-all duration-300"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signup")}
                className="btn-apple text-body-sm px-10 py-4.5 rounded-apple-xl shadow-apple-lg hover:shadow-apple-md transition-all duration-300"
              >
                Sign Up
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-40">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
                className="bg-apple-dark-card rounded-apple-xl p-6 lg:p-10 shadow-apple-xl border border-apple-dark-border overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-apple-blue-500/5 to-transparent pointer-events-none" />
                <img
                  src={testimoImage}
                  alt="Testimonials"
                  className="w-full max-w-5xl mx-auto rounded-apple-lg shadow-apple-lg relative z-10"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-headline-sm lg:text-headline font-semibold text-apple-gray-50 mb-6 tracking-tight"
            >
              Add Testimonials to Your Website
              <br />
              <span className="text-apple-gray-400 font-light">
                No Coding Required
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-body text-apple-gray-400 mb-20 max-w-xl mx-auto leading-relaxed"
            >
              Simply copy and paste our HTML code. Works with Webflow,
              WordPress, and all no-code platforms.
            </motion.p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                  title: "Lightning Fast",
                  description:
                    "Set up in minutes. Start collecting testimonials instantly.",
                  color: "text-apple-blue-400",
                  bgColor: "bg-apple-blue-500/10",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                  title: "Secure & Private",
                  description:
                    "Enterprise-grade security. Your data stays protected.",
                  color: "text-emerald-400",
                  bgColor: "bg-emerald-500/10",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  ),
                  title: "Easy Integration",
                  description: "One line of code. Works everywhere.",
                  color: "text-purple-400",
                  bgColor: "bg-purple-500/10",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="card-apple text-left group"
                >
                  <div
                    className={`${feature.bgColor} ${feature.color} p-4 rounded-apple-lg mb-6 w-fit group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-title-sm font-semibold text-apple-gray-50 mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-apple-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

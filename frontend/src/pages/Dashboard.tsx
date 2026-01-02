import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useSession } from "../contexts/AuthContext";
import { motion } from "framer-motion";

interface Space {
  id: string;
  spaceName: string;
  headerTitle: string;
  customMessage: string;
  question1: string;
  question2: string;
  question3: string;
}

const Dashboard = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const navigate = useNavigate();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = session?.accessToken || null;
      const response = await api.getSpaces(token);
      const data = await response.json();
      setSpaces(data);
    } catch (error) {
      console.error("Error fetching spaces:", error);
      setError("Failed to load spaces. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchSpaces();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-apple-dark-bg flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-[3px] border-apple-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-body text-apple-gray-300 font-medium">
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-apple-dark-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="card-apple p-8 mb-6 border-red-800/30 bg-red-900/20">
            <svg
              className="w-12 h-12 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div className="text-title-sm font-semibold text-red-300 mb-2">
              Oops! Something went wrong
            </div>
            <div className="text-body-sm text-red-400">{error}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchSpaces}
            className="btn-apple-primary"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-apple-dark-bg">
      <div className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-headline-sm lg:text-headline font-semibold text-apple-gray-50 mb-2 tracking-tight">
              Welcome back!
            </h1>
            <p className="text-body text-apple-gray-300">
              Here's an overview of your testimonial spaces
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                ),
                value: "0",
                label: "Total Videos",
                description: "Across all spaces",
                color: "text-apple-blue-400",
                bgColor: "bg-apple-blue-900/20",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                ),
                value: spaces.length.toString(),
                label: "Total Spaces",
                description: "Active testimonial spaces",
                color: "text-purple-400",
                bgColor: "bg-purple-900/20",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                value: "0",
                label: "Total Responses",
                description: "Text and video combined",
                color: "text-emerald-400",
                bgColor: "bg-emerald-900/20",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="card-apple"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 ${stat.bgColor} ${stat.color} rounded-apple`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-title font-semibold text-apple-gray-50">
                      {stat.value}
                    </div>
                    <div className="text-body-sm text-apple-gray-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <div className="text-caption text-apple-gray-400">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Spaces */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-title font-semibold text-apple-gray-50">
                Your Spaces
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/create-space")}
                className="btn-apple-primary flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Space
              </motion.button>
            </div>

            {spaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space, index) => (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="card-apple cursor-pointer"
                    onClick={() => navigate(`/space/${space.spaceName}`)}
                  >
                    <h3 className="text-title-sm font-semibold text-apple-gray-50 mb-2">
                      {space.spaceName}
                    </h3>
                    <p className="text-body-sm text-apple-gray-300 line-clamp-2 leading-relaxed">
                      {space.headerTitle || "No description available"}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-apple p-12 text-center"
              >
                <h3 className="text-title font-semibold text-apple-gray-50 mb-3">
                  No Spaces Yet
                </h3>
                <p className="text-body text-apple-gray-300 mb-8 max-w-md mx-auto">
                  Create your first testimonial space to start collecting
                  feedback.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/create-space")}
                  className="btn-apple-primary inline-flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Your First Space
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

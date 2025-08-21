import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useSession } from "../contexts/AuthContext";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
            <svg
              className="w-12 h-12 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
                1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 
                0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div className="text-white text-lg font-medium mb-2">
              Oops! Something went wrong
            </div>
            <div className="text-gray-400 text-sm">{error}</div>
          </div>
          <button
            onClick={fetchSpaces}
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-medium text-white shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-6 py-8 lg:px-12 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-400 text-lg">
              Here's an overview of your testimonial spaces
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Total Videos</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Across all spaces</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {spaces.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Spaces</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Active testimonial spaces
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Total Responses</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Text and video combined
              </div>
            </div>
          </div>

          {/* Spaces */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                Your Spaces
              </h2>
              <button
                onClick={() => navigate("/create-space")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center gap-2 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
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
              </button>
            </div>

            {spaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space) => (
                  <div
                    key={space.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    onClick={() => navigate(`/space/${space.spaceName}`)}
                  >
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400">
                      {space.spaceName}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {space.headerTitle || "No description available"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  No Spaces Yet
                </h3>
                <p className="text-gray-400 mb-8">
                  Create your first testimonial space to start collecting
                  feedback.
                </p>
                <button
                  onClick={() => navigate("/create-space")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg flex items-center gap-2 mx-auto group"
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
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

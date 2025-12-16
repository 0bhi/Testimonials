import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useSession } from "../contexts/AuthContext";

const CreateSpace = () => {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [spaceName, setSpaceName] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [question1] = useState("");
  const [question2] = useState("");
  const [question3] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const token = session?.accessToken || null;
      await api.createSpace(
        {
          spaceName,
          headerTitle,
          customMessage,
          question1,
          question2,
          question3,
        },
        token
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating space:", error);
      setError("Failed to create space. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Create Space
        </h2>

        <div className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="spaceName">
              Space Name
            </label>
            <input
              id="spaceName"
              type="text"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-slate-800 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Space Name"
              required
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="headerTitle">
              Header Title
            </label>
            <input
              id="headerTitle"
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-slate-800 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Header Title"
              required
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="customMessage">
              Custom Message
            </label>
            <textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-slate-800 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Custom Message"
              rows={4}
              required
            />
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Guests will see your header and custom message, then a single
              feedback box (no questions).
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-center text-sm">{error}</div>
        )}
        <div className="flex items-center justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
          >
            {loading ? "Creating..." : "Create Space"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSpace;

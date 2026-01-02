import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useSession } from "../contexts/AuthContext";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-apple-dark-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        <div className="card-apple p-10 lg:p-12 shadow-apple-xl">
          <h2 className="text-headline-sm font-semibold mb-6 text-center text-apple-gray-50 tracking-tight">
            Create Space
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="spaceName" className="sr-only">
                  Space Name
                </label>
                <input
                  id="spaceName"
                  type="text"
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  className="input-apple"
                  placeholder="Space Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="headerTitle" className="sr-only">
                  Header Title
                </label>
                <input
                  id="headerTitle"
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  className="input-apple"
                  placeholder="Header Title"
                  required
                />
              </div>

              <div>
                <label htmlFor="customMessage" className="sr-only">
                  Custom Message
                </label>
                <textarea
                  id="customMessage"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="input-apple min-h-[120px] resize-none"
                  placeholder="Custom Message"
                  rows={4}
                  required
                />
              </div>

              <div>
                <p className="text-body-sm text-apple-gray-300 leading-relaxed">
                  Guests will see your header and custom message, then a single
                  feedback box (no questions).
                </p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-body-sm text-center bg-red-900/20 border border-red-800/30 rounded-apple p-3"
              >
                {error}
              </motion.div>
            )}

            <div className="flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-apple-primary w-full py-4 rounded-apple-lg shadow-apple-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Space"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateSpace;

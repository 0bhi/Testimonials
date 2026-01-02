import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { motion } from "framer-motion";

interface Space {
  id: string;
  spaceName: string;
  headerTitle: string;
  customMessage: string;
}

const Testimonial = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [mediaName, setMediaName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await api.getPublicSpace(spaceName!);
        const data = await response.json();
        setSpace(data);
      } catch (error) {
        console.error("Error fetching space:", error);
      }
    };

    fetchSpace();
  }, [spaceName]);

  const handleMediaFile = (file: File | null) => {
    if (!file) return;

    setMediaName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Please write your feedback before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.submitTestimonial(spaceName!, {
        content: trimmedContent,
        image: image || undefined,
        email,
        name,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setError("Failed to submit testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-dark-bg flex items-center justify-center p-4">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="card-apple p-10 lg:p-12 shadow-apple-xl w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <h2 className="text-headline-sm font-semibold mb-3 text-apple-gray-50 tracking-tight">
            Thank you for your submission!
          </h2>
          <p className="text-body text-apple-gray-300">
            Your testimonial has been submitted.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="card-apple p-10 lg:p-12 shadow-apple-xl w-full max-w-xl"
        >
          {space && (
            <>
              <h2 className="text-headline-sm font-semibold mb-4 text-center text-apple-gray-50 tracking-tight">
                {space.headerTitle}
              </h2>
              <p className="text-body text-apple-gray-300 mb-8 text-center leading-relaxed">
                {space.customMessage}
              </p>
            </>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-body-sm font-medium text-apple-gray-50 mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-apple"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-body-sm font-medium text-apple-gray-50 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-apple"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-body-sm font-medium text-apple-gray-50 mb-2"
              >
                Your Feedback
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-apple min-h-[120px] resize-none"
                placeholder="Share your experience or feedback..."
                rows={5}
                required
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-white mb-2">
                Image or Video (optional)
              </label>
              <div
                className={`w-full border-2 border-dashed rounded-apple p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-apple-blue-500 bg-apple-blue-900/20"
                    : "border-apple-dark-border bg-apple-dark-surface hover:border-apple-blue-500 hover:bg-apple-blue-900/10"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    handleMediaFile(file);
                  }
                }}
                onClick={() => {
                  const input = document.getElementById(
                    "media-input"
                  ) as HTMLInputElement | null;
                  input?.click();
                }}
              >
                <svg
                  className="w-12 h-12 text-apple-gray-400 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-body-sm text-apple-gray-300 mb-1">
                  Drag & drop an image or video here, or click to browse
                </p>
                {mediaName && (
                  <p className="text-caption text-apple-blue-400 mt-2 font-medium">
                    Selected: {mediaName}
                  </p>
                )}
              </div>
              <input
                id="media-input"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleMediaFile(file);
                }}
              />
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
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn-apple-primary w-full py-4 rounded-apple-lg shadow-apple-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Testimonial"
              )}
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Testimonial;
